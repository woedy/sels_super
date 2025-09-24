from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.authentication import JWTAuthentication

from elections.api.serializers import (
    PollingStationResultSubmissionRequestSerializer,
    PollingStationResultSubmissionSerializer,
)
from elections.models import PollingStationResultSubmission
from elections.services.submission_processing import process_submission
from regions.models import PollingStationAssignment


class SubmitPollingStationResultView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'submission'

    def post(self, request):
        idempotency_key = request.headers.get('X-Idempotency-Key') or request.headers.get('HTTP_X_IDEMPOTENCY_KEY')
        if not idempotency_key:
            payload = {
                'message': 'Errors',
                'errors': {'idempotency_key': ['Provide an X-Idempotency-Key header.']},
            }
            return Response(payload, status=status.HTTP_400_BAD_REQUEST)

        existing_submission = PollingStationResultSubmission.objects.filter(
            submitted_by=request.user,
            idempotency_key=idempotency_key,
        ).first()
        if existing_submission:
            serializer = PollingStationResultSubmissionSerializer(existing_submission)
            payload = {'message': 'Duplicate', 'data': serializer.data}
            return Response(payload, status=status.HTTP_200_OK)

        serializer = PollingStationResultSubmissionRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        election = data['election']
        polling_station = data['polling_station']

        conflict = PollingStationResultSubmission.objects.filter(
            election=election,
            polling_station=polling_station,
            status=PollingStationResultSubmission.Status.PROCESSED,
        ).exists()
        if conflict:
            payload = {
                'message': 'Errors',
                'errors': {
                    'polling_station_id': ['Results for this polling station have already been processed.'],
                },
            }
            return Response(payload, status=status.HTTP_409_CONFLICT)

        if not getattr(request.user, 'is_admin', False):
            has_assignment = PollingStationAssignment.objects.filter(
                polling_station=polling_station,
                user=request.user,
                is_active=True,
            ).exists()
            if not has_assignment:
                payload = {
                    'message': 'Errors',
                    'errors': {
                        'polling_station_id': ['You are not assigned to this polling station.'],
                    },
                }
                return Response(payload, status=status.HTTP_403_FORBIDDEN)

        pending = PollingStationResultSubmission.objects.filter(
            election=election,
            polling_station=polling_station,
            status__in=[
                PollingStationResultSubmission.Status.RECEIVED,
                PollingStationResultSubmission.Status.PROCESSING,
            ],
        ).exists()
        if pending:
            payload = {
                'message': 'Errors',
                'errors': {
                    'polling_station_id': ['A submission for this polling station is currently being processed.'],
                },
            }
            return Response(payload, status=status.HTTP_409_CONFLICT)

        structured_payload = {
            'metadata': data.get('metadata', {}),
            'presidential_results': [
                {
                    'election_prez_id': entry['candidate'].election_prez_id,
                    'votes': entry['votes'],
                }
                for entry in data.get('presidential_results', [])
            ],
            'parliamentary_results': [
                {
                    'election_parl_id': entry['candidate'].election_parl_id,
                    'votes': entry['votes'],
                }
                for entry in data.get('parliamentary_results', [])
            ],
        }

        submission = PollingStationResultSubmission.objects.create(
            election=election,
            polling_station=polling_station,
            submitted_by=request.user,
            idempotency_key=idempotency_key,
            source='data_admin',
            raw_payload=request.data,
            structured_payload=structured_payload,
        )

        try:
            process_submission(
                submission,
                presidential_results=data.get('presidential_results'),
                parliamentary_results=data.get('parliamentary_results'),
            )
        except Exception as exc:  # pragma: no cover - surfaced to API consumer
            serializer = PollingStationResultSubmissionSerializer(submission)
            payload = {
                'message': 'Errors',
                'errors': {'detail': [str(exc)]},
                'data': serializer.data,
            }
            return Response(payload, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        submission.refresh_from_db()
        serializer = PollingStationResultSubmissionSerializer(submission)
        payload = {'message': 'Successful', 'data': serializer.data}
        return Response(payload, status=status.HTTP_201_CREATED)


class PollingStationSubmissionAuditView(APIView):
    authentication_classes = [JWTAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'audit'

    def get(self, request):
        submissions = (
            PollingStationResultSubmission.objects.select_related(
                'election', 'polling_station', 'submitted_by'
            )
            .order_by('-created_at')[:20]
        )
        serializer = PollingStationResultSubmissionSerializer(submissions, many=True)
        payload = {'message': 'Successful', 'data': serializer.data}
        return Response(payload, status=status.HTTP_200_OK)
