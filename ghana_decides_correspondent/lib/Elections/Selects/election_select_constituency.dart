import 'dart:convert';
import 'dart:io';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Register/select_electoral_area.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/photos/select_photo_options_screen.dart';
import 'package:ghd_correspondent/Elections/Selects/election_select_electoral_area.dart';
import 'package:ghd_correspondent/Elections/models/constituency_models.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;


Future<AllConstituencyModel> get_all_constituency(region_id) async {

  var token = await getApiPref();

  final response = await http.get(
    Uri.parse(hostName + "regions/get-regional-constituencies/?region_id=${region_id}"),
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
    return AllConstituencyModel.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 422) {
    print(jsonDecode(response.body));
    return AllConstituencyModel.fromJson(jsonDecode(response.body));
  }  else if (response.statusCode == 403) {
    print(jsonDecode(response.body));
    return AllConstituencyModel.fromJson(jsonDecode(response.body));
  }   else if (response.statusCode == 400) {
    print(jsonDecode(response.body));
    return AllConstituencyModel.fromJson(jsonDecode(response.body));
  }  else {

    throw Exception('Failed to load data');
  }
}



class ElectionSelectConstituency extends StatefulWidget {
  final data;


  const ElectionSelectConstituency({super.key,
    required this.data,

  });



  @override
  State<ElectionSelectConstituency> createState() => _ElectionSelectConstituencyState();
}


class _ElectionSelectConstituencyState extends State<ElectionSelectConstituency> {
  FocusNode focusNode = FocusNode();
  String? selectedConstituency;
  String? selectedConstituencyName;

  String? searchText;


  Future<AllConstituencyModel>? _futureAllConstituency;

  @override
  void initState() {
    _futureAllConstituency = get_all_constituency(widget.data["region_id"]);
    super.initState();
  }



  @override
  Widget build(BuildContext context) {
    return (_futureAllConstituency == null) ? buildColumn() : buildFutureBuilder();
  }

  buildColumn(){
    return Scaffold(
      body: Container(),
    );
  }





  FutureBuilder<AllConstituencyModel> buildFutureBuilder() {
    return FutureBuilder<AllConstituencyModel>(
        future: _futureAllConstituency,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingDialogBox(text: 'Please Wait..',);
          }
          else if(snapshot.hasData) {

            var data = snapshot.data!;
            var _constituencies = data.data;

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
                                      widget.data["region_name"],
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
                                      "Select Constituency",
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
                              itemCount: _constituencies!.length,
                              itemBuilder: (context, index){
                                final constituency = _constituencies[index];
                                final isSelected = selectedConstituency == constituency.constituencyId;

                                // Check if the constituency name contains the search text
                                if (searchText != null &&
                                    searchText!.isNotEmpty &&
                                    !constituency.constituencyName!
                                        .toLowerCase()
                                        .contains(searchText!.toLowerCase())) {
                                  return SizedBox(); // Return an empty SizedBox to hide the item
                                }

                                return GestureDetector(
                                  onTap: () {
                                    setState(() {
                                      selectedConstituency = constituency.constituencyId;
                                      selectedConstituencyName = constituency.constituencyName;
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
                                          constituency.constituencyName!.toString(),
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
                            var _data = {
                              "constituency_id" : selectedConstituency,
                              "constituency_name" : selectedConstituencyName,
                            };
                            Navigator.push(context, MaterialPageRoute(builder: (context) => ElectionSelectElectoralArea(data: _data)));
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
