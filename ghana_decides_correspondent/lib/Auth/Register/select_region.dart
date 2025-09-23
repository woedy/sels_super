import 'dart:io';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Register/select_constituency.dart';
import 'package:ghd_correspondent/Components/photos/select_photo_options_screen.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl_phone_field/intl_phone_field.dart';

class SelectRegionReg extends StatefulWidget {
  final data;


  const SelectRegionReg({super.key,
    required this.data,

  });



  @override
  State<SelectRegionReg> createState() => _SelectRegionRegState();
}


class _SelectRegionRegState extends State<SelectRegionReg> {
  FocusNode focusNode = FocusNode();
  String? selectedRegion;

  final List<String> regionNames = [
    'Ahafo',
    'Ashanti',
    'Bono East',
    'Brong Ahafo',
    'Central',
    'Eastern',
    'Greater Accra',
    'Northern',
    'North East',
    'Oti',
    'Savannah',
    'Upper East',
    'Upper West',
    'Volta',
    'Western',
    'Western North',
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
                            "Hello Sandra",
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
                            "Select Region you’ve been assigned to",
                            style: TextStyle(fontSize: 25),
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
                  itemCount: regionNames.length,
                  itemBuilder: (context, index) {
                    final regionName = regionNames[index];
                    final isSelected = selectedRegion == regionName;
                    return GestureDetector(
                      onTap: () {
                        setState(() {
                          selectedRegion = regionName;
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
                            regionName,
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
                  Navigator.push(context, MaterialPageRoute(builder: (context) => SelectConstituencyReg(data: {},)));
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
