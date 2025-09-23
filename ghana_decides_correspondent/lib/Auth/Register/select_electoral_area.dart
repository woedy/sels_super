import 'dart:io';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Register/select_polling_station.dart';
import 'package:ghd_correspondent/Components/photos/select_photo_options_screen.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl_phone_field/intl_phone_field.dart';

class SelectElectoralAreaReg extends StatefulWidget {
  final data;


  const SelectElectoralAreaReg({super.key,
    required this.data,

  });



  @override
  State<SelectElectoralAreaReg> createState() => _SelectElectoralAreaRegState();
}


class _SelectElectoralAreaRegState extends State<SelectElectoralAreaReg> {
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
                            "Ablekuma Central",
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
                            "Select Electoral Area you’ve been assigned to",
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
                          //hintText: 'Enter Username/Email',

                          hintStyle: TextStyle(
                              color: Colors.black.withOpacity(0.7),
                              fontWeight: FontWeight.normal),
                          labelText: "Search here",

                          labelStyle: TextStyle(fontSize: 13,
                              color: Colors.black.withOpacity(0.5)),
                          enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white)),
                          focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white)),
                          border: InputBorder.none,
                        ),
                        inputFormatters: [
                          LengthLimitingTextInputFormatter(225),
                          PasteTextInputFormatter(),
                        ],

                        textInputAction: TextInputAction.next,
                        autofocus: false,
                        onSaved: (value) {
                          setState(() {
                            //email = value;
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
                    itemCount: constituencyNames.length,
                    itemBuilder: (context, index){
                      final constituencyName = constituencyNames[index];
                      final isSelected = selectedConstituency == constituencyName;

                      return GestureDetector(
                        onTap: () {
                          setState(() {
                            selectedConstituency = constituencyName;
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
                                constituencyName,
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
                  Navigator.push(context, MaterialPageRoute(builder: (context) => SelectPollingStationReg(data: {},)));
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
