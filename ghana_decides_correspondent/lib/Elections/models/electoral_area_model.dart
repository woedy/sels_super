class AllElectoralAreaModel {
  String? message;
  List<Data>? data;

  AllElectoralAreaModel({this.message, this.data});

  AllElectoralAreaModel.fromJson(Map<String, dynamic> json) {
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
  String? electoralAreaId;
  String? electoralAreaName;

  Data({this.electoralAreaId, this.electoralAreaName});

  Data.fromJson(Map<String, dynamic> json) {
    electoralAreaId = json['electoral_area_id'];
    electoralAreaName = json['electoral_area_name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['electoral_area_id'] = this.electoralAreaId;
    data['electoral_area_name'] = this.electoralAreaName;
    return data;
  }
}
