import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:image_picker/image_picker.dart';
import 'package:intl/intl.dart';

import '../Auth/Login/models/sign_in_model.dart';
import '../Components/generic_error_dialog_box.dart';
import '../Components/generic_loading_dialogbox.dart';
import '../Components/generic_success_dialog_box.dart';
import '../Components/photos/select_photo_options_screen.dart';
import '../constants.dart';
import '../models/result_submission.dart';
import '../services/app_services.dart';
import '../services/election_service.dart';
import '../services/submission_queue_service.dart';

class CorrespondentSubmissionScreen extends StatefulWidget {
  const CorrespondentSubmissionScreen({super.key});

  @override
  State<CorrespondentSubmissionScreen> createState() =>
      _CorrespondentSubmissionScreenState();
}

class _CorrespondentSubmissionScreenState
    extends State<CorrespondentSubmissionScreen> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _turnoutController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  final Map<String, TextEditingController> _presidentialControllers = {};
  final Map<String, TextEditingController> _parliamentaryControllers = {};

  late final SubmissionQueueService _queueService;

  SignInData? _sessionData;
  UserAssignment? _selectedAssignment;
  ElectionSummary? _election;
  List<CandidateOption> _presidentialCandidates = [];
  List<CandidateOption> _parliamentaryCandidates = [];
  bool _loadingSession = true;
  bool _loadingCandidates = false;
  bool _submitting = false;
  File? _photo;

  @override
  void initState() {
    super.initState();
    _queueService = AppServices.instance.submissionQueueService;
    _loadSession();
  }

  @override
  void dispose() {
    _turnoutController.dispose();
    _notesController.dispose();
    for (final controller in _presidentialControllers.values) {
      controller.dispose();
    }
    for (final controller in _parliamentaryControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  Future<void> _loadSession() async {
    final prefs = AppServices.instance.sharedPreferences;
    final raw = prefs.getString('user_data');
    if (raw == null) {
      setState(() {
        _loadingSession = false;
      });
      return;
    }
    try {
      final decoded = json.decode(raw) as Map<String, dynamic>;
      final data = SignInData.maybeFromJson(decoded);
      setState(() {
        _sessionData = data;
        _election = data?.defaultElection;
        _selectedAssignment = data?.assignments.isNotEmpty == true
            ? data!.assignments.first
            : null;
        _loadingSession = false;
      });
      await _loadCandidates();
    } catch (error) {
      setState(() {
        _loadingSession = false;
      });
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
          context: context,
          builder: (context) => ErrorDialogBox(
            text: 'Unable to read stored correspondent session. Please sign in again.',
          ),
        );
      });
    }
  }

  Future<void> _loadCandidates() async {
    final assignment = _selectedAssignment;
    final election = _election;
    if (assignment == null || election == null) {
      return;
    }

    setState(() {
      _loadingCandidates = true;
      _presidentialCandidates = [];
      _parliamentaryCandidates = [];
      _clearCandidateControllers();
    });

    try {
      final service = ElectionDataService(AppServices.instance.apiClient);
      final pres = await service.fetchPresidentialCandidates(election.electionId);
      final parl = await service.fetchParliamentaryCandidates(
        election.electionId,
        assignment.constituencyId,
      );

      setState(() {
        _presidentialCandidates = pres;
        _parliamentaryCandidates = parl;
        _initializeControllers();
      });
    } catch (error) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
          context: context,
          builder: (context) => ErrorDialogBox(
            text: 'Failed to load candidates: ${error.toString()}',
          ),
        );
      });
    } finally {
      setState(() {
        _loadingCandidates = false;
      });
    }
  }

  void _initializeControllers() {
    for (final controller in _presidentialControllers.values) {
      controller.dispose();
    }
    for (final controller in _parliamentaryControllers.values) {
      controller.dispose();
    }
    _presidentialControllers
      ..clear()
      ..addEntries(
        _presidentialCandidates.map(
          (candidate) => MapEntry(
            candidate.id,
            TextEditingController(),
          ),
        ),
      );
    _parliamentaryControllers
      ..clear()
      ..addEntries(
        _parliamentaryCandidates.map(
          (candidate) => MapEntry(
            candidate.id,
            TextEditingController(),
          ),
        ),
      );
  }

  void _clearCandidateControllers() {
    for (final controller in _presidentialControllers.values) {
      controller.clear();
    }
    for (final controller in _parliamentaryControllers.values) {
      controller.clear();
    }
  }

  Future<void> _pickPhoto() async {
    await showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return SelectPhotoOptionsScreen(
          onTap: (source) async {
            Navigator.of(context).pop();
            final picker = ImagePicker();
            final result = await picker.pickImage(source: source, imageQuality: 70);
            if (result != null) {
              setState(() {
                _photo = File(result.path);
              });
            }
          },
        );
      },
    );
  }

  Future<void> _submit() async {
    final assignment = _selectedAssignment;
    final election = _election;
    if (assignment == null || election == null) {
      showDialog(
        context: context,
        builder: (context) => ErrorDialogBox(
          text: 'Select a polling station before submitting results.',
        ),
      );
      return;
    }

    if (!(_formKey.currentState?.validate() ?? false)) {
      return;
    }

    final presidentialEntries = _collectVotes(_presidentialControllers);
    final parliamentaryEntries = _collectVotes(_parliamentaryControllers);

    if (presidentialEntries.isEmpty && parliamentaryEntries.isEmpty) {
      showDialog(
        context: context,
        builder: (context) => ErrorDialogBox(
          text: 'Enter at least one tally before submitting results.',
        ),
      );
      return;
    }

    final turnoutText = _turnoutController.text.trim();
    final turnout = turnoutText.isEmpty ? null : int.tryParse(turnoutText);
    final notes = _notesController.text.trim().isEmpty ? null : _notesController.text.trim();

    final payload = ResultSubmissionPayload(
      id: _queueService.generateSubmissionId(),
      electionId: election.electionId,
      pollingStationId: assignment.pollingStationId,
      presidentialResults: presidentialEntries,
      parliamentaryResults: parliamentaryEntries,
      turnout: turnout,
      notes: notes,
      photoPath: _photo?.path,
    );

    setState(() {
      _submitting = true;
    });

    try {
      final result = await _queueService.submit(payload);
      setState(() {
        _submitting = false;
        _clearCandidateControllers();
        _turnoutController.clear();
        _notesController.clear();
        _photo = null;
      });

      if (result.state == SubmissionDeliveryState.failed) {
        showDialog(
          context: context,
          builder: (context) => ErrorDialogBox(text: result.message),
        );
      } else {
        showDialog(
          context: context,
          builder: (context) => SuccessDialogBox(text: result.message),
        );
      }
    } catch (error) {
      setState(() {
        _submitting = false;
      });
      showDialog(
        context: context,
        builder: (context) => ErrorDialogBox(
          text: 'Submission failed: ${error.toString()}',
        ),
      );
    }
  }

  List<ResultEntry> _collectVotes(Map<String, TextEditingController> controllers) {
    final entries = <ResultEntry>[];
    controllers.forEach((candidateId, controller) {
      final text = controller.text.trim();
      if (text.isEmpty) {
        return;
      }
      final votes = int.tryParse(text);
      if (votes != null) {
        entries.add(ResultEntry(candidateId: candidateId, votes: votes));
      }
    });
    return entries;
  }

  @override
  Widget build(BuildContext context) {
    if (_loadingSession) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (_sessionData == null || _selectedAssignment == null || _election == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Submit Results'),
        ),
        body: const Center(
          child: Text('No polling station assignments found for this account.'),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Submit Polling Station Results'),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _buildAssignmentPicker(),
            const SizedBox(height: 12),
            _buildQueueStatusCard(),
            const SizedBox(height: 16),
            if (_loadingCandidates)
              const LoadingDialogBox(text: 'Loading candidates...')
            else
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildCandidateSection(
                    title: 'Presidential tallies',
                    candidates: _presidentialCandidates,
                    controllers: _presidentialControllers,
                  ),
                  const SizedBox(height: 24),
                  _buildCandidateSection(
                    title: 'Parliamentary tallies',
                    candidates: _parliamentaryCandidates,
                    controllers: _parliamentaryControllers,
                  ),
                ],
              ),
            const SizedBox(height: 24),
            _buildTurnoutField(),
            const SizedBox(height: 16),
            _buildNotesField(),
            const SizedBox(height: 16),
            _buildPhotoPicker(),
            const SizedBox(height: 24),
            _buildSubmitButton(),
          ],
        ),
      ),
    );
  }

  Widget _buildAssignmentPicker() {
    final assignments = _sessionData?.assignments ?? [];
    return DropdownButtonFormField<UserAssignment>(
      value: _selectedAssignment,
      decoration: const InputDecoration(
        labelText: 'Polling station',
        border: OutlineInputBorder(),
      ),
      items: assignments
          .map(
            (assignment) => DropdownMenuItem<UserAssignment>(
              value: assignment,
              child: Text(assignment.pollingStationName),
            ),
          )
          .toList(),
      onChanged: (value) {
        setState(() {
          _selectedAssignment = value;
        });
        _loadCandidates();
      },
    );
  }

  Widget _buildQueueStatusCard() {
    return ValueListenableBuilder<SubmissionQueueStatus>(
      valueListenable: _queueService.statusNotifier,
      builder: (context, status, _) {
        final theme = Theme.of(context);
        final pending = status.pendingCount;
        final isSyncing = status.isSyncing;
        final lastSynced = status.lastSyncedAt;
        final message = status.lastMessage;
        final color = _statusColor(theme, status.lastMessageType);

        return Card(
          elevation: 0,
          color: theme.colorScheme.surfaceVariant,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Icon(
                      isSyncing ? Icons.sync : Icons.cloud_done_outlined,
                      color: color,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      isSyncing
                          ? 'Syncing submissions…'
                          : 'Submission sync status',
                      style: theme.textTheme.titleMedium,
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  pending == 0
                      ? 'No pending submissions in the offline queue.'
                      : '$pending submission${pending == 1 ? '' : 's'} waiting to sync.',
                  style: theme.textTheme.bodyMedium,
                ),
                if (lastSynced != null) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Last successful sync: ${_formatTimestamp(lastSynced)}',
                    style: theme.textTheme.bodySmall,
                  ),
                ],
                if (message != null && message.isNotEmpty) ...[
                  const SizedBox(height: 8),
                  Text(
                    message,
                    style:
                        theme.textTheme.bodyMedium?.copyWith(color: color),
                  ),
                ],
                if (pending > 0)
                  Align(
                    alignment: Alignment.centerLeft,
                    child: Padding(
                      padding: const EdgeInsets.only(top: 12),
                      child: OutlinedButton.icon(
                        onPressed: isSyncing ? null : _handleSyncNow,
                        icon: const Icon(Icons.sync),
                        label:
                            Text(isSyncing ? 'Syncing…' : 'Sync now'),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Color _statusColor(ThemeData theme, SubmissionQueueMessageType type) {
    switch (type) {
      case SubmissionQueueMessageType.success:
        return Colors.green.shade700;
      case SubmissionQueueMessageType.error:
        return theme.colorScheme.error;
      case SubmissionQueueMessageType.info:
      default:
        return theme.colorScheme.primary;
    }
  }

  String _formatTimestamp(DateTime timestamp) {
    final local = timestamp.toLocal();
    final formatter = DateFormat('MMM d, h:mm a');
    return formatter.format(local);
  }

  Future<void> _handleSyncNow() async {
    final messenger = ScaffoldMessenger.of(context);
    await _queueService.flushQueue();
    final status = _queueService.statusNotifier.value;
    final message = status.lastMessage ??
        (status.pendingCount == 0
            ? 'All submissions are synced.'
            : '${status.pendingCount} submission${status.pendingCount == 1 ? '' : 's'} still queued.');

    messenger.showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Widget _buildCandidateSection({
    required String title,
    required List<CandidateOption> candidates,
    required Map<String, TextEditingController> controllers,
  }) {
    if (candidates.isEmpty) {
      return Text('$title (none available)');
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        ...candidates.map((candidate) {
          final controller = controllers[candidate.id]!;
          return Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: TextFormField(
              controller: controller,
              keyboardType: TextInputType.number,
              inputFormatters: [FilteringTextInputFormatter.digitsOnly],
              decoration: InputDecoration(
                labelText: candidate.displayName,
                helperText: candidate.partyName,
                border: const OutlineInputBorder(),
              ),
            ),
          );
        }).toList(),
      ],
    );
  }

  Widget _buildTurnoutField() {
    return TextFormField(
      controller: _turnoutController,
      keyboardType: TextInputType.number,
      inputFormatters: [FilteringTextInputFormatter.digitsOnly],
      decoration: const InputDecoration(
        labelText: 'Reported turnout (optional)',
        border: OutlineInputBorder(),
      ),
    );
  }

  Widget _buildNotesField() {
    return TextFormField(
      controller: _notesController,
      maxLines: 3,
      decoration: const InputDecoration(
        labelText: 'Notes (optional)',
        border: OutlineInputBorder(),
      ),
    );
  }

  Widget _buildPhotoPicker() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Result photo (optional)',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
        const SizedBox(height: 8),
        if (_photo != null)
          Stack(
            alignment: Alignment.topRight,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.file(
                  _photo!,
                  height: 160,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.close),
                color: Colors.red,
                onPressed: () {
                  setState(() {
                    _photo = null;
                  });
                },
              ),
            ],
          )
        else
          OutlinedButton.icon(
            onPressed: _pickPhoto,
            icon: const Icon(Icons.camera_alt_outlined),
            label: const Text('Attach photo'),
          ),
      ],
    );
  }

  Widget _buildSubmitButton() {
    return ElevatedButton(
      onPressed: _submitting ? null : _submit,
      child: _submitting
          ? const SizedBox(
              height: 20,
              width: 20,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
          : const Text('Submit results'),
    );
  }
}
