import 'dart:convert';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Login/models/sign_in_model.dart';
import 'package:ghd_correspondent/Auth/Register/register_screen.dart';
import 'package:ghd_correspondent/Components/generic_error_dialog_box.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/generic_success_dialog_box.dart';
import 'package:ghd_correspondent/Components/keyboard_utils.dart';
import 'package:ghd_correspondent/Elections/enter_parliamentary_results.dart';
import 'package:ghd_correspondent/Elections/enter_presidential_results.dart';
import 'package:ghd_correspondent/Elections/view_parliamentary_results.dart';
import 'package:ghd_correspondent/Elections/view_presidential_results.dart';
import 'package:ghd_correspondent/Homepage/homepage_screen.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';



class SubmittedResultScreen extends StatefulWidget {
  const SubmittedResultScreen({super.key});

  @override
  State<SubmittedResultScreen> createState() => _SubmittedResultScreenState();
}

class _SubmittedResultScreenState extends State<SubmittedResultScreen> {
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
                                  Navigator.push(context, MaterialPageRoute(builder: (context) => ViewPresidentialResultScreen()));




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
                                        "View\nPresidential Results",
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
                                  Navigator.push(context, MaterialPageRoute(builder: (context) => ViewParliamentaryResultScreen()));




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
                                        "View\nParliamentary Results",
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
                      MaterialPageRoute(builder: (context) => SubmittedResultScreen())
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
