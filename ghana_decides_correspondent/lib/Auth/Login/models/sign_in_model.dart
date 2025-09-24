class SignInModel {
  SignInModel({this.data, this.errors, this.detail});

  final SignInData? data;
  final Map<String, List<String>>? errors;
  final String? detail;

  bool get hasErrors => (errors != null && errors!.isNotEmpty) || detail != null;

  factory SignInModel.fromJson(Map<String, dynamic> json) {
    return SignInModel(
      data: SignInData.maybeFromJson(json),
      errors: json['errors'] != null
          ? _parseErrors(Map<String, dynamic>.from(json['errors']))
          : null,
      detail: json['detail'] as String?,
    );
  }

  static Map<String, List<String>> _parseErrors(Map<String, dynamic> errorData) {
    final errors = <String, List<String>>{};
    errorData.forEach((key, value) {
      if (value is List) {
        errors[key] = List<String>.from(value);
      } else if (value is String) {
        errors[key] = [value];
      }
    });
    return errors;
  }
}

class SignInData {
  SignInData({
    this.accessToken,
    this.refreshToken,
    this.userId,
    this.email,
    this.firstName,
    this.lastName,
    this.userType,
    this.photo,
    this.assignments = const [],
    this.defaultElection,
  });

  final String? accessToken;
  final String? refreshToken;
  final String? userId;
  final String? email;
  final String? firstName;
  final String? lastName;
  final String? userType;
  final String? photo;
  final List<UserAssignment> assignments;
  final ElectionSummary? defaultElection;

  Map<String, dynamic> toJson() {
    return {
      'access': accessToken,
      'refresh': refreshToken,
      'user_id': userId,
      'email': email,
      'first_name': firstName,
      'last_name': lastName,
      'user_type': userType,
      'photo': photo,
      'assignments': assignments.map((a) => a.toJson()).toList(),
      'default_election': defaultElection?.toJson(),
    };
  }

  static SignInData? maybeFromJson(Map<String, dynamic> json) {
    if (!json.containsKey('access')) {
      return null;
    }
    final user = json['user'] as Map<String, dynamic>?;
    return SignInData(
      accessToken: json['access'] as String?,
      refreshToken: json['refresh'] as String?,
      userId: user?['user_id'] as String?,
      email: user?['email'] as String?,
      firstName: user?['first_name'] as String?,
      lastName: user?['last_name'] as String?,
      userType: user?['user_type'] as String?,
      photo: user?['photo'] as String?,
      assignments: (json['assignments'] as List<dynamic>? ?? [])
          .map((entry) => UserAssignment.fromJson(
                Map<String, dynamic>.from(entry as Map),
              ))
          .toList(),
      defaultElection: json['default_election'] != null
          ? ElectionSummary.fromJson(
              Map<String, dynamic>.from(json['default_election'] as Map),
            )
          : null,
    );
  }
}

class UserAssignment {
  UserAssignment({
    required this.pollingStationId,
    required this.pollingStationName,
    required this.electoralAreaId,
    required this.electoralAreaName,
    required this.constituencyId,
    required this.constituencyName,
    required this.regionId,
    required this.regionName,
    required this.role,
  });

  final String pollingStationId;
  final String pollingStationName;
  final String electoralAreaId;
  final String electoralAreaName;
  final String constituencyId;
  final String constituencyName;
  final String regionId;
  final String regionName;
  final String role;

  factory UserAssignment.fromJson(Map<String, dynamic> json) {
    return UserAssignment(
      pollingStationId: json['polling_station_id'] as String,
      pollingStationName: json['polling_station_name'] as String,
      electoralAreaId: json['electoral_area_id'] as String,
      electoralAreaName: json['electoral_area_name'] as String,
      constituencyId: json['constituency_id'] as String,
      constituencyName: json['constituency_name'] as String,
      regionId: json['region_id'] as String,
      regionName: json['region_name'] as String,
      role: json['role'] as String? ?? 'Correspondent',
    );
  }

  Map<String, dynamic> toJson() => {
        'polling_station_id': pollingStationId,
        'polling_station_name': pollingStationName,
        'electoral_area_id': electoralAreaId,
        'electoral_area_name': electoralAreaName,
        'constituency_id': constituencyId,
        'constituency_name': constituencyName,
        'region_id': regionId,
        'region_name': regionName,
        'role': role,
      };
}

class ElectionSummary {
  ElectionSummary({required this.electionId, required this.year});

  final String electionId;
  final String year;

  factory ElectionSummary.fromJson(Map<String, dynamic> json) {
    return ElectionSummary(
      electionId: json['election_id'] as String,
      year: json['year'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
        'election_id': electionId,
        'year': year,
      };
}