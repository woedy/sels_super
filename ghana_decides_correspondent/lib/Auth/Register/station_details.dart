import 'dart:io';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Register/select_electoral_area.dart';
import 'package:ghd_correspondent/Components/photos/select_photo_options_screen.dart';
import 'package:ghd_correspondent/Homepage/homepage_screen.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl_phone_field/intl_phone_field.dart';

class SelectStationDetailsReg extends StatefulWidget {
  final data;


  const SelectStationDetailsReg({super.key,
    required this.data,

  });



  @override
  State<SelectStationDetailsReg> createState() => _SelectStationDetailsRegState();
}


class _SelectStationDetailsRegState extends State<SelectStationDetailsReg> {
  FocusNode focusNode = FocusNode();
  File? _image;
  String? selectedConstituency;

  final List<String> constituencyNames = [
    'Abetifi',
    'Abirem',
    'Ablekuma Central',
    'Ablekuma North',
    'Abetifi',
    'Abirem',
    'Ablekuma Central',
    'Ablekuma North',

  ];

  @override
  Widget build(BuildContext context) {
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
            crossAxisAlignment: CrossAxisAlignment.start,
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
                            "Your selected station details",
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


                        ],
                      ),
                    ),
                    SizedBox(
                      height: 20,
                    ),


                  ],
                ),
              ),

              Expanded(
                child:  Container(
                  width: MediaQuery.of(context).size.width,
                  padding: EdgeInsets.all(15),
                  margin: EdgeInsets.all(15),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.1),
                        spreadRadius: 1,
                        blurRadius: 2,
                        offset: Offset(0,
                            2), // changes position of shadow
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Region",
                            style: TextStyle(
                              fontSize: 25,
                              fontFamily: "Fontspring",
                              height: 1,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(
                            height: 15,
                          ),
                          Text(
                            "Greater Accra",
                            style: TextStyle(fontSize: 25),
                          ),
                        ],
                      ),
                      SizedBox(
                        height: 30,
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Constituency",
                            style: TextStyle(
                              fontSize: 25,
                              fontFamily: "Fontspring",
                              height: 1,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(
                            height: 15,
                          ),
                          Text(
                            "Ablekuma North",
                            style: TextStyle(fontSize: 25),
                          ),
                        ],
                      ),

                      SizedBox(
                        height: 30,
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Electoral Area",
                            style: TextStyle(
                              fontSize: 25,
                              fontFamily: "Fontspring",
                              height: 1,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(
                            height: 15,
                          ),
                          Text(
                            "E.P Basic Zone A",
                            style: TextStyle(fontSize: 25),
                          ),
                        ],
                      ),

                      SizedBox(
                        height: 30,
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            "Polling Station",
                            style: TextStyle(
                              fontSize: 25,
                              fontFamily: "Fontspring",
                              height: 1,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          SizedBox(
                            height: 15,
                          ),
                          Text(
                            "E.P Basics",
                            style: TextStyle(fontSize: 25),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),

              InkWell(
                onTap: () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => HomeScreen()));
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
