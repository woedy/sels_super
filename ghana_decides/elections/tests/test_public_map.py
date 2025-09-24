import asyncio

from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from channels.testing import WebsocketCommunicator
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import TestCase, TransactionTestCase, override_settings
from django.urls import reverse
from rest_framework.test import APITestCase

from candidates.models import Party, PresidentialCandidate
from elections.models import (
    Election,
    ElectionPresidentialCandidate,
    PollingStationResultSubmission,
)
from elections.services.public_map_payloads import build_map_payload
from elections.services.submission_processing import process_submission
from ghana_decides_proj.asgi import application
from regions.models import (
    Constituency,
    ConstituencyLayerCoordinate,
    ElectoralArea,
    ElectoralAreaLayerCoordinate,
    PollingStation,
    Region,
    RegionLayerCoordinate,
)

User = get_user_model()


class MapFixtureMixin:
    def setUp(self):
        super().setUp()
        cache.clear()

        self.data_admin = User.objects.create_user(
            email="admin@example.com",
            password="pass1234",
            first_name="Data",
            last_name="Admin",
        )

        self.region = Region.objects.create(region_name="Ashanti", election_year="2024")
        RegionLayerCoordinate.objects.bulk_create(
            [
                RegionLayerCoordinate(region=self.region, lat=6.5, lng=-2.0),
                RegionLayerCoordinate(region=self.region, lat=6.5, lng=-1.5),
                RegionLayerCoordinate(region=self.region, lat=6.0, lng=-1.5),
                RegionLayerCoordinate(region=self.region, lat=6.0, lng=-2.0),
            ]
        )

        self.constituency = Constituency.objects.create(
            region=self.region,
            constituency_name="Kumasi Central",
            election_year="2024",
        )
        ConstituencyLayerCoordinate.objects.bulk_create(
            [
                ConstituencyLayerCoordinate(constituency=self.constituency, lat=6.45, lng=-1.9),
                ConstituencyLayerCoordinate(constituency=self.constituency, lat=6.45, lng=-1.7),
                ConstituencyLayerCoordinate(constituency=self.constituency, lat=6.25, lng=-1.7),
                ConstituencyLayerCoordinate(constituency=self.constituency, lat=6.25, lng=-1.9),
            ]
        )

        self.electoral_area = ElectoralArea.objects.create(
            constituency=self.constituency,
            electoral_area_name="Adum",
            election_year="2024",
        )
        ElectoralAreaLayerCoordinate.objects.bulk_create(
            [
                ElectoralAreaLayerCoordinate(electoral_area=self.electoral_area, lat=6.4, lng=-1.85),
                ElectoralAreaLayerCoordinate(electoral_area=self.electoral_area, lat=6.4, lng=-1.8),
                ElectoralAreaLayerCoordinate(electoral_area=self.electoral_area, lat=6.3, lng=-1.8),
                ElectoralAreaLayerCoordinate(electoral_area=self.electoral_area, lat=6.3, lng=-1.85),
            ]
        )

        self.polling_station_one = PollingStation.objects.create(
            electoral_area=self.electoral_area,
            polling_station_name="Adum Methodist",
            election_year="2024",
        )
        self.polling_station_two = PollingStation.objects.create(
            electoral_area=self.electoral_area,
            polling_station_name="Adum Anglican",
            election_year="2024",
        )

        party_a = Party.objects.create(party_full_name="Party A", party_initial="PA")
        party_b = Party.objects.create(party_full_name="Party B", party_initial="PB")

        candidate_a = PresidentialCandidate.objects.create(
            party=party_a,
            first_name="Ama",
            last_name="Mensah",
        )
        candidate_b = PresidentialCandidate.objects.create(
            party=party_b,
            first_name="Kojo",
            last_name="Mensah",
        )

        self.election = Election.objects.create(year="2024")
        self.election_candidate_a = ElectionPresidentialCandidate.objects.create(
            election=self.election,
            candidate=candidate_a,
            ballot_number=1,
        )
        self.election_candidate_b = ElectionPresidentialCandidate.objects.create(
            election=self.election,
            candidate=candidate_b,
            ballot_number=2,
        )

    def _submit_result(self, polling_station, votes_a, votes_b, key):
        submission = PollingStationResultSubmission.objects.create(
            election=self.election,
            polling_station=polling_station,
            submitted_by=self.data_admin,
            idempotency_key=key,
            source="test",
            raw_payload={},
            structured_payload={},
        )
        presidential_results = []
        if votes_a is not None:
            presidential_results.append(
                {"candidate": self.election_candidate_a, "votes": votes_a}
            )
        if votes_b is not None:
            presidential_results.append(
                {"candidate": self.election_candidate_b, "votes": votes_b}
            )
        process_submission(submission, presidential_results=presidential_results)
        return submission


class MapPayloadTests(MapFixtureMixin, TestCase):
    def test_build_map_payload_includes_features_and_reporting(self):
        self._submit_result(self.polling_station_one, 150, 120, "first")

        payload = build_map_payload(self.election.election_id, scope="national")

        self.assertEqual(payload["scope"]["level"], "national")
        self.assertEqual(payload["summary"]["reporting"], 1)
        self.assertAlmostEqual(payload["summary"]["reporting_percent"], 50.0)
        self.assertGreater(len(payload["options"].get("regions", [])), 0)

        features = payload["features"]
        self.assertEqual(len(features), 1)
        feature = features[0]
        self.assertEqual(feature["id"], self.region.region_id)
        self.assertIsNotNone(payload["feature_collection"]["features"][0]["geometry"])

        # Ensure cached payload is reused
        cached = cache.get(f"results:map:{self.election.election_id}:national")
        self.assertIsNotNone(cached)

        regional_payload = build_map_payload(
            self.election.election_id,
            scope="region",
            scope_id=self.region.region_id,
        )
        self.assertEqual(regional_payload["scope"]["level"], "region")
        self.assertGreater(len(regional_payload["features"]), 0)
        self.assertGreater(len(regional_payload["options"].get("constituencies", [])), 0)


@override_settings(CHANNEL_LAYERS={'default': {'BACKEND': 'channels.layers.InMemoryChannelLayer'}})
class MapWebsocketTests(MapFixtureMixin, TransactionTestCase):
    reset_sequences = True

    def test_consumer_streams_snapshot_and_updates(self):
        self._submit_result(self.polling_station_one, 150, 120, "first")

        async def run_flow():
            communicator = WebsocketCommunicator(
                application,
                "/ws/live-map-consumer/",
                headers=[(b"origin", b"http://testserver")],
            )
            connected, _ = await communicator.connect()
            self.assertTrue(connected)

            await communicator.send_json_to(
                {
                    "action": "subscribe",
                    "election_id": self.election.election_id,
                    "scope": "national",
                }
            )

            snapshot = await communicator.receive_json_from()
            self.assertEqual(snapshot["type"], "snapshot")
            self.assertEqual(snapshot["payload"]["scope"]["level"], "national")

            await database_sync_to_async(self._submit_result)(
                self.polling_station_two,
                100,
                180,
                "second",
            )

            update = await communicator.receive_json_from()
            self.assertEqual(update["type"], "update")
            self.assertEqual(update["payload"]["summary"]["reporting"], 2)

            try:
                await communicator.disconnect()
            except asyncio.CancelledError:
                pass

        async_to_sync(run_flow)()


class MapApiTests(MapFixtureMixin, APITestCase):
    def test_public_map_endpoint_returns_payload(self):
        self._submit_result(self.polling_station_one, 150, 120, "first")
        url = reverse("elections:public_map_payload")
        response = self.client.get(url, {"election_id": self.election.election_id})

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["scope"]["level"], "national")
        self.assertIn("feature_collection", body)
