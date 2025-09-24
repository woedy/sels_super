import asyncio

from asgiref.sync import async_to_sync
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TransactionTestCase, override_settings
from rest_framework.authtoken.models import Token

from candidates.models import Party, PresidentialCandidate
from elections.models import (
    Election,
    ElectionPresidentialCandidate,
    PollingStationResultSubmission,
)
from elections.services.presenter_payloads import build_presenter_payload
from elections.services.submission_processing import process_submission
from ghana_decides_proj.asgi import application
from regions.models import Constituency, ElectoralArea, PollingStation, Region

User = get_user_model()


@override_settings(CHANNEL_LAYERS={'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}})
class PresenterRealtimeTests(TransactionTestCase):
    reset_sequences = True

    def setUp(self):
        super().setUp()
        cache.clear()

        self.presenter_user = User.objects.create_user(
            email='presenter@example.com',
            password='pass1234',
            first_name='Present',
            last_name='Er',
        )
        self.presenter_user.user_type = 'Presenter'
        self.presenter_user.save(update_fields=['user_type'])
        self.presenter_token, _ = Token.objects.get_or_create(user=self.presenter_user)

        self.data_admin = User.objects.create_user(
            email='admin@example.com',
            password='pass1234',
            first_name='Data',
            last_name='Admin',
        )

        self.region = Region.objects.create(region_name='Ashanti', election_year='2024')
        self.constituency = Constituency.objects.create(
            region=self.region,
            constituency_name='Kumasi Central',
            election_year='2024',
        )
        self.electoral_area = ElectoralArea.objects.create(
            constituency=self.constituency,
            electoral_area_name='Adum',
            election_year='2024',
        )
        self.polling_station_one = PollingStation.objects.create(
            electoral_area=self.electoral_area,
            polling_station_name='Adum Methodist',
            election_year='2024',
        )
        self.polling_station_two = PollingStation.objects.create(
            electoral_area=self.electoral_area,
            polling_station_name='Adum Anglican',
            election_year='2024',
        )

        self.party_a = Party.objects.create(party_full_name='Party A', party_initial='PA')
        self.party_b = Party.objects.create(party_full_name='Party B', party_initial='PB')

        self.president_a = PresidentialCandidate.objects.create(
            party=self.party_a,
            first_name='Ama',
            last_name='Mensah',
        )
        self.president_b = PresidentialCandidate.objects.create(
            party=self.party_b,
            first_name='Kojo',
            last_name='Mensah',
        )

        self.election = Election.objects.create(year='2024')
        self.election_candidate_a = ElectionPresidentialCandidate.objects.create(
            election=self.election,
            candidate=self.president_a,
            ballot_number=1,
        )
        self.election_candidate_b = ElectionPresidentialCandidate.objects.create(
            election=self.election,
            candidate=self.president_b,
            ballot_number=2,
        )

    def _submit_result(self, polling_station, votes_a, votes_b, key):
        submission = PollingStationResultSubmission.objects.create(
            election=self.election,
            polling_station=polling_station,
            submitted_by=self.data_admin,
            idempotency_key=key,
            source='test',
            raw_payload={},
            structured_payload={},
        )
        presidential_results = []
        if votes_a is not None:
            presidential_results.append({
                'candidate': self.election_candidate_a,
                'votes': votes_a,
            })
        if votes_b is not None:
            presidential_results.append({
                'candidate': self.election_candidate_b,
                'votes': votes_b,
            })
        process_submission(submission, presidential_results=presidential_results)
        return submission

    def test_presenter_payload_tracks_history_and_deltas(self):
        self._submit_result(self.polling_station_one, 150, 120, 'first')
        payload_first = build_presenter_payload(self.election.election_id, scope='national')

        self.assertEqual(payload_first['leader']['candidate_id'], self.election_candidate_a.election_prez_id)
        self.assertEqual(len(payload_first['history']), 2)
        self.assertAlmostEqual(payload_first['history'][1]['vote_share_delta'], 55.6)
        self.assertEqual(payload_first['history'][1]['turnout_change'], 270)

        self._submit_result(self.polling_station_two, 100, 180, 'second')
        payload_second = build_presenter_payload(self.election.election_id, scope='national')

        self.assertEqual(payload_second['leader']['candidate_id'], self.election_candidate_b.election_prez_id)
        self.assertEqual(len(payload_second['history']), 4)
        self.assertAlmostEqual(payload_second['history'][1]['vote_share_delta'], 54.5)
        self.assertEqual(payload_second['history'][1]['turnout_change'], 280)

    def test_presenter_consumer_requires_token_and_streams_updates(self):
        communicator = WebsocketCommunicator(
            application,
            '/ws/presenter-dashboard/',
            headers=[(b'origin', b'http://testserver')],
        )
        connected, _ = async_to_sync(communicator.connect)()
        self.assertFalse(connected)

        communicator = WebsocketCommunicator(
            application,
            f'/ws/presenter-dashboard/?token={self.presenter_token.key}',
            headers=[(b'origin', b'http://testserver')],
        )
        connected, _ = async_to_sync(communicator.connect)()
        self.assertTrue(connected)
        try:
            async_to_sync(communicator.disconnect)()
        except asyncio.CancelledError:
            pass
