import 'dart:convert';

class ResultEntry {
  ResultEntry({
    required this.candidateId,
    required this.votes,
  });

  final String candidateId;
  final int votes;

  Map<String, dynamic> toJson() => {
        'candidate_id': candidateId,
        'votes': votes,
      };

  factory ResultEntry.fromJson(Map<String, dynamic> json) {
    return ResultEntry(
      candidateId: json['candidate_id'] as String,
      votes: json['votes'] as int,
    );
  }
}

class ResultSubmissionPayload {
  ResultSubmissionPayload({
    required this.id,
    required this.electionId,
    required this.pollingStationId,
    required this.presidentialResults,
    required this.parliamentaryResults,
    this.turnout,
    this.notes,
    this.photoPath,
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now().toUtc();

  final String id;
  final String electionId;
  final String pollingStationId;
  final List<ResultEntry> presidentialResults;
  final List<ResultEntry> parliamentaryResults;
  final int? turnout;
  final String? notes;
  final String? photoPath;
  final DateTime createdAt;

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'election_id': electionId,
      'polling_station_id': pollingStationId,
      'presidential_results':
          presidentialResults.map((entry) => entry.toJson()).toList(),
      'parliamentary_results':
          parliamentaryResults.map((entry) => entry.toJson()).toList(),
      'turnout': turnout,
      'notes': notes,
      'photo_path': photoPath,
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory ResultSubmissionPayload.fromJson(Map<String, dynamic> json) {
    return ResultSubmissionPayload(
      id: json['id'] as String,
      electionId: json['election_id'] as String,
      pollingStationId: json['polling_station_id'] as String,
      presidentialResults: (json['presidential_results'] as List<dynamic>)
          .map((e) => ResultEntry.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
      parliamentaryResults: (json['parliamentary_results'] as List<dynamic>)
          .map((e) => ResultEntry.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
      turnout: json['turnout'] as int?,
      notes: json['notes'] as String?,
      photoPath: json['photo_path'] as String?,
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? '')
              ?.toUtc() ??
          DateTime.now().toUtc(),
    );
  }

  Map<String, dynamic> toRequestBody({String? photoBase64, String? photoName}) {
    final metadata = <String, dynamic>{
      'source': 'correspondent_app',
      'submitted_at': createdAt.toIso8601String(),
    };

    if (turnout != null) {
      metadata['turnout_total'] = turnout;
    }
    if (notes != null && notes!.isNotEmpty) {
      metadata['notes'] = notes;
    }
    if (photoBase64 != null && photoBase64.isNotEmpty) {
      metadata['attachments'] = [
        {
          'type': 'photo',
          'filename': photoName ?? 'result.jpg',
          'content_type': 'image/jpeg',
          'content': photoBase64,
        }
      ];
    }

    return {
      'election_id': electionId,
      'polling_station_id': pollingStationId,
      'presidential_results': presidentialResults
          .map((entry) => {
                'election_prez_id': entry.candidateId,
                'votes': entry.votes,
              })
          .toList(),
      'parliamentary_results': parliamentaryResults
          .map((entry) => {
                'election_parl_id': entry.candidateId,
                'votes': entry.votes,
              })
          .toList(),
      'metadata': metadata,
    };
  }

  String encode() => jsonEncode(toJson());

  factory ResultSubmissionPayload.decode(String source) {
    final decoded = jsonDecode(source) as Map<String, dynamic>;
    return ResultSubmissionPayload.fromJson(decoded);
  }
}
