import 'dart:convert';

import 'package:http/http.dart' as http;

import '../Auth/Login/models/sign_in_model.dart';
import 'api_environment.dart';
import 'auth_storage.dart';

class AuthRepository {
  AuthRepository(this._client, this._storage, this._environment);

  final http.Client _client;
  final AuthStorage _storage;
  final ApiEnvironment _environment;

  Future<SignInModel> login(
    String email,
    String password, {
    String? fcmToken,
  }) async {
    final uri = _environment.resolveApi('accounts/login-correspondent/');
    final response = await _client.post(
      uri,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      },
      body: jsonEncode({
        'email': email,
        'password': password,
        if (fcmToken != null && fcmToken.isNotEmpty) 'fcm_token': fcmToken,
      }),
    );

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode != 200) {
      final message = decoded['detail'] ?? decoded['message'] ?? 'Unable to sign in';
      throw Exception(message);
    }

    final model = SignInModel.fromJson(decoded);
    final access = model.data?.accessToken;
    final refresh = model.data?.refreshToken;

    if (access != null && refresh != null) {
      await _storage.saveTokens(accessToken: access, refreshToken: refresh);
    }

    return model;
  }

  Future<bool> refreshToken() async {
    final refresh = await _storage.readRefreshToken();
    if (refresh == null) {
      return false;
    }

    final uri = _environment.resolveApi('accounts/token/refresh/');
    final response = await _client.post(
      uri,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Accept': 'application/json',
      },
      body: jsonEncode({'refresh': refresh}),
    );

    if (response.statusCode != 200) {
      if (response.statusCode == 401) {
        await _storage.clear();
      }
      return false;
    }

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;
    final newAccess = decoded['access'] as String?;
    if (newAccess == null) {
      return false;
    }

    await _storage.saveTokens(accessToken: newAccess, refreshToken: refresh);
    return true;
  }

  Future<Map<String, String>> authorizationHeaders() async {
    final token = await _storage.readAccessToken();
    if (token == null) {
      return {};
    }
    return {'Authorization': 'Bearer $token'};
  }

  Future<void> signOut() async {
    await _storage.clear();
  }
}
