import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Login/models/sign_in_model.dart';
import 'package:ghd_correspondent/Auth/Register/register_screen.dart';
import 'package:ghd_correspondent/Components/generic_error_dialog_box.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/generic_success_dialog_box.dart';
import 'package:ghd_correspondent/Components/keyboard_utils.dart';
import 'package:ghd_correspondent/Homepage/homepage_screen.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:ghd_correspondent/services/app_services.dart';



Future<void> saveUserID(String userId) async {
  await AppServices.instance.sharedPreferences.setString('USER_ID', userId);
}

Future<void> saveUserData(SignInData data) async {
  final encoded = json.encode(data.toJson());
  await AppServices.instance.sharedPreferences.setString('user_data', encoded);
}

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();

  var show_password = false;

  Future<SignInModel>? _futureSignIn;

  String? email;
  String? password;


  @override
  Widget build(BuildContext context) {
    return (_futureSignIn == null) ? buildColumn() : buildFutureBuilder();
  }

  void _startLogin() {
    final form = _formKey.currentState;
    if (form == null) {
      return;
    }
    if (!form.validate()) {
      return;
    }
    form.save();
    FocusScope.of(context).unfocus();
    final trimmedEmail = email?.trim();
    final trimmedPassword = password?.trim();
    if (trimmedEmail == null || trimmedPassword == null) {
      return;
    }

    setState(() {
      _futureSignIn = AppServices.instance.authRepository.login(
        trimmedEmail,
        trimmedPassword,
      );
    });
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
                  Text(
                    "Login",
                    style: TextStyle(
                      fontSize: 35,
                      height: 1,
                      fontWeight: FontWeight.w700,
                      fontFamily: "Fontspring",
                      color: Colors.white,
                    ),
                  ),
                  SizedBox(
                    height: 20,
                  ),

                  Expanded(
                      child: ListView(
                        children: [
                          Container(
                            //height: MediaQuery.of(context).size.height,
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
                              children: [
                                SizedBox(
                                  height: 20,
                                ),
                                Form(
                                  key: _formKey,
                                  child: Column(
                                    children: [

                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,

                                        children: [
                                          Text("Email", style: TextStyle(fontSize: 12, ),),
                                          SizedBox(
                                            height: 10,
                                          ),

                                          Container(
                                            padding: EdgeInsets.symmetric(horizontal: 10),
                                            decoration: BoxDecoration(
                                                color: Colors.transparent,
                                                borderRadius: BorderRadius.circular(15),
                                                border: Border.all(
                                                    color: Colors.white.withOpacity(0.4))),
                                            child: TextFormField(
                                              style: TextStyle(color: Colors.white),
                                              decoration: InputDecoration(
                                                //hintText: 'Enter Username/Email',

                                                hintStyle: TextStyle(
                                                    color: Colors.grey,
                                                    fontWeight: FontWeight.normal),
                                                labelText: "Email",
                                                labelStyle: TextStyle(
                                                    fontSize: 13,
                                                    color: Colors.white.withOpacity(0.5)),
                                                enabledBorder: UnderlineInputBorder(
                                                    borderSide:
                                                    BorderSide(color: Colors.white)),
                                                focusedBorder: UnderlineInputBorder(
                                                    borderSide:
                                                    BorderSide(color: Colors.white)),
                                                border: InputBorder.none,
                                              ),
                                              inputFormatters: [
                                                LengthLimitingTextInputFormatter(225),
                                                PasteTextInputFormatter(),
                                              ],
                                              validator: (value) {
                                                if (value!.isEmpty) {
                                                  return 'Email is required';
                                                }

                                                String pattern =
                                                    r"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]"
                                                    r"{0,253}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]"
                                                    r"{0,253}[a-zA-Z0-9])?)*$";
                                                RegExp regex = RegExp(pattern);
                                                if (!regex.hasMatch(value))
                                                  return 'Enter a valid email address';

                                                return null;
                                              },
                                              textInputAction: TextInputAction.next,
                                              autofocus: false,
                                              onSaved: (value) {
                                                setState(() {
                                                  email = value;
                                                });
                                              },
                                            ),
                                          ),
                                        ],
                                      ),
                                      SizedBox(
                                        height: 10,
                                      ),

                                      Column(
                                        crossAxisAlignment: CrossAxisAlignment.start,
                                        children: [
                                          Text("Password", style: TextStyle(fontSize: 12),),
                                          SizedBox(
                                            height: 10,
                                          ),
                                          Container(
                                            padding: EdgeInsets.symmetric(horizontal: 10),
                                            decoration: BoxDecoration(
                                                color: Colors.transparent,
                                                borderRadius: BorderRadius.circular(15),
                                                border:
                                                Border.all(color: Colors.white.withOpacity(0.4))),
                                            child: TextFormField(
                                              style: TextStyle(color: Colors.white),
                                              decoration: InputDecoration(
                                                //hintText: 'Enter Password',
                                                  suffixIcon: IconButton(
                                                    onPressed: () {
                                                      setState(() {
                                                        show_password = !show_password;
                                                      });
                                                    },
                                                    icon: Icon(
                                                      show_password
                                                          ? Icons.remove_red_eye_outlined
                                                          : Icons.remove_red_eye,
                                                      color: Colors.white.withOpacity(0.1),
                                                    ),
                                                  ),
                                                  hintStyle: TextStyle(
                                                      color: Colors.grey,
                                                      fontWeight: FontWeight.normal),
                                                  labelText: "Password",
                                                  labelStyle:
                                                  TextStyle(fontSize: 13, color: Colors.white.withOpacity(0.5)),
                                                  enabledBorder: UnderlineInputBorder(
                                                      borderSide: BorderSide(color: Colors.white)),
                                                  focusedBorder: UnderlineInputBorder(
                                                      borderSide: BorderSide(color: Colors.white)),
                                                  border: InputBorder.none),
                                              inputFormatters: [
                                                LengthLimitingTextInputFormatter(225),
                                                PasteTextInputFormatter(),
                                              ],
                                              validator: (value) {
                                                if (value!.isEmpty) {
                                                  return 'Password is required';
                                                }
                                                if (!RegExp(r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#\$%^&*_()\-+=/.,<>?"~`£{}|:;])')
                                                    .hasMatch(value)) {

                                                  ScaffoldMessenger.of(context).showSnackBar(
                                                    SnackBar(
                                                      content: Text("- Password must be at least 8 characters long\n- Must include at least one uppercase letter,\n- One lowercase letter, one digit,\n- And one special character",),
                                                      backgroundColor: Colors.red,
                                                    ),
                                                  );
                                                  return '';
                                                }
                                                return null;
                                              },
                                              onChanged: (value) {
                                                setState(() {
                                                  password = value;
                                                });
                                              },
                                              textInputAction: TextInputAction.next,
                                              obscureText: show_password ? false : true,
                                              onSaved: (value) {
                                                setState(() {
                                                  password = value;
                                                });
                                              },
                                            ),
                                          ),
                                        ],
                                      ),

                                      SizedBox(
                                        height: 20,
                                      ),
                                      InkWell(
                                        onTap: _startLogin,
                                        child: Container(
                                          padding: EdgeInsets.all(20),
                                          //margin: EdgeInsets.all(10),
                                          height: 59,
                                          width: MediaQuery.of(context).size.width,
                                          decoration: BoxDecoration(
                                              color: Colors.black,
                                              borderRadius: BorderRadius.circular(7)),
                                          child: Center(
                                            child: Text(
                                              "Login",
                                              style: TextStyle(color: Colors.white),
                                            ),
                                          ),
                                        ),
                                      ),

                                      SizedBox(
                                        height: 20,
                                      ),
                                      InkWell(
                                        onTap: (){
                                         // Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context) => ForgotPassword()));

                                        },
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text("Forgot password? ", style: TextStyle(fontSize: 12),),
                                            Text("Click here to recover", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600,),),
                                          ],
                                        ),
                                      ),
                                      SizedBox(
                                        height: 50,
                                      ),
                                      Container(
                                        width: MediaQuery.of(context).size.width,
                                        child: Row(
                                          children: [
                                            Expanded(
                                              child: Container(
                                                height: 1,
                                                decoration: BoxDecoration(
                                                    color: Colors.black.withOpacity(0.3)),
                                              ),
                                            ),
                                            SizedBox(
                                              width: 5,
                                            ),


                                            Text(
                                              "or",
                                              style: TextStyle(fontSize: 15, fontFamily: "Fontspring"),
                                            ),
                                            SizedBox(
                                              width: 5,
                                            ),
                                            Expanded(
                                              child: Container(
                                                height: 1,
                                                decoration: BoxDecoration(
                                                    color: Colors.black.withOpacity(0.3)),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      SizedBox(
                                        height: 20,
                                      ),

                                      SizedBox(
                                        height: 20,
                                      ),
                                      InkWell(
                                        onTap: () {
                                          Navigator.of(context).push(MaterialPageRoute(
                                              builder: (BuildContext context) =>
                                                  RegisterScreen()));
                                        },
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.center,
                                          children: [
                                            Text(
                                              "Don't have an account? ",
                                              style: TextStyle(fontSize: 12),
                                            ),
                                            Text(
                                              "Sign up here",
                                              style: TextStyle(
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,),
                                            ),
                                          ],
                                        ),
                                      )
                                    ],
                                  ),
                                ),


                              ],
                            ),
                          ),
                        ],
                      )
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
          return LoadingDialogBox(text: 'Signing in...');
        }

        if (snapshot.hasError) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            setState(() {
              _futureSignIn = null;
            });
            showDialog(
              barrierDismissible: true,
              context: context,
              builder: (context) => ErrorDialogBox(
                text: snapshot.error.toString(),
              ),
            );
          });
          return LoadingDialogBox(text: 'Please Wait..');
        }

        if (snapshot.hasData) {
          final signIn = snapshot.data!;
          final info = signIn.data;

          if (info != null) {
            WidgetsBinding.instance.addPostFrameCallback((_) async {
              if (info.userId != null) {
                await saveUserID(info.userId!);
              }
              await saveUserData(info);
              setState(() {
                _futureSignIn = null;
              });
              Navigator.pushReplacement(
                context,
                MaterialPageRoute(builder: (context) => HomeScreen()),
              );
              showDialog(
                barrierDismissible: true,
                context: context,
                builder: (BuildContext context) {
                  return SuccessDialogBox(text: 'Login Successful');
                },
              );
            });
          } else {
            final errorMessage = _extractErrorMessage(signIn) ??
                'Unable to sign in. Please try again.';
            WidgetsBinding.instance.addPostFrameCallback((_) {
              setState(() {
                _futureSignIn = null;
              });
              showDialog(
                barrierDismissible: true,
                context: context,
                builder: (context) => ErrorDialogBox(text: errorMessage),
              );
            });
          }

          return LoadingDialogBox(text: 'Please Wait..');
        }

        return LoadingDialogBox(text: 'Please Wait..');
      },
    );
  }

  String? _extractErrorMessage(SignInModel model) {
    if (model.detail != null && model.detail!.isNotEmpty) {
      return model.detail;
    }
    final errors = model.errors;
    if (errors != null) {
      for (final entry in errors.values) {
        if (entry.isNotEmpty) {
          return entry.first;
        }
      }
    }
    return null;
  }


  void dispose() {
    super.dispose();
  }

}
