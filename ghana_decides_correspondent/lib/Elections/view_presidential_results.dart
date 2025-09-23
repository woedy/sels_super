import 'dart:convert';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Login/models/sign_in_model.dart';
import 'package:ghd_correspondent/Auth/Register/register_screen.dart';
import 'package:ghd_correspondent/Components/generic_error_dialog_box.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/generic_success_dialog_box.dart';
import 'package:ghd_correspondent/Components/keyboard_utils.dart';
import 'package:ghd_correspondent/Elections/view_presidential_results_image.dart';
import 'package:ghd_correspondent/Homepage/homepage_screen.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';



class ViewPresidentialResultScreen extends StatefulWidget {
  const ViewPresidentialResultScreen({super.key});

  @override
  State<ViewPresidentialResultScreen> createState() => _ViewPresidentialResultScreenState();
}

class _ViewPresidentialResultScreenState extends State<ViewPresidentialResultScreen> {
  final _formKey = GlobalKey<FormState>();

  var show_password = false;

  Future<SignInModel>? _futureSignIn;

  String? email;
  String? password;


  @override
  Widget build(BuildContext context) {
    return (_futureSignIn == null) ? buildColumn() : buildFutureBuilder();
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
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        InkWell(
                            onTap: (){
                              Navigator.of(context).pop();
                            },
                            child: Icon(Icons.arrow_back, size: 35,)),

                        InkWell(
                            onTap: (){
                              Navigator.push(context, MaterialPageRoute(builder: (context) => ViewPresidentialResultImageScreen()));

                            },
                            child: Icon(Icons.photo_camera_back_sharp, size: 35, color: Colors.white,)),
                      ],
                    ),
                  ),

                  Text(
                    "View Presidential Results",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        fontSize: 25,
                        fontWeight: FontWeight.w600),
                  ),

                  SizedBox(
                    height: 5,
                  ),
                  Text(
                    "E.P Basic School",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 23,),
                  ),

                  SizedBox(
                    height: 15,
                  ),



                  Expanded(
                      child: ListView(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  height: 120,
                                  width: 120,
                                  decoration: BoxDecoration(
                                    color: Colors.transparent,
                                    borderRadius: BorderRadius.circular(15),
                                    image: DecorationImage(
                                      image: AssetImage("assets/images/nana.png"),
                                      fit: BoxFit.contain
                                    )
                                  ),
                                ),
                                Container(
                                  height: 60,
                                  width: 60,
                                  margin: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                      color: Colors.red,
                                      borderRadius: BorderRadius.circular(5),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/npp.png"),
                                          fit: BoxFit.cover
                                      )
                                  ),
                                ),
                                Expanded(
                                  child: Container(
                                    height: 120,
                                    width: 200,
                                    padding: EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(10),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          spreadRadius: 1,
                                          blurRadius: 2,
                                          offset: Offset(0, 2), // changes position of shadow
                                        ),
                                      ],
                                    ),
                                    child: Center(
                                      child:Text("134", style: TextStyle(
                                        fontWeight: FontWeight.w800,
                                        fontSize: 38
                                      ),),
                                    ),
                                  ),
                                ),

                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  height: 120,
                                  width: 120,
                                  decoration: BoxDecoration(
                                      color: Colors.transparent,
                                      borderRadius: BorderRadius.circular(15),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/mahama.png"),
                                          fit: BoxFit.cover
                                      )
                                  ),
                                ),
                                Container(
                                  height: 60,
                                  width: 60,
                                  margin: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                      //color: Colors.red,
                                      borderRadius: BorderRadius.circular(5),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/ndc.png"),
                                          fit: BoxFit.contain
                                      )
                                  ),
                                ),
                                Expanded(
                                  child: Container(
                                    height: 120,
                                    width: 200,
                                    padding: EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(10),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          spreadRadius: 1,
                                          blurRadius: 2,
                                          offset: Offset(0, 2), // changes position of shadow
                                        ),
                                      ],
                                    ),
                                    child: Center(
                                      child:Text("23454", style: TextStyle(
                                          fontWeight: FontWeight.w800,
                                          fontSize: 38
                                      ),),
                                    ),
                                  ),
                                ),

                              ],
                            ),
                          ),

                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  height: 120,
                                  width: 120,
                                  decoration: BoxDecoration(
                                      color: Colors.transparent,
                                      borderRadius: BorderRadius.circular(15),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/nana.png"),
                                          fit: BoxFit.contain
                                      )
                                  ),
                                ),
                                Container(
                                  height: 60,
                                  width: 60,
                                  margin: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                      color: Colors.red,
                                      borderRadius: BorderRadius.circular(5),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/npp.png"),
                                          fit: BoxFit.cover
                                      )
                                  ),
                                ),
                                Expanded(
                                  child: Container(
                                    height: 120,
                                    width: 200,
                                    padding: EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(10),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          spreadRadius: 1,
                                          blurRadius: 2,
                                          offset: Offset(0, 2), // changes position of shadow
                                        ),
                                      ],
                                    ),
                                    child: Center(
                                      child:Text("134", style: TextStyle(
                                          fontWeight: FontWeight.w800,
                                          fontSize: 38
                                      ),),
                                    ),
                                  ),
                                ),

                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  height: 120,
                                  width: 120,
                                  decoration: BoxDecoration(
                                      color: Colors.transparent,
                                      borderRadius: BorderRadius.circular(15),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/mahama.png"),
                                          fit: BoxFit.cover
                                      )
                                  ),
                                ),
                                Container(
                                  height: 60,
                                  width: 60,
                                  margin: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                    //color: Colors.red,
                                      borderRadius: BorderRadius.circular(5),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/ndc.png"),
                                          fit: BoxFit.contain
                                      )
                                  ),
                                ),
                                Expanded(
                                  child: Container(
                                    height: 120,
                                    width: 200,
                                    padding: EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(10),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          spreadRadius: 1,
                                          blurRadius: 2,
                                          offset: Offset(0, 2), // changes position of shadow
                                        ),
                                      ],
                                    ),
                                    child: Center(
                                      child:Text("23454", style: TextStyle(
                                          fontWeight: FontWeight.w800,
                                          fontSize: 38
                                      ),),
                                    ),
                                  ),
                                ),

                              ],
                            ),
                          ),

                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  height: 120,
                                  width: 120,
                                  decoration: BoxDecoration(
                                      color: Colors.transparent,
                                      borderRadius: BorderRadius.circular(15),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/nana.png"),
                                          fit: BoxFit.contain
                                      )
                                  ),
                                ),
                                Container(
                                  height: 60,
                                  width: 60,
                                  margin: EdgeInsets.all(10),
                                  decoration: BoxDecoration(
                                      color: Colors.red,
                                      borderRadius: BorderRadius.circular(5),
                                      image: DecorationImage(
                                          image: AssetImage("assets/images/npp.png"),
                                          fit: BoxFit.cover
                                      )
                                  ),
                                ),
                                Expanded(
                                  child: Container(
                                    height: 120,
                                    width: 200,
                                    padding: EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(10),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          spreadRadius: 1,
                                          blurRadius: 2,
                                          offset: Offset(0, 2), // changes position of shadow
                                        ),
                                      ],
                                    ),
                                    child: Center(
                                      child:Text("134", style: TextStyle(
                                          fontWeight: FontWeight.w800,
                                          fontSize: 38
                                      ),),
                                    ),
                                  ),
                                ),

                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  height: 70,
                                  //width: 120,
                                  child: Text(
                                    "Rejected",
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                        fontSize: 25,
                                        fontWeight: FontWeight.w600),
                                  ),
                                ),
                                Container(
                                  height: 60,
                                  width: 60,
                                  margin: EdgeInsets.all(10),
                                ),
                                Expanded(
                                  child: Container(
                                    height: 70,
                                    width: 200,
                                    padding: EdgeInsets.all(10),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(10),
                                      boxShadow: [
                                        BoxShadow(
                                          color: Colors.black.withOpacity(0.1),
                                          spreadRadius: 1,
                                          blurRadius: 2,
                                          offset: Offset(0, 2), // changes position of shadow
                                        ),
                                      ],
                                    ),
                                    child: Center(
                                      child:Text("23454", style: TextStyle(
                                          fontWeight: FontWeight.w800,
                                          fontSize: 38
                                      ),),
                                    ),
                                  ),
                                ),



                              ],
                            ),
                          ),



                        ],
                      )

                  ),

                  InkWell(
                    onTap: () {
                      Navigator.push(context, MaterialPageRoute(builder: (context) => ViewPresidentialResultImageScreen()));

                    },
                    child: Container(
                      padding: EdgeInsets.all(20),
                      margin: EdgeInsets.symmetric(horizontal: 15),
                      height: 59,
                      width: MediaQuery.of(context).size.width,
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(7),
                      ),
                      child: Center(
                        child: Text(
                          "View Result Image",
                          style: TextStyle(color: Colors.white),
                        ),
                      ),
                    ),
                  ),

                  SizedBox(
                    height: 10,
                  ),



                ],
              ),
            ],
          ),
        ),
      ),
    );
  }


  FutureBuilder<SignInModel> buildFutureBuilder() {
    return FutureBuilder<SignInModel>(
        future: _futureSignIn,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingDialogBox(text: 'Please Wait..',);
          }
          else if(snapshot.hasData) {

            var data = snapshot.data!;

            print("#########################");
            //print(data.data!.token!);

            if(data.message == "Successful") {

              WidgetsBinding.instance.addPostFrameCallback((timeStamp) {
                Navigator.pushReplacement(
                  context,
                  MaterialPageRoute(builder: (context) => HomeScreen()),
                );

                showDialog(
                    barrierDismissible: true,
                    context: context,
                    builder: (BuildContext context) {
                      // Show the dialog
                      return SuccessDialogBox(text: "Login Successful");
                    }
                );
              });


            }

            else if (data.message == "Errors") {
              String? errorKey = snapshot.data!.errors!.keys.firstWhere(
                    (key) => key == "password" || key == "email",
                orElse: () => null!,
              );
              if (errorKey != null) {
                WidgetsBinding.instance.addPostFrameCallback((_) {

                  Navigator.pushReplacement(context,
                      MaterialPageRoute(builder: (context) => ViewPresidentialResultScreen())
                  );

                  String customErrorMessage = snapshot.data!.errors![errorKey]![0];
                  showDialog(
                      barrierDismissible: true,
                      context: context,
                      builder: (BuildContext context){
                        return ErrorDialogBox(text: customErrorMessage);
                      }
                  );

                });
              }
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
