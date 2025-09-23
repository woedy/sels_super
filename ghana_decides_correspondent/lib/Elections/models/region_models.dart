class AllRegionsModel {
  String? message;
  List<Data>? data;

  AllRegionsModel({this.message, this.data});

  AllRegionsModel.fromJson(Map<String, dynamic> json) {
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
  String? regionId;
  String? regionName;

  Data({this.regionId, this.regionName});

  Data.fromJson(Map<String, dynamic> json) {
    regionId = json['region_id'];
    regionName = json['region_name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['region_id'] = this.regionId;
    data['region_name'] = this.regionName;
    return data;
  }
}
