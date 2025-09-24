import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

import '../models/result_submission.dart';
import 'api_client.dart';

enum SubmissionQueueMessageType { info, success, error }

class SubmissionQueueStatus {
  const SubmissionQueueStatus({
    required this.pendingCount,
    required this.isSyncing,
    this.lastSyncedAt,
    this.lastMessage,
    this.lastMessageType = SubmissionQueueMessageType.info,
  });

  const SubmissionQueueStatus.initial()
      : pendingCount = 0,
        isSyncing = false,
        lastSyncedAt = null,
        lastMessage = null,
        lastMessageType = SubmissionQueueMessageType.info;

  final int pendingCount;
  final bool isSyncing;
  final DateTime? lastSyncedAt;
  final String? lastMessage;
  final SubmissionQueueMessageType lastMessageType;
}

enum SubmissionDeliveryState { delivered, queued, failed }

class SubmissionResult {
  SubmissionResult(this.state, this.message);

  final SubmissionDeliveryState state;
  final String message;
}

class SubmissionQueueService {
  SubmissionQueueService({
    required this.sharedPreferences,
    required this.apiClient,
    Connectivity? connectivity,
  }) : connectivity = connectivity ?? Connectivity();

  static const String _storageKey = 'sels_offline_submission_queue_v1';
  static const Uuid _uuid = Uuid();

  final ApiClient apiClient;
  final Connectivity connectivity;
  final SharedPreferences sharedPreferences;

  final List<ResultSubmissionPayload> _queue = [];
  final ValueNotifier<SubmissionQueueStatus> statusNotifier =
      ValueNotifier(const SubmissionQueueStatus.initial());
  StreamSubscription<ConnectivityResult>? _subscription;
  bool _isProcessing = false;
  DateTime? _lastSyncedAt;
  String? _lastMessage;
  SubmissionQueueMessageType _lastMessageType =
      SubmissionQueueMessageType.info;

  Future<void> initialize() async {
    _restoreQueue();
    _subscription = connectivity.onConnectivityChanged.listen((status) {
      if (status != ConnectivityResult.none) {
        flushQueue();
      }
    });
    await flushQueue();
    _notifyStatus();
  }

  Future<void> dispose() async {
    await _subscription?.cancel();
    statusNotifier.dispose();
  }

  bool get hasPending => _queue.isNotEmpty;

  List<ResultSubmissionPayload> get pending => List.unmodifiable(_queue);

  String generateSubmissionId() => _uuid.v4();

  Future<SubmissionResult> submit(ResultSubmissionPayload payload) async {
    try {
      final response = await _sendToApi(payload);
      if (_isSuccess(response.statusCode)) {
        _notifyStatus(
          lastSyncedAt: DateTime.now(),
          message: 'Results submitted successfully.',
          messageType: SubmissionQueueMessageType.success,
        );
        return SubmissionResult(
          SubmissionDeliveryState.delivered,
          'Results submitted successfully.',
        );
      }

      if (response.statusCode == 409) {
        _notifyStatus(
          lastSyncedAt: DateTime.now(),
          message: 'These results were already processed.',
          messageType: SubmissionQueueMessageType.info,
        );
        return SubmissionResult(
          SubmissionDeliveryState.delivered,
          'These results were already processed.',
        );
      }

      final message = _extractError(response.body) ?? 'Submission failed.';
      _notifyStatus(
        message: message,
        messageType: SubmissionQueueMessageType.error,
      );
      return SubmissionResult(SubmissionDeliveryState.failed, message);
    } on SocketException {
      await _enqueue(payload);
      _notifyStatus(
        message:
            'No network connection. The result has been queued and will retry automatically.',
        messageType: SubmissionQueueMessageType.info,
      );
      return SubmissionResult(
        SubmissionDeliveryState.queued,
        'No network connection. The result has been queued and will retry automatically.',
      );
    }
  }

  Future<void> flushQueue() async {
    if (_isProcessing || _queue.isEmpty) {
      _notifyStatus();
      return;
    }
    _isProcessing = true;
    _notifyStatus(isSyncing: true);
    try {
      final pending = List<ResultSubmissionPayload>.from(_queue);
      var deliveredAny = false;
      for (final payload in pending) {
        try {
          final response = await _sendToApi(payload);
          if (_isSuccess(response.statusCode) || response.statusCode == 409) {
            _queue.removeWhere((item) => item.id == payload.id);
            _persistQueue();
            deliveredAny = true;
            _notifyStatus();
          } else {
            // Leave in queue for manual follow-up but avoid tight loops
            final isServerError = response.statusCode >= 500;
            if (!isServerError) {
              _queue.removeWhere((item) => item.id == payload.id);
              _persistQueue();
            }
            final message =
                _extractError(response.body) ?? 'Submission failed.';
            _notifyStatus(
              message: message,
              messageType: SubmissionQueueMessageType.error,
            );
          }
        } on SocketException {
          // Stop processing until connectivity returns
          _notifyStatus(
            message:
                'Network unavailable. Pending submissions will retry once you are back online.',
            messageType: SubmissionQueueMessageType.info,
          );
          break;
        }
      }
      if (deliveredAny) {
        _notifyStatus(
          lastSyncedAt: DateTime.now(),
          message: _queue.isEmpty
              ? 'All pending submissions have been delivered.'
              : 'Pending submissions synced. ${_queue.length} remaining.',
          messageType: SubmissionQueueMessageType.success,
        );
      }
    } finally {
      _isProcessing = false;
      _notifyStatus(isSyncing: false);
    }
  }

  Future<void> _enqueue(ResultSubmissionPayload payload) async {
    _queue.add(payload);
    _persistQueue();
    _notifyStatus();
  }

  Future<http.Response> _sendToApi(ResultSubmissionPayload payload) async {
    String? base64Photo;
    String? photoName;
    if (payload.photoPath != null) {
      final file = File(payload.photoPath!);
      if (await file.exists()) {
        final bytes = await file.readAsBytes();
        base64Photo = base64Encode(bytes);
        photoName = file.uri.pathSegments.isNotEmpty
            ? file.uri.pathSegments.last
            : 'result.jpg';
      }
    }

    final response = await apiClient.post(
      'elections/submissions/polling-station/',
      body: payload.toRequestBody(
        photoBase64: base64Photo,
        photoName: photoName,
      ),
      headers: {
        'X-Idempotency-Key': payload.id,
      },
    );

    return response;
  }

  bool _isSuccess(int statusCode) {
    return statusCode >= 200 && statusCode < 300;
  }

  String? _extractError(String body) {
    if (body.isEmpty) {
      return null;
    }
    try {
      final decoded = jsonDecode(body) as Map<String, dynamic>;
      if (decoded['errors'] is Map<String, dynamic>) {
        final errors = decoded['errors'] as Map<String, dynamic>;
        final messages = errors.values
            .expand((value) => value is List ? value : [value])
            .whereType<String>()
            .toList();
        if (messages.isNotEmpty) {
          return messages.join('\n');
        }
      }
      return decoded['detail'] as String? ?? decoded['message'] as String?;
    } catch (_) {
      return null;
    }
  }

  void _restoreQueue() {
    final stored = sharedPreferences.getStringList(_storageKey) ?? [];
    _queue
      ..clear()
      ..addAll(stored
          .map((entry) => ResultSubmissionPayload.decode(entry))
          .toList());
    _notifyStatus();
  }

  void _persistQueue() {
    final encoded = _queue.map((entry) => entry.encode()).toList();
    sharedPreferences.setStringList(_storageKey, encoded);
  }

  void _notifyStatus({
    bool? isSyncing,
    DateTime? lastSyncedAt,
    String? message,
    SubmissionQueueMessageType? messageType,
  }) {
    if (lastSyncedAt != null) {
      _lastSyncedAt = lastSyncedAt;
    }
    if (message != null) {
      _lastMessage = message;
      _lastMessageType = messageType ?? SubmissionQueueMessageType.info;
    }

    statusNotifier.value = SubmissionQueueStatus(
      pendingCount: _queue.length,
      isSyncing: isSyncing ?? statusNotifier.value.isSyncing,
      lastSyncedAt: _lastSyncedAt,
      lastMessage: _lastMessage,
      lastMessageType: _lastMessageType,
    );
  }
}
