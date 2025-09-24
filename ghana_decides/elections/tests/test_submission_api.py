from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from candidates.models import ParliamentaryCandidate, Party, PresidentialCandidate
from elections.models import (
    Election,
    ElectionParliamentaryCandidate,
    ElectionPresidentialCandidate,
    ParliamentaryCandidatePollingStationVote,
    PollingStationResultSubmission,
    PresidentialCandidatePollingStationVote,
)
from regions.models import (
    Constituency,
    ElectoralArea,
    PollingStation,
    PollingStationAssignment,
    Region,
)


User = get_user_model()


class PollingStationResultSubmissionAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='admin@example.com',
            password='testpass',
            first_name='Admin',
            last_name='User',
            is_staff=True,
        )
        self.token, _ = Token.objects.get_or_create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {self.token.key}')

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
        self.polling_station = PollingStation.objects.create(
            electoral_area=self.electoral_area,
            polling_station_name='Adum Methodist',
            election_year='2024',
        )

        PollingStationAssignment.objects.create(
            polling_station=self.polling_station,
            user=self.user,
            role='data_admin',
        )

        self.party = Party.objects.create(party_full_name='Party A', party_initial='PA')
        self.pres_candidate = PresidentialCandidate.objects.create(
            party=self.party,
            first_name='John',
            last_name='Doe',
        )
        self.parl_candidate = ParliamentaryCandidate.objects.create(
            party=self.party,
            constituency=self.constituency,
            first_name='Jane',
            last_name='Doe',
        )

        self.election = Election.objects.create(year='2024')
        self.election_pres_candidate = ElectionPresidentialCandidate.objects.create(
            election=self.election,
            candidate=self.pres_candidate,
            ballot_number=1,
        )
        self.election_parl_candidate = ElectionParliamentaryCandidate.objects.create(
            election=self.election,
            candidate=self.parl_candidate,
            ballot_number=1,
        )

    def _submission_payload(self):
        return {
            'election_id': self.election.election_id,
            'polling_station_id': self.polling_station.polling_station_id,
            'presidential_results': [
                {
                    'election_prez_id': self.election_pres_candidate.election_prez_id,
                    'votes': 150,
                }
            ],
            'parliamentary_results': [
                {
                    'election_parl_id': self.election_parl_candidate.election_parl_id,
                    'votes': 120,
                }
            ],
            'metadata': {'source_form': 'FORM 1C'},
        }

    def test_submission_processed_and_idempotent(self):
        url = reverse('elections:submit_polling_station_result')
        payload = self._submission_payload()

        response = self.client.post(url, payload, format='json', HTTP_X_IDEMPOTENCY_KEY='idem-1')
        self.assertEqual(response.status_code, 201, response.data)
        submission = PollingStationResultSubmission.objects.get()
        self.assertEqual(submission.status, PollingStationResultSubmission.Status.PROCESSED)

        prez_vote = PresidentialCandidatePollingStationVote.objects.get(
            election=self.election,
            prez_candidate=self.election_pres_candidate,
            polling_station=self.polling_station,
        )
        self.assertEqual(prez_vote.total_votes, 150)

        parl_vote = ParliamentaryCandidatePollingStationVote.objects.get(
            election=self.election,
            parl_candidate=self.election_parl_candidate,
            polling_station=self.polling_station,
        )
        self.assertEqual(parl_vote.total_votes, 120)

        self.election_pres_candidate.refresh_from_db()
        self.assertEqual(self.election_pres_candidate.total_votes, 150)

        # Second request with same idempotency key returns cached result.
        response_dup = self.client.post(url, payload, format='json', HTTP_X_IDEMPOTENCY_KEY='idem-1')
        self.assertEqual(response_dup.status_code, 200, response_dup.data)
        self.assertEqual(PollingStationResultSubmission.objects.count(), 1)

        # New idempotency key should be rejected because station already processed.
        response_conflict = self.client.post(url, payload, format='json', HTTP_X_IDEMPOTENCY_KEY='idem-2')
        self.assertEqual(response_conflict.status_code, 409)

    def test_submission_requires_idempotency_key(self):
        url = reverse('elections:submit_polling_station_result')
        response = self.client.post(url, self._submission_payload(), format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('idempotency_key', response.data['errors'])

    def test_audit_log_returns_recent_submissions(self):
        url = reverse('elections:submit_polling_station_result')
        self.client.post(url, self._submission_payload(), format='json', HTTP_X_IDEMPOTENCY_KEY='idem-3')

        audit_url = reverse('elections:polling_station_submission_audit')
        response = self.client.get(audit_url)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data['data']), 1)
        first_entry = response.data['data'][0]
        self.assertEqual(first_entry['polling_station_id'], self.polling_station.polling_station_id)
        self.assertEqual(first_entry['status'], PollingStationResultSubmission.Status.PROCESSED)

    def test_unassigned_user_cannot_submit(self):
        other_user = User.objects.create_user(
            email='other@example.com',
            password='testpass',
            first_name='Other',
            last_name='User',
        )
        other_token, _ = Token.objects.get_or_create(user=other_user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {other_token.key}')

        url = reverse('elections:submit_polling_station_result')
        response = self.client.post(url, self._submission_payload(), format='json', HTTP_X_IDEMPOTENCY_KEY='idem-4')
        self.assertEqual(response.status_code, 403)
        self.assertIn('polling_station_id', response.data['errors'])
