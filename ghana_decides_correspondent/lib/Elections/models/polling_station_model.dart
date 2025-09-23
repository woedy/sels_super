class AllPollingStationModel {
  String? message;
  List<Data>? data;

  AllPollingStationModel({this.message, this.data});

  AllPollingStationModel.fromJson(Map<String, dynamic> json) {
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
  String? pollingStationId;
  String? pollingStationName;

  Data({this.pollingStationId, this.pollingStationName});

  Data.fromJson(Map<String, dynamic> json) {
    pollingStationId = json['polling_station_id'];
    pollingStationName = json['polling_station_name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['polling_station_id'] = this.pollingStationId;
    data['polling_station_name'] = this.pollingStationName;
    return data;
  }
}
