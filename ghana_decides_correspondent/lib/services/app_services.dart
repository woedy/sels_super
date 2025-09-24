import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import 'api_client.dart';
import 'api_environment.dart';
import 'auth_repository.dart';
import 'auth_storage.dart';
import 'submission_queue_service.dart';

class AppServices {
  AppServices._();

  static final AppServices instance = AppServices._();

  late final SharedPreferences sharedPreferences;
  late final http.Client httpClient;
  late final AuthStorage authStorage;
  late final ApiEnvironment apiEnvironment;
  late final AuthRepository authRepository;
  late final ApiClient apiClient;
  late final SubmissionQueueService submissionQueueService;

  bool _initialized = false;

  Future<void> initialize() async {
    if (_initialized) {
      return;
    }

    sharedPreferences = await SharedPreferences.getInstance();
    httpClient = http.Client();
    authStorage = AuthStorage();
    apiEnvironment = ApiEnvironment(sharedPreferences);
    await apiEnvironment.ensureInitialized();
    authRepository = AuthRepository(httpClient, authStorage, apiEnvironment);
    apiClient = ApiClient(httpClient, authRepository, apiEnvironment);
    submissionQueueService = SubmissionQueueService(
      sharedPreferences: sharedPreferences,
      apiClient: apiClient,
    );
    await submissionQueueService.initialize();

    _initialized = true;
  }
}
