import 'dart:ui';

import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/services.dart';

const ghPrimary = Color(0xffF47D7B);
const ghWhite = Color(0x88ffffff);
const ghLightblue = Color(0xff8FBFE0);

const bodyText1 = Color(0xffffffff);
const bodyText2 = Color(0xffffffff);
const clay = Color(0xffa499b3);

//const hostName = "http://192.168.43.121:8000/api/";
//const hostNameMedia = "http://192.168.43.121:8000";

//const hostName = "http://192.168.43.223:8000/api/";
//const hostNameMedia = "http://192.168.43.223:8000";

const hostName = "http://92.112.194.239:5050/api/";
const hostNameMedia = "http://92.112.194.239:5050";

Future<String?> getApiPref() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString("API_Key");
}

Future<String?> getUserIDPref() async {
  SharedPreferences prefs = await SharedPreferences.getInstance();
  return prefs.getString("USER_ID");
}

class PasteTextInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    // Allow pasting of text by returning the new value unchanged
    return newValue;
  }
}
