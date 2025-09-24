import 'dart:convert';

import 'api_client.dart';

class CandidateOption {
  CandidateOption({
    required this.id,
    required this.displayName,
    this.partyName,
    this.partyLogo,
  });

  final String id;
  final String displayName;
  final String? partyName;
  final String? partyLogo;
}

class ElectionDataService {
  ElectionDataService(this._apiClient);

  final ApiClient _apiClient;

  Future<List<CandidateOption>> fetchPresidentialCandidates(String electionId) async {
    final response = await _apiClient.get(
      'elections/get-all-election-presidential-candidates/?election_id=$electionId',
    );

    if (response.statusCode != 200) {
      throw Exception('Unable to load presidential candidates');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final items = decoded['data'] as List<dynamic>? ?? [];

    return items.map((item) {
      final data = Map<String, dynamic>.from(item as Map);
      final candidate = Map<String, dynamic>.from(data['candidate'] as Map);
      final party = candidate['party'] != null
          ? Map<String, dynamic>.from(candidate['party'] as Map)
          : null;
      final firstName = candidate['first_name'] as String? ?? '';
      final lastName = candidate['last_name'] as String? ?? '';
      final middleName = candidate['middle_name'] as String? ?? '';
      final parts = [firstName, middleName, lastName].where((value) => value.trim().isNotEmpty).toList();
      final displayName = parts.join(' ');
      return CandidateOption(
        id: data['election_prez_id'] as String,
        displayName: displayName,
        partyName: party?['party_full_name'] as String?,
        partyLogo: party?['party_logo'] as String?,
      );
    }).toList();
  }

  Future<List<CandidateOption>> fetchParliamentaryCandidates(
    String electionId,
    String constituencyId,
  ) async {
    final response = await _apiClient.get(
      'elections/get-all-election-parliamentary-candidates/?election_id=$electionId&constituency_id=$constituencyId',
    );

    if (response.statusCode != 200) {
      throw Exception('Unable to load parliamentary candidates');
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final items = decoded['data'] as List<dynamic>? ?? [];

    return items.map((item) {
      final data = Map<String, dynamic>.from(item as Map);
      final candidate = Map<String, dynamic>.from(data['candidate'] as Map);
      final party = candidate['party'] != null
          ? Map<String, dynamic>.from(candidate['party'] as Map)
          : null;
      final firstName = candidate['first_name'] as String? ?? '';
      final lastName = candidate['last_name'] as String? ?? '';
      final middleName = candidate['other_name'] as String? ?? '';
      final parts = [firstName, middleName, lastName].where((value) => value.trim().isNotEmpty).toList();
      final displayName = parts.join(' ');
      return CandidateOption(
        id: data['election_parl_id'] as String,
        displayName: displayName,
        partyName: party?['party_full_name'] as String?,
        partyLogo: party?['party_logo'] as String?,
      );
    }).toList();
  }
}
