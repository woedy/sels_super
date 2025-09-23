import 'dart:convert';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Auth/Login/models/sign_in_model.dart';
import 'package:ghd_correspondent/Auth/Register/photo_upload.dart';
import 'package:ghd_correspondent/Components/generic_error_dialog_box.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/generic_success_dialog_box.dart';
import 'package:ghd_correspondent/Components/keyboard_utils.dart';
import 'package:ghd_correspondent/Homepage/homepage_screen.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;
import 'package:intl_phone_field/intl_phone_field.dart';
import 'package:shared_preferences/shared_preferences.dart';



Future<SignInModel> signInUser(String email, String password) async {

  final response = await http.post(
    Uri.parse(hostName + "accounts/login-user/"),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json'
    },
    body: jsonEncode({
      "email": email,
      "password": password,
      "fcm_token": "dsfsdfdsfsdfds",
    }),
  );


  if (response.statusCode == 200) {
    print(jsonDecode(response.body));
    final result = json.decode(response.body);
    if (result != null) {
      print(result['data']['token'].toString());

      await saveIDApiKey(result['data']['token'].toString());
      await saveUserID(result['data']['user_id'].toString());


      await saveUserData(result['data']);




    }
    return SignInModel.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 422) {
    print(jsonDecode(response.body));
    return SignInModel.fromJson(jsonDecode(response.body));
  }  else if (response.statusCode == 403) {
    print(jsonDecode(response.body));
    return SignInModel.fromJson(jsonDecode(response.body));
  }   else if (response.statusCode == 400) {
    print(jsonDecode(response.body));
    return SignInModel.fromJson(jsonDecode(response.body));
  }  else {

    throw Exception('Failed to Sign In');
  }
}

Future<bool> saveIDApiKey(String apiKey) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString("API_Key", apiKey);
  return prefs.commit();
}

Future<bool> saveUserID(String apiKey) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString("USER_ID", apiKey);
  return prefs.commit();
}


Future<void> saveUserData(Map<String, dynamic> userData) async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  prefs.setString('user_data', json.encode(userData));
}


class RegisterScreen extends StatefulWidget {
  const RegisterScreen({super.key});

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();

  var show_password = false;

  Future<SignInModel>? _futureSignIn;
  FocusNode focusNode = FocusNode();

  String? email;
  String? password;

  String? full_name;
  String? phone;
  String? _code;
  String? _number;
  String? country;


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
                      child: ListView(
                        children: [
                          Container(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 15),

                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,

                                    children: [
                                      Text("Account Setup", style: TextStyle(fontSize: 48, fontFamily: "Fontspring", height: 1 , fontWeight: FontWeight.w700),),
                                      SizedBox(
                                        height: 15,
                                      ),

                                      Text("Hey, tell us about yourself", style: TextStyle(fontSize: 25, ),),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  height: 20,
                                ),
                                Container(

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
                                  child: Form(
                                    key: _formKey,
                                    child: Column(
                                      children: [
                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text("First name", style: TextStyle(fontSize: 12, ),),
                                            SizedBox(
                                              height: 10,
                                            ),

                                            Container(
                                              padding: EdgeInsets.symmetric(horizontal: 10),
                                              decoration: BoxDecoration(
                                                  color: Colors.transparent,
                                                  borderRadius: BorderRadius.circular(10),
                                                  border: Border.all(
                                                      color: Colors.white.withOpacity(0.4))),
                                              child: TextFormField(
                                                style: TextStyle(color: Colors.white),
                                                decoration: InputDecoration(
                                                  //hintText: 'Enter Username/Email',

                                                  hintStyle: TextStyle(
                                                      color: Colors.grey,
                                                      fontWeight: FontWeight.normal),
                                                  labelText: "First name",
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
                                                    return 'Full name is required';
                                                  }
                                                  if (value.length < 3) {
                                                    return 'Full name too short';
                                                  }
                                                },
                                                textInputAction: TextInputAction.next,
                                                autofocus: false,
                                                onSaved: (value) {
                                                  setState(() {
                                                    full_name = value;
                                                  });
                                                },
                                              ),
                                            ),
                                          ],
                                        ),

                                        SizedBox(
                                          height: 20,
                                        ),

                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text("Last name", style: TextStyle(fontSize: 12, ),),
                                            SizedBox(
                                              height: 10,
                                            ),

                                            Container(
                                              padding: EdgeInsets.symmetric(horizontal: 10),
                                              decoration: BoxDecoration(
                                                  color: Colors.transparent,
                                                  borderRadius: BorderRadius.circular(10),
                                                  border: Border.all(
                                                      color: Colors.white.withOpacity(0.4))),
                                              child: TextFormField(
                                                style: TextStyle(color: Colors.white),
                                                decoration: InputDecoration(
                                                  //hintText: 'Enter Username/Email',

                                                  hintStyle: TextStyle(
                                                      color: Colors.grey,
                                                      fontWeight: FontWeight.normal),
                                                  labelText: "Last name",
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
                                                    return 'Full name is required';
                                                  }
                                                  if (value.length < 3) {
                                                    return 'Full name too short';
                                                  }
                                                },
                                                textInputAction: TextInputAction.next,
                                                autofocus: false,
                                                onSaved: (value) {
                                                  setState(() {
                                                    full_name = value;
                                                  });
                                                },
                                              ),
                                            ),
                                          ],
                                        ),

                                        SizedBox(
                                          height: 20,
                                        ),

                                        Column(
                                          crossAxisAlignment: CrossAxisAlignment.start,

                                          children: [
                                            Text("Contact Number", style: TextStyle(fontSize: 12),),
                                            SizedBox(
                                              height: 20,
                                            ),
                                            IntlPhoneField(
                                              focusNode: focusNode,
                                              style: TextStyle(color: Colors.white),
                                              dropdownIcon: Icon(Icons.arrow_drop_down, color: Colors.grey,),
                                              decoration: InputDecoration(
                                                // labelText: 'Phone Number',
                                                  border: OutlineInputBorder(

                                                    borderSide: BorderSide(
                                                      color: Colors.transparent,
                                                    ),
                                                  ),
                                                  enabledBorder:  new OutlineInputBorder(
                                                    borderSide:  BorderSide(color: Colors.black.withOpacity(0.1)),

                                                  ),
                                                  focusedBorder:  new OutlineInputBorder(
                                                    borderSide:  BorderSide(color: Colors.black.withOpacity(0.1)),
                                                  )
                                              ),
                                              languageCode: "en",
                                              initialCountryCode: "GH",
                                              validator: (e){
                                                if(e == null){
                                                  return 'Phone Number required';
                                                }
                                                return null;
                                              },
                                              onChanged: (value) {
                                                _code = value.countryCode.toString();
                                                _number = value.number.toString();
                                                country = value.countryISOCode.toString();
                                              },
                                              onCountryChanged: (country) {

                                              },

                                              onSaved: (value) {
                                                //_onSaveForm(value.toString());
                                                setState(() {
                                                  _code = value!.countryCode.toString();
                                                  _number = value.number.toString();
                                                  country = value.countryISOCode.toString();
                                                });

                                              },

                                            ),
                                          ],
                                        ),
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
                                                      color: Colors.white.withOpacity(0.1))),
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

                                        InkWell(
                                          onTap: () {

/*

                                            if (_formKey.currentState!.validate()) {
                                              _formKey.currentState!.save();
                                              KeyboardUtil.hideKeyboard(context);

                                              phone = _code.toString() + _number.toString();

                                              print("##################");
                                              print(full_name);
                                              print(phone);
                                              print(email);
                                              print(_code);
                                              print(_number);
                                              print(country);

                                              var data = {
                                                "full_name": full_name,
                                                "phone": phone,
                                                "email": email,
                                                "country": country,
                                              };



                                              */
/*              Navigator.push(context, MaterialPageRoute(builder: (context) => UploadPhotoReg(
                                        data: data,
                                      )));
*//*

                                            }
*/




                                            Navigator.push(context, MaterialPageRoute(builder: (context) => UploadPhotoReg(data: {},)));

                                          },
                                          child: Container(
                                            padding: EdgeInsets.all(20),
                                            margin: EdgeInsets.all(15),
                                            height: 59,
                                            width: MediaQuery.of(context).size.width,
                                            decoration: BoxDecoration(
                                                color: Colors.black,
                                                borderRadius: BorderRadius.circular(7)),
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
                      MaterialPageRoute(builder: (context) => RegisterScreen())
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
