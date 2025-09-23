import 'dart:convert';
import 'dart:io';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Register/select_constituency.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/photos/select_photo_options_screen.dart';
import 'package:ghd_correspondent/Elections/Selects/election_select_constituency.dart';
import 'package:ghd_correspondent/Elections/SelectsParl/parl_election_select_constituency.dart';
import 'package:ghd_correspondent/Elections/models/region_models.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;


Future<AllRegionsModel> get_all_regions() async {

  var token = await getApiPref();

  final response = await http.get(
    Uri.parse(hostName + "regions/get-all-regions/"),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
      'Authorization': 'Token '  + "4487f5a04fbcbbc32a1bc71788a2142aff324a24"
    },
  );


  if (response.statusCode == 200) {
    print(jsonDecode(response.body));
    final result = json.decode(response.body);
    if (result != null) {


    }
    return AllRegionsModel.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 422) {
    print(jsonDecode(response.body));
    return AllRegionsModel.fromJson(jsonDecode(response.body));
  }  else if (response.statusCode == 403) {
    print(jsonDecode(response.body));
    return AllRegionsModel.fromJson(jsonDecode(response.body));
  }   else if (response.statusCode == 400) {
    print(jsonDecode(response.body));
    return AllRegionsModel.fromJson(jsonDecode(response.body));
  }  else {

    throw Exception('Failed to load data');
  }
}


class ParlElectionSelectRegion extends StatefulWidget {


  const ParlElectionSelectRegion({super.key,});



  @override
  State<ParlElectionSelectRegion> createState() => _ParlElectionSelectRegionState();
}


class _ParlElectionSelectRegionState extends State<ParlElectionSelectRegion> {
  FocusNode focusNode = FocusNode();
  String? selectedRegion;
  String? selectedRegionName;

  Future<AllRegionsModel>? _futureAllRegions;

  @override
  void initState() {
    _futureAllRegions = get_all_regions();
    super.initState();
  }



  @override
  Widget build(BuildContext context) {
    return (_futureAllRegions == null) ? buildColumn() : buildFutureBuilder();
  }

  buildColumn(){
    return Scaffold(
      body: Container(),
    );
  }



  FutureBuilder<AllRegionsModel> buildFutureBuilder() {
    return FutureBuilder<AllRegionsModel>(
        future: _futureAllRegions,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingDialogBox(text: 'Please Wait..',);
          }
          else if(snapshot.hasData) {

            var data = snapshot.data!;
            var _regions = data.data;

            if(data.message == "Successful") {

              return Scaffold(
                body: Container(
                  height: MediaQuery.of(context).size.height,
                  width: MediaQuery.of(context).size.width,
                  decoration: BoxDecoration(
                    image: DecorationImage(
                      image: AssetImage("assets/images/ghana_back.png"),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: SafeArea(
                    child: Column(
                      children: [
                        Container(
                          padding: EdgeInsets.all(15),
                          child: Row(
                            children: [
                              InkWell(
                                onTap: () {
                                  Navigator.of(context).pop();
                                },
                                child: Icon(Icons.arrow_back, size: 35),
                              ),
                            ],
                          ),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Container(
                          child: Column(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 15),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "Select Region",
                                      style: TextStyle(
                                        fontSize: 48,
                                        fontFamily: "Fontspring",
                                        height: 1,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),

                                  ],
                                ),
                              ),

                            ],
                          ),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Expanded(
                          child: GridView.builder(
                            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                            ),
                            itemCount: _regions!.length,
                            itemBuilder: (context, index) {
                              final isSelected = selectedRegion ==  _regions[index].regionId;
                              return GestureDetector(
                                onTap: () {
                                  setState(() {
                                    selectedRegion = _regions[index].regionId;
                                    selectedRegionName = _regions[index].regionName;
                                  });
                                },
                                child: Container(
                                  padding: EdgeInsets.all(5),
                                  margin: EdgeInsets.all(2),
                                  height: 10,
                                  decoration: BoxDecoration(
                                    color: isSelected ? Colors.blue.withOpacity(0.5) : Colors.black.withOpacity(0.2),
                                    borderRadius: BorderRadius.circular(10),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.1),
                                        spreadRadius: 1,
                                        blurRadius: 2,
                                        offset: Offset(0, 2),
                                      ),
                                    ],
                                  ),
                                  child: Center(
                                    child: Text(
                                      _regions[index].regionName!.toString(),
                                      textAlign: TextAlign.center,
                                      style: TextStyle(
                                        fontSize: 20,
                                        fontWeight: FontWeight.w600,
                                        color: isSelected ? Colors.white : Colors.white,

                                      ),
                                    ),
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                        InkWell(
                          onTap: () {

                            var _data = {
                              "region_name": selectedRegionName,
                              "region_id": selectedRegion,
                            };

                            Navigator.push(context, MaterialPageRoute(builder: (context) => ParlElectionSelectConstituency(data: _data,)));
                          },
                          child: Container(
                            padding: EdgeInsets.all(20),
                            margin: EdgeInsets.all(15),
                            height: 59,
                            width: MediaQuery.of(context).size.width,
                            decoration: BoxDecoration(
                              color: Colors.black,
                              borderRadius: BorderRadius.circular(7),
                            ),
                            child: Center(
                              child: Text(
                                "Next",
                                style: TextStyle(color: Colors.white),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }

          }

          return LoadingDialogBox(text: 'Please Wait..',);


        }
    );
  }


  void dispose() {
    super.dispose();
  }



}
