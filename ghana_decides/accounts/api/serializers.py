from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from elections.models import Election
from regions.models import PollingStationAssignment
from user_profile.models import UserProfile

User = get_user_model()


class AllUsersProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = [
            'user_id',
            'gender',
            'photo',
            'phone',
        ]

class AllUsersSerializer(serializers.ModelSerializer):
    personal_info = AllUsersProfileSerializer(many=False)
    class Meta:
        model = User
        fields = [
            'user_id',
            'email',
            'first_name',
            'last_name',
            'user_type',

            'personal_info'
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    personal_info = AllUsersProfileSerializer(many=False)
    class Meta:
        model = User
        fields = [
            'user_id',
            'email',
            'first_name',
            'last_name',
            'user_type',

            'personal_info'
        ]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'password2', 'user_type']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def save(self):
        user = User(
            email=self.validated_data['email'].lower(),
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],

        )
        password = self.validated_data['password']
        # password2 = self.validated_data['password2']
        # if password != password2:
        #     raise serializers.ValidationError({'password': 'Passwords must match.'})
        user.set_password(password)
        user.is_active = True
        user.save()

        return user




class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)


class PollingStationAssignmentSerializer(serializers.Serializer):
    polling_station_id = serializers.CharField()
    polling_station_name = serializers.CharField()
    electoral_area_id = serializers.CharField()
    electoral_area_name = serializers.CharField()
    constituency_id = serializers.CharField()
    constituency_name = serializers.CharField()
    region_id = serializers.CharField()
    region_name = serializers.CharField()
    role = serializers.CharField()


class CorrespondentTokenObtainPairSerializer(TokenObtainPairSerializer):
    fcm_token = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        fcm_token = attrs.pop('fcm_token', None)
        data = super().validate(attrs)

        user = self.user

        if user.user_type not in {'Correspondent', 'Polling Agent'}:
            raise AuthenticationFailed('This account is not authorized for correspondent access.')

        if not user.email_verified:
            raise AuthenticationFailed('Please verify your email address before signing in.')

        assignments = (
            PollingStationAssignment.objects.filter(user=user, is_active=True)
            .select_related(
                'polling_station__electoral_area__constituency__region'
            )
            .order_by('polling_station__polling_station_name')
        )

        assignment_payload = []
        for assignment in assignments:
            polling_station = assignment.polling_station
            electoral_area = polling_station.electoral_area
            constituency = electoral_area.constituency
            region = constituency.region
            assignment_payload.append(
                {
                    'polling_station_id': polling_station.polling_station_id,
                    'polling_station_name': polling_station.polling_station_name,
                    'electoral_area_id': electoral_area.electoral_area_id,
                    'electoral_area_name': electoral_area.electoral_area_name,
                    'constituency_id': constituency.constituency_id,
                    'constituency_name': constituency.constituency_name,
                    'region_id': region.region_id,
                    'region_name': region.region_name,
                    'role': assignment.role,
                }
            )

        if not assignment_payload:
            raise AuthenticationFailed('No active polling station assignments found for this account.')

        user_profile = getattr(user, 'userprofile', None)
        photo = user_profile.photo.url if user_profile and user_profile.photo else None

        if fcm_token:
            user.fcm_token = fcm_token
            user.save(update_fields=['fcm_token'])

        election = Election.objects.order_by('-year').first()

        data.update(
            {
                'user': {
                    'user_id': user.user_id,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'photo': photo,
                    'user_type': user.user_type,
                },
                'assignments': assignment_payload,
            }
        )

        if election:
            data['default_election'] = {
                'election_id': election.election_id,
                'year': election.year,
            }

        return data
