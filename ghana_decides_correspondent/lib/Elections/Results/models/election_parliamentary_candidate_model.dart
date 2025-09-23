class ElectionParliamentaryCandidatesModel {
  String? message;
  List<Data>? data;

  ElectionParliamentaryCandidatesModel({this.message, this.data});

  ElectionParliamentaryCandidatesModel.fromJson(Map<String, dynamic> json) {
    message = json['message'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? electionParlId;
  Candidate? candidate;
  int? totalVotes;
  String? totalVotesPercent;
  String? createdAt;

  Data(
      {this.electionParlId,
        this.candidate,
        this.totalVotes,
        this.totalVotesPercent,
        this.createdAt});

  Data.fromJson(Map<String, dynamic> json) {
    electionParlId = json['election_parl_id'];
    candidate = json['candidate'] != null
        ? new Candidate.fromJson(json['candidate'])
        : null;
    totalVotes = json['total_votes'];
    totalVotesPercent = json['total_votes_percent'];
    createdAt = json['created_at'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['election_parl_id'] = this.electionParlId;
    if (this.candidate != null) {
      data['candidate'] = this.candidate!.toJson();
    }
    data['total_votes'] = this.totalVotes;
    data['total_votes_percent'] = this.totalVotesPercent;
    data['created_at'] = this.createdAt;
    return data;
  }
}

class Candidate {
  String? parlCanId;
  String? firstName;
  String? lastName;
  String? middleName;
  String? photo;
  Party? party;

  Candidate(
      {this.parlCanId,
        this.firstName,
        this.lastName,
        this.middleName,
        this.photo,
        this.party});

  Candidate.fromJson(Map<String, dynamic> json) {
    parlCanId = json['parl_can_id'];
    firstName = json['first_name'];
    lastName = json['last_name'];
    middleName = json['middle_name'];
    photo = json['photo'];
    party = json['party'] != null ? new Party.fromJson(json['party']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['parl_can_id'] = this.parlCanId;
    data['first_name'] = this.firstName;
    data['last_name'] = this.lastName;
    data['middle_name'] = this.middleName;
    data['photo'] = this.photo;
    if (this.party != null) {
      data['party'] = this.party!.toJson();
    }
    return data;
  }
}

class Party {
  String? partyId;
  String? partyFullName;
  String? partyInitial;
  String? partyLogo;

  Party({this.partyId, this.partyFullName, this.partyInitial, this.partyLogo});

  Party.fromJson(Map<String, dynamic> json) {
    partyId = json['party_id'];
    partyFullName = json['party_full_name'];
    partyInitial = json['party_initial'];
    partyLogo = json['party_logo'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['party_id'] = this.partyId;
    data['party_full_name'] = this.partyFullName;
    data['party_initial'] = this.partyInitial;
    data['party_logo'] = this.partyLogo;
    return data;
  }
}
