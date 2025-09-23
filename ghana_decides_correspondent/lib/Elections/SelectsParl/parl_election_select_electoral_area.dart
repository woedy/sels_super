import 'dart:convert';
import 'dart:io';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Register/select_electoral_area.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Elections/Selects/election_select_polling_station.dart';
import 'package:ghd_correspondent/Elections/SelectsParl/parl_election_select_polling_station.dart';
import 'package:ghd_correspondent/Elections/models/electoral_area_model.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;


Future<AllElectoralAreaModel> get_all_electoral_area(constituency_id) async {

  var token = await getApiPref();

  final response = await http.get(
    Uri.parse(hostName + "regions/get-constituency-electoral-areas/?constituency_id=${constituency_id}"),
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
    return AllElectoralAreaModel.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 422) {
    print(jsonDecode(response.body));
    return AllElectoralAreaModel.fromJson(jsonDecode(response.body));
  }  else if (response.statusCode == 403) {
    print(jsonDecode(response.body));
    return AllElectoralAreaModel.fromJson(jsonDecode(response.body));
  }   else if (response.statusCode == 400) {
    print(jsonDecode(response.body));
    return AllElectoralAreaModel.fromJson(jsonDecode(response.body));
  }  else {

    throw Exception('Failed to load data');
  }
}



class ParlElectionSelectElectoralArea extends StatefulWidget {
  final data;


  const ParlElectionSelectElectoralArea({super.key,
    required this.data,

  });



  @override
  State<ParlElectionSelectElectoralArea> createState() => _ParlElectionSelectElectoralAreaState();
}


class _ParlElectionSelectElectoralAreaState extends State<ParlElectionSelectElectoralArea> {
  FocusNode focusNode = FocusNode();
  String? selectedElectoralArea;
  String? selectedElectoralAreaName;

  String? searchText;


  Future<AllElectoralAreaModel>? _futureAllElectoralArea;

  @override
  void initState() {
    _futureAllElectoralArea = get_all_electoral_area(widget.data["constituency_id"]);
    super.initState();
  }



  @override
  Widget build(BuildContext context) {
    return (_futureAllElectoralArea == null) ? buildColumn() : buildFutureBuilder();
  }

  buildColumn(){
    return Scaffold(
      body: Container(),
    );
  }





  FutureBuilder<AllElectoralAreaModel> buildFutureBuilder() {
    return FutureBuilder<AllElectoralAreaModel>(
        future: _futureAllElectoralArea,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingDialogBox(text: 'Please Wait..',);
          }
          else if(snapshot.hasData) {

            var data = snapshot.data!;
            var _electoral_areas = data.data;

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
                                      widget.data["constituency_name"],
                                      style: TextStyle(
                                        fontSize: 48,
                                        fontFamily: "Fontspring",
                                        height: 1,
                                        fontWeight: FontWeight.w700,
                                      ),
                                    ),
                                    SizedBox(
                                      height: 15,
                                    ),
                                    Text(
                                      "Select Electorial Area",
                                      style: TextStyle(fontSize: 25),
                                    ),
                                  ],
                                ),
                              ),
                              SizedBox(
                                height: 20,
                              ),


                            ],
                          ),
                        ),
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 10),
                          margin: EdgeInsets.symmetric(horizontal: 10),
                          decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.5),
                              borderRadius: BorderRadius.circular(10),
                              border:
                              Border.all(color: Colors.black.withOpacity(0.1))),
                          child: Row(
                            children: [
                              Expanded(
                                child: TextFormField(
                                  style: TextStyle(color: Colors.black),
                                  decoration: InputDecoration(
                                    hintStyle: TextStyle(
                                      color: Colors.black.withOpacity(0.7),
                                      fontWeight: FontWeight.normal,
                                    ),
                                    labelText: "Search here",
                                    labelStyle: TextStyle(
                                      fontSize: 13,
                                      color: Colors.black.withOpacity(0.5),
                                    ),
                                    enabledBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(color: Colors.white),
                                    ),
                                    focusedBorder: UnderlineInputBorder(
                                      borderSide: BorderSide(color: Colors.white),
                                    ),
                                    border: InputBorder.none,
                                  ),
                                  inputFormatters: [
                                    LengthLimitingTextInputFormatter(225),
                                    PasteTextInputFormatter(),
                                  ],
                                  textInputAction: TextInputAction.next,
                                  autofocus: false,
                                  onChanged: (value) {
                                    setState(() {
                                      searchText = value;
                                    });
                                  },
                                ),
                              ),
                              Row(
                                children: [

                                  Icon(Icons.search),

                                ],
                              )
                            ],
                          ),
                        ),
                        SizedBox(
                          height: 20,
                        ),
                        Expanded(
                          child: ListView.builder(
                              itemCount: _electoral_areas!.length,
                              itemBuilder: (context, index){
                                final electoral_area = _electoral_areas[index];
                                final isSelected = selectedElectoralArea == electoral_area.electoralAreaId;

                                // Check if the constituency name contains the search text
                                if (searchText != null &&
                                    searchText!.isNotEmpty &&
                                    !electoral_area.electoralAreaName!
                                        .toLowerCase()
                                        .contains(searchText!.toLowerCase())) {
                                  return SizedBox(); // Return an empty SizedBox to hide the item
                                }

                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      selectedElectoralArea = electoral_area.electoralAreaId;
                                      selectedElectoralAreaName = electoral_area.electoralAreaName;
                                    });
                                  },
                                  child: Container(
                                    padding: EdgeInsets.all(15),
                                    margin: EdgeInsets.all(5),
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
                                    child: Row(
                                      children: [
                                        Text(
                                          electoral_area.electoralAreaName!.toString(),
                                          style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.w600,
                                            color: isSelected ? Colors.white : Colors.white,
                                          ),
                                        )
                                      ],
                                    ),
                                  ),
                                );
                              }),
                        ),

                        InkWell(
                          onTap: () {

                            var constituency_id = widget.data['constituency_id'].toString();

                            var _data = {
                              "constituency_id": constituency_id,
                              "electoral_area_id": selectedElectoralArea,
                              "electoral_area_name": selectedElectoralAreaName
                            };


                            Navigator.push(context, MaterialPageRoute(builder: (context) => ParlElectionSelectPollingStation(data: _data,)));
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
