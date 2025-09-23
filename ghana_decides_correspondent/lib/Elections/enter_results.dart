

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Elections/Selects/elcetion_select_region.dart';
import 'package:ghd_correspondent/Elections/SelectsParl/parl_elcetion_select_region.dart';



class EnterResultScreen extends StatefulWidget {
  const EnterResultScreen({super.key});

  @override
  State<EnterResultScreen> createState() => _EnterResultScreenState();
}

class _EnterResultScreenState extends State<EnterResultScreen> {

  @override
  Widget build(BuildContext context) {
    return  buildColumn();
  }




  buildColumn(){
    return Scaffold(
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
            image: DecorationImage(
                image: AssetImage("assets/images/ghana_back.png"),
                fit: BoxFit.cover)),
        child: SafeArea(
          child: Stack(
            children: [

              Column(
                children: [
                  Container(
                    padding: EdgeInsets.all(15),
                    child: Row(
                      children: [
                        InkWell(
                            onTap: (){
                              Navigator.of(context).pop();
                            },
                            child: Icon(Icons.arrow_back, size: 35,)),
                      ],
                    ),
                  ),
                  SizedBox(
                    height: 20,
                  ),


                  Expanded(
                      child:         Container(
                        padding: EdgeInsets.all(10),

                        child: Column(
                          children: [
                            Expanded(
                              child: InkWell(
                                onTap: (){
                                  //Navigator.push(context, MaterialPageRoute(builder: (context) => EnterPresidentialResultScreen()));
                                  Navigator.push(context, MaterialPageRoute(builder: (context) => ElectionSelectRegion()));




                                },
                                child: Container(
                                  padding: EdgeInsets.all(15),
                                  margin: EdgeInsets.all(5),
                                  width: MediaQuery.of(context).size.width,
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
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [

                                      Text(
                                        "Enter\nPresidential Results",
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.w600),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            Expanded(
                              child: InkWell(
                                onTap: (){
                                  Navigator.push(context, MaterialPageRoute(builder: (context) => ParlElectionSelectRegion()));




                                },
                                child: Container(
                                  padding: EdgeInsets.all(15),
                                  margin: EdgeInsets.all(5),
                                  width: MediaQuery.of(context).size.width,
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
                                    crossAxisAlignment: CrossAxisAlignment.center,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [

                                      Text(
                                        "Enter\nParliamentary Results",
                                        textAlign: TextAlign.center,
                                        style: TextStyle(
                                            fontSize: 20,
                                            fontWeight: FontWeight.w600),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),

                          ],
                        ),
                      ),

                  ),
                  Expanded(child: Container())


                ],
              ),
            ],
          ),
        ),
      ),
    );
  }




}
