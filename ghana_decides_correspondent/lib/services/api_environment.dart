import 'package:shared_preferences/shared_preferences.dart';

const String defaultApiBaseUrl = String.fromEnvironment(
  'API_BASE_URL',
  defaultValue: 'http://localhost:5050/api/',
);

const String defaultMediaBaseUrl = String.fromEnvironment(
  'API_MEDIA_BASE_URL',
  defaultValue: 'http://localhost:5050',
);

class ApiEnvironment {
  ApiEnvironment(this._preferences);

  static const String _apiBaseUrlKey = 'sels_api_base_url';
  static const String _mediaBaseUrlKey = 'sels_media_base_url';

  final SharedPreferences _preferences;

  bool _initialized = false;
  late String _apiBaseUrl;
  late String _mediaBaseUrl;

  Future<void> ensureInitialized() async {
    if (_initialized) {
      return;
    }

    _apiBaseUrl = _normalizeApiUrl(
      _preferences.getString(_apiBaseUrlKey) ?? defaultApiBaseUrl,
    );
    _mediaBaseUrl = _normalizeMediaUrl(
      _preferences.getString(_mediaBaseUrlKey) ?? defaultMediaBaseUrl,
    );

    _initialized = true;
  }

  String get apiBaseUrl => _apiBaseUrl;

  String get mediaBaseUrl => _mediaBaseUrl;

  Uri resolveApi(String path) {
    final sanitized = path.startsWith('/') ? path.substring(1) : path;
    return Uri.parse('$_apiBaseUrl$sanitized');
  }

  String resolveMedia(String path) {
    if (path.isEmpty) {
      return _mediaBaseUrl;
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    final sanitized = path.startsWith('/') ? path.substring(1) : path;
    return '$_mediaBaseUrl/$sanitized';
  }

  Future<void> overrideBaseUrls({String? apiBaseUrl, String? mediaBaseUrl}) async {
    if (apiBaseUrl != null && apiBaseUrl.isNotEmpty) {
      _apiBaseUrl = _normalizeApiUrl(apiBaseUrl);
      await _preferences.setString(_apiBaseUrlKey, _apiBaseUrl);
    }
    if (mediaBaseUrl != null && mediaBaseUrl.isNotEmpty) {
      _mediaBaseUrl = _normalizeMediaUrl(mediaBaseUrl);
      await _preferences.setString(_mediaBaseUrlKey, _mediaBaseUrl);
    }
  }

  Future<void> clearOverrides() async {
    await _preferences.remove(_apiBaseUrlKey);
    await _preferences.remove(_mediaBaseUrlKey);
    _apiBaseUrl = _normalizeApiUrl(defaultApiBaseUrl);
    _mediaBaseUrl = _normalizeMediaUrl(defaultMediaBaseUrl);
  }

  String _normalizeApiUrl(String value) {
    var normalized = value.trim();
    if (!normalized.endsWith('/')) {
      normalized = '$normalized/';
    }
    return normalized;
  }

  String _normalizeMediaUrl(String value) {
    var normalized = value.trim();
    if (normalized.endsWith('/')) {
      normalized = normalized.substring(0, normalized.length - 1);
    }
    return normalized;
  }
}
