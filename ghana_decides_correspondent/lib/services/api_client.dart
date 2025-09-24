import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import 'api_environment.dart';
import 'auth_repository.dart';

class ApiClient {
  ApiClient(this._client, this._authRepository, this._environment);

  final http.Client _client;
  final AuthRepository _authRepository;
  final ApiEnvironment _environment;

  Future<http.Response> get(
    String path, {
    Map<String, String>? headers,
    bool authenticated = true,
  }) {
    return _send(
      'GET',
      path,
      headers: headers,
      authenticated: authenticated,
    );
  }

  Future<http.Response> post(
    String path, {
    Map<String, dynamic>? body,
    Map<String, String>? headers,
    bool authenticated = true,
  }) {
    return _send(
      'POST',
      path,
      body: body,
      headers: headers,
      authenticated: authenticated,
    );
  }

  Future<http.Response> _send(
    String method,
    String path, {
    Map<String, dynamic>? body,
    Map<String, String>? headers,
    bool authenticated = true,
  }) async {
    final uri = _environment.resolveApi(path);
    final requestHeaders = <String, String>{
      'Accept': 'application/json',
    };

    if (body != null) {
      requestHeaders['Content-Type'] = 'application/json; charset=UTF-8';
    }

    if (headers != null) {
      requestHeaders.addAll(headers);
    }

    if (authenticated) {
      requestHeaders.addAll(await _authRepository.authorizationHeaders());
    }

    http.Response response;
    try {
      response = await _dispatch(method, uri, requestHeaders, body);
    } on SocketException {
      rethrow;
    }

    if (response.statusCode == 401 && authenticated) {
      final refreshed = await _authRepository.refreshToken();
      if (refreshed) {
        final refreshedHeaders = Map<String, String>.from(requestHeaders);
        refreshedHeaders
            .addAll(await _authRepository.authorizationHeaders());
        response = await _dispatch(method, uri, refreshedHeaders, body);
      }
    }

    return response;
  }

  Future<http.Response> _dispatch(
    String method,
    Uri uri,
    Map<String, String> headers,
    Map<String, dynamic>? body,
  ) {
    switch (method) {
      case 'POST':
        return _client.post(
          uri,
          headers: headers,
          body: body != null ? jsonEncode(body) : null,
        );
      case 'GET':
      default:
        return _client.get(uri, headers: headers);
    }
  }
}
