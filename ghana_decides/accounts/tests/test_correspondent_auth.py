from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from elections.models import Election
from regions.models import (
    Constituency,
    ElectoralArea,
    PollingStation,
    PollingStationAssignment,
    Region,
)


class CorrespondentTokenAuthTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            email='correspondent@example.com',
            password='StrongPass!23',
            first_name='Ama',
            last_name='Mensah',
        )
        self.user.user_type = 'Correspondent'
        self.user.email_verified = True
        self.user.save()

        self.region = Region.objects.create(region_name='Greater Accra')
        self.constituency = Constituency.objects.create(
            region=self.region,
            constituency_name='Ablekuma West',
        )
        self.electoral_area = ElectoralArea.objects.create(
            constituency=self.constituency,
            electoral_area_name='Dansoman',
        )
        self.polling_station = PollingStation.objects.create(
            electoral_area=self.electoral_area,
            polling_station_name='Dansoman Community School',
        )
        PollingStationAssignment.objects.create(
            polling_station=self.polling_station,
            user=self.user,
            role='Correspondent',
        )

        self.election = Election.objects.create(year='2024')

    def test_correspondent_can_request_jwt_pair(self):
        url = reverse('accounts:login_correspondent')
        payload = {
            'email': self.user.email,
            'password': 'StrongPass!23',
            'fcm_token': 'test-device-token',
        }

        response = self.client.post(url, payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        body = response.json()

        self.assertIn('access', body)
        self.assertIn('refresh', body)
        self.assertIn('user', body)
        self.assertIn('assignments', body)
        self.assertGreaterEqual(len(body['assignments']), 1)

        self.user.refresh_from_db()
        self.assertEqual(self.user.fcm_token, 'test-device-token')

    def test_non_correspondent_rejected(self):
        other_user = get_user_model().objects.create_user(
            email='viewer@example.com',
            password='ViewerPass!23',
            first_name='Kojo',
            last_name='Owusu',
        )
        other_user.user_type = 'Presenter'
        other_user.email_verified = True
        other_user.save()

        url = reverse('accounts:login_correspondent')
        response = self.client.post(
            url,
            {'email': other_user.email, 'password': 'ViewerPass!23'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
