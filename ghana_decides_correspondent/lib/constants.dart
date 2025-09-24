import 'dart:ui';

import 'package:flutter/services.dart';

import 'services/app_services.dart';
import 'services/api_environment.dart';
import 'services/auth_storage.dart';

const ghPrimary = Color(0xffF47D7B);
const ghWhite = Color(0x88ffffff);
const ghLightblue = Color(0xff8FBFE0);

const bodyText1 = Color(0xffffffff);
const bodyText2 = Color(0xffffffff);
const clay = Color(0xffa499b3);

ApiEnvironment get apiEnvironment => AppServices.instance.apiEnvironment;

AuthStorage get authStorage => AppServices.instance.authStorage;

String get apiBaseUrl => apiEnvironment.apiBaseUrl;

String get mediaBaseUrl => apiEnvironment.mediaBaseUrl;

String get hostName => apiBaseUrl;

String get hostNameMedia => mediaBaseUrl;

Uri buildApiUri(String path) => apiEnvironment.resolveApi(path);

String resolveMediaUrl(String path) => apiEnvironment.resolveMedia(path);

Future<String?> getApiPref() async {
  return authStorage.readAccessToken();
}

Future<String?> getUserIDPref() async {
  return AppServices.instance.sharedPreferences.getString("USER_ID");
}

class PasteTextInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {
    // Allow pasting of text by returning the new value unchanged
    return newValue;
  }
}
