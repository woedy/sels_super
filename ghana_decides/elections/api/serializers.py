from rest_framework import serializers

from candidates.api.serializers import AllPresidentialCandidateSerializer, AllParliamentaryCandidateSerializer
from elections.models import (
    Election,
    ElectionParliamentaryCandidate,
    ElectionPresidentialCandidate,
    ParliamentaryCandidatePollingStationVote,
    PollingStationResultSubmission,
    PresidentialCandidateConstituencyVote,
    PresidentialCandidateElectoralAreaVote,
    PresidentialCandidatePollingStationVote,
    PresidentialCandidateRegionalVote,
)
from regions.api.serializers import AllElectoralAreaSerializer, AllRegionsSerializer, AllConstituenciesSerializer
from regions.models import PollingStation


class ElectionParliamentaryCandidateSerializer(serializers.ModelSerializer):
    candidate = AllPresidentialCandidateSerializer(many=False)
    class Meta:
        model = ElectionParliamentaryCandidate
        fields = [
            'election_parl_id',
            'candidate',
            'total_votes',
            'total_votes_percent',
            'created_at',
        ]




class ElectionPresidentialCandidateSerializer(serializers.ModelSerializer):
    candidate = AllPresidentialCandidateSerializer(many=False)
    class Meta:
        model = ElectionPresidentialCandidate
        fields = [
            'election_prez_id',
            'candidate',
              'ballot_number',
            'total_votes',
            'total_votes_percent',
            'parliamentary_seat',
            'created_at',
        ]



class PresidentialCandidateRegionalVoteSerializer(serializers.ModelSerializer):
    region = AllRegionsSerializer(many=False)
    prez_candidate = ElectionPresidentialCandidateSerializer(many=False)
    class Meta:
        model = PresidentialCandidateRegionalVote
        fields = [
            'prez_candidate',
            'region',
            'total_votes',
            'total_votes_percent',
            'parliamentary_seat',
        ]

class PresidentialCandidateConstituencyVoteSerializer(serializers.ModelSerializer):
    constituency = AllConstituenciesSerializer(many=False)
    prez_candidate = ElectionPresidentialCandidateSerializer(many=False)
    class Meta:
        model = PresidentialCandidateConstituencyVote
        fields = [
            'prez_candidate',
            'constituency',
            'total_votes',
            'total_votes_percent',
            'won',
        ]



class PresidentialCandidateElectoralAreaVoteSerializer(serializers.ModelSerializer):
    electoral_area = AllElectoralAreaSerializer(many=False)
    prez_candidate = ElectionPresidentialCandidateSerializer(many=False)
    class Meta:
        model = PresidentialCandidateElectoralAreaVote
        fields = [
            'prez_candidate',
            'electoral_area',
            'total_votes',
            'total_votes_percent',
            'won',
        ]


class ElectionDetailSerializer(serializers.ModelSerializer):
    winner = ElectionPresidentialCandidateSerializer(many=False)
    first_runner_up = ElectionPresidentialCandidateSerializer(many=False)
    second_runner_up = ElectionPresidentialCandidateSerializer(many=False)
    presidential_candidates_regional = PresidentialCandidateRegionalVoteSerializer(many=True)
    presidential_candidates_constituency = PresidentialCandidateConstituencyVoteSerializer(many=True)
    class Meta:
        model = Election
        fields = [
            'election_id',
            'year',
            'winner',
            'first_runner_up',
            'second_runner_up',
            'presidential_candidates_regional',
            'presidential_candidates_constituency'

        ]


class AllElectionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Election
        fields = [
            'election_id',
            'year',
            'winner',


        ]






class PollingStationVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PollingStation
        fields = [
            'polling_station_id',
            'polling_station_name',
        ]



class ParliamentaryCandidatePollingStationVoteSerializer(serializers.ModelSerializer):
    polling_station = PollingStationVoteSerializer(many=False)
    candidate = ElectionParliamentaryCandidateSerializer(source='parl_candidate')  # Rename prez_candidate to candidate

    class Meta:
        model = ParliamentaryCandidatePollingStationVote
        fields = [
            'election',
            'candidate',
            'polling_station',
            'total_votes',
            'total_votes_percent',
            'created_at',
        ]



class PresidentialCandidatePollingStationVoteSerializer(serializers.ModelSerializer):
    polling_station = PollingStationVoteSerializer(many=False)
    candidate = ElectionPresidentialCandidateSerializer(source='prez_candidate')  # Rename prez_candidate to candidate

    class Meta:
        model = PresidentialCandidatePollingStationVote
        fields = [
            'election',
            'candidate',  # Use the renamed field here
            'polling_station',
            'total_votes',
            'total_votes_percent',
            'created_at',
        ]

class ElectionParliamentaryCandidateSerializer(serializers.ModelSerializer):
    candidate = AllParliamentaryCandidateSerializer(many=False)
    class Meta:
        model = ElectionParliamentaryCandidate
        fields = [
            'election_parl_id',
            'candidate',
            'ballot_number',
            'total_votes',
            'total_votes_percent',
            'created_at',
        ]


class PresidentialBallotEntrySerializer(serializers.Serializer):
    election_prez_id = serializers.CharField()
    votes = serializers.IntegerField(min_value=0)


class ParliamentaryBallotEntrySerializer(serializers.Serializer):
    election_parl_id = serializers.CharField()
    votes = serializers.IntegerField(min_value=0)


class PollingStationResultSubmissionRequestSerializer(serializers.Serializer):
    election_id = serializers.CharField()
    polling_station_id = serializers.CharField()
    presidential_results = PresidentialBallotEntrySerializer(many=True, required=False)
    parliamentary_results = ParliamentaryBallotEntrySerializer(many=True, required=False)
    metadata = serializers.JSONField(required=False)

    def validate(self, attrs):
        errors = {}

        election_id = attrs.get('election_id')
        polling_station_id = attrs.get('polling_station_id')
        presidential_entries = attrs.get('presidential_results') or []
        parliamentary_entries = attrs.get('parliamentary_results') or []

        if not presidential_entries and not parliamentary_entries:
            errors['results'] = ['Provide at least one set of tallies.']

        try:
            election = Election.objects.get(election_id=election_id)
        except Election.DoesNotExist:
            errors['election_id'] = ['Election does not exist.']
            election = None

        try:
            polling_station = PollingStation.objects.get(polling_station_id=polling_station_id)
        except PollingStation.DoesNotExist:
            errors['polling_station_id'] = ['Polling station does not exist.']
            polling_station = None

        if election and polling_station and polling_station.election_year and election.year:
            if polling_station.election_year != election.year:
                errors['polling_station_id'] = [
                    'Polling station is not registered for the provided election year.'
                ]

        normalized_presidential = []
        if election and presidential_entries:
            seen = set()
            for entry in presidential_entries:
                prez_id = entry['election_prez_id']
                if prez_id in seen:
                    errors.setdefault('presidential_results', []).append(
                        f'Duplicate presidential candidate id: {prez_id}'
                    )
                    continue
                seen.add(prez_id)
                try:
                    candidate = ElectionPresidentialCandidate.objects.get(
                        election=election,
                        election_prez_id=prez_id,
                    )
                except ElectionPresidentialCandidate.DoesNotExist:
                    errors.setdefault('presidential_results', []).append(
                        f'Unknown presidential candidate id: {prez_id}'
                    )
                    continue
                normalized_presidential.append({
                    'candidate': candidate,
                    'votes': entry['votes'],
                })

        normalized_parliamentary = []
        if election and parliamentary_entries:
            seen = set()
            for entry in parliamentary_entries:
                parl_id = entry['election_parl_id']
                if parl_id in seen:
                    errors.setdefault('parliamentary_results', []).append(
                        f'Duplicate parliamentary candidate id: {parl_id}'
                    )
                    continue
                seen.add(parl_id)
                try:
                    candidate = ElectionParliamentaryCandidate.objects.get(
                        election=election,
                        election_parl_id=parl_id,
                    )
                except ElectionParliamentaryCandidate.DoesNotExist:
                    errors.setdefault('parliamentary_results', []).append(
                        f'Unknown parliamentary candidate id: {parl_id}'
                    )
                    continue
                normalized_parliamentary.append({
                    'candidate': candidate,
                    'votes': entry['votes'],
                })

        if errors:
            raise serializers.ValidationError(errors)

        attrs['election'] = election
        attrs['polling_station'] = polling_station
        attrs['presidential_results'] = normalized_presidential
        attrs['parliamentary_results'] = normalized_parliamentary
        attrs['metadata'] = attrs.get('metadata') or {}
        return attrs


class PollingStationResultSubmissionSerializer(serializers.ModelSerializer):
    election_year = serializers.CharField(source='election.year', read_only=True)
    polling_station_id = serializers.CharField(source='polling_station.polling_station_id', read_only=True)
    polling_station_name = serializers.CharField(source='polling_station.polling_station_name', read_only=True)
    submitted_by = serializers.SerializerMethodField()
    presidential_results = serializers.SerializerMethodField()
    parliamentary_results = serializers.SerializerMethodField()
    metadata = serializers.SerializerMethodField()

    class Meta:
        model = PollingStationResultSubmission
        fields = [
            'id',
            'status',
            'created_at',
            'processed_at',
            'error_message',
            'election_year',
            'polling_station_id',
            'polling_station_name',
            'submitted_by',
            'presidential_results',
            'parliamentary_results',
            'metadata',
        ]

    def get_submitted_by(self, obj: PollingStationResultSubmission) -> str:
        user = obj.submitted_by
        name_parts = [part for part in [getattr(user, 'first_name', None), getattr(user, 'last_name', None)] if part]
        if name_parts:
            return " ".join(name_parts)
        return getattr(user, 'email', '') or str(user.pk)

    def get_presidential_results(self, obj: PollingStationResultSubmission):
        payload = obj.structured_payload or {}
        return payload.get('presidential_results', [])

    def get_parliamentary_results(self, obj: PollingStationResultSubmission):
        payload = obj.structured_payload or {}
        return payload.get('parliamentary_results', [])

    def get_metadata(self, obj: PollingStationResultSubmission):
        payload = obj.structured_payload or {}
        return payload.get('metadata', {})

