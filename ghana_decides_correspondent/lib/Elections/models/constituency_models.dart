class AllConstituencyModel {
  String? message;
  List<Data>? data;

  AllConstituencyModel({this.message, this.data});

  AllConstituencyModel.fromJson(Map<String, dynamic> json) {
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
  String? constituencyId;
  String? constituencyName;

  Data({this.constituencyId, this.constituencyName});

  Data.fromJson(Map<String, dynamic> json) {
    constituencyId = json['constituency_id'];
    constituencyName = json['constituency_name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['constituency_id'] = this.constituencyId;
    data['constituency_name'] = this.constituencyName;
    return data;
  }
}
