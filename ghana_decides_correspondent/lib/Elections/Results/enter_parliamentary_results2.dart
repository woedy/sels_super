import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Components/generic_error_dialog_box.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/generic_success_dialog_box.dart';
import 'package:ghd_correspondent/Components/keyboard_utils.dart';
import 'package:ghd_correspondent/Elections/Results/models/election_parliamentary_candidate_model.dart';
import 'package:ghd_correspondent/Elections/upload_election_result.dart';
import 'package:ghd_correspondent/Homepage/homepage_screen.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;

Future<ElectionParliamentaryCandidatesModel>
    get_election_parliamentary_candidates(constituency_id) async {
  print("###################");
  print("###################");
  print("###################");
  print(constituency_id);

  var token = await getApiPref();
  final response = await http.get(
    Uri.parse(hostName +
        "elections/get-all-election-parliamentary-candidates/?constituency_id=${constituency_id}"),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
      'Authorization': 'Token ' + "4487f5a04fbcbbc32a1bc71788a2142aff324a24"
    },
  );

  if (response.statusCode == 200) {
    print(jsonDecode(response.body));
    final result = json.decode(response.body);
    if (result != null) {}
    return ElectionParliamentaryCandidatesModel.fromJson(
        jsonDecode(response.body));
  } else if (response.statusCode == 422) {
    print(jsonDecode(response.body));
    return ElectionParliamentaryCandidatesModel.fromJson(
        jsonDecode(response.body));
  } else if (response.statusCode == 403) {
    print(jsonDecode(response.body));
    return ElectionParliamentaryCandidatesModel.fromJson(
        jsonDecode(response.body));
  } else if (response.statusCode == 400) {
    print(jsonDecode(response.body));
    return ElectionParliamentaryCandidatesModel.fromJson(
        jsonDecode(response.body));
  } else {
    throw Exception('Failed to load data');
  }
}

class EnterParliamentaryResultScreen2 extends StatefulWidget {
  final data;
  const EnterParliamentaryResultScreen2({super.key, required this.data});

  @override
  State<EnterParliamentaryResultScreen2> createState() =>
      _EnterParliamentaryResultScreen2State();
}

class _EnterParliamentaryResultScreen2State
    extends State<EnterParliamentaryResultScreen2> {
  List<TextEditingController> textControllers = [];
  GlobalKey<FormState> formKey = GlobalKey<FormState>();
  late Future<ElectionParliamentaryCandidatesModel>
      _futureGetParliamentaryCandidate;

  @override
  void initState() {
    super.initState();
    _futureGetParliamentaryCandidate =
        get_election_parliamentary_candidates(widget.data["constituency_id"]);
    _futureGetParliamentaryCandidate.then((value) {
      var data = value.data;
      if (data != null) {
        setState(() {
          textControllers =
              List.generate(data.length, (_) => TextEditingController());
        });
      }
    });
  }

  @override
  void dispose() {
    textControllers.forEach((controller) => controller.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<ElectionParliamentaryCandidatesModel>(
      future: _futureGetParliamentaryCandidate,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return LoadingDialogBox(text: 'Please Wait..');
        } else if (snapshot.hasData) {
          var data = snapshot.data!;
          var _parliamentaryCandidates = data.data;

          if (data.message == "Successful") {
            return Scaffold(
              body: Container(
                height: MediaQuery.of(context).size.height,
                width: MediaQuery.of(context).size.width,
                decoration: BoxDecoration(
                  image: DecorationImage(
                    image: AssetImage("assets/images/ghana_back.png"),
                    fit: BoxFit.cover,
                  ),
                ),
                child: SafeArea(
                  child: Stack(
                    children: [
                      Column(
                        children: [
                          Container(
                            padding: EdgeInsets.all(15),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                InkWell(
                                  onTap: () {
                                    Navigator.of(context).pop();
                                  },
                                  child: Icon(Icons.arrow_back, size: 35),
                                ),
                              ],
                            ),
                          ),
                          Text(
                            "Enter Parliamentary Results",
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 25,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          SizedBox(height: 5),
                          Text(
                            widget.data['polling_station_name'],
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 23),
                          ),
                          SizedBox(height: 15),
                          Expanded(
                            child: Form(
                              key: formKey,
                              child: ListView.builder(
                                itemCount: _parliamentaryCandidates!.length,
                                itemBuilder: (context, index) {
                                  return Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        Container(
                                          height: 120,
                                          width: 120,
                                          decoration: BoxDecoration(
                                            color: Colors.transparent,
                                            borderRadius:
                                                BorderRadius.circular(15),
                                            image: DecorationImage(
                                              image: NetworkImage(
                                                  hostNameMedia +
                                                      _parliamentaryCandidates[
                                                              index]
                                                          .candidate!
                                                          .photo!
                                                          .toString()),
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                        ),
                                        Container(
                                          height: 60,
                                          width: 60,
                                          margin: EdgeInsets.all(10),
                                          decoration: BoxDecoration(
                                            color: Colors.red,
                                            borderRadius:
                                                BorderRadius.circular(5),
                                            image: DecorationImage(
                                              image: NetworkImage(
                                                  hostNameMedia +
                                                      _parliamentaryCandidates[
                                                              index]
                                                          .candidate!
                                                          .party!
                                                          .partyLogo!
                                                          .toString()),
                                              fit: BoxFit.cover,
                                            ),
                                          ),
                                        ),
                                        Expanded(
                                          child: Container(
                                            height: 120,
                                            width: 200,
                                            padding: EdgeInsets.all(10),
                                            decoration: BoxDecoration(
                                              color:
                                                  Colors.black.withOpacity(0.2),
                                              borderRadius:
                                                  BorderRadius.circular(10),
                                              boxShadow: [
                                                BoxShadow(
                                                  color: Colors.black
                                                      .withOpacity(0.1),
                                                  spreadRadius: 1,
                                                  blurRadius: 2,
                                                  offset: Offset(0, 2),
                                                ),
                                              ],
                                            ),
                                            child: TextFormField(
                                              controller:
                                                  textControllers[index],
                                              style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 35,
                                                fontWeight: FontWeight.w800,
                                              ),
                                              decoration: InputDecoration(
                                                hintText: '0',
                                                hintStyle: TextStyle(
                                                  color: Colors.white
                                                      .withOpacity(0.4),
                                                  fontWeight: FontWeight.w800,
                                                ),
                                                border: InputBorder.none,
                                              ),
                                              keyboardType:
                                                  TextInputType.number,
                                              inputFormatters: [
                                                LengthLimitingTextInputFormatter(
                                                    10),
                                                FilteringTextInputFormatter
                                                    .digitsOnly,
                                              ],
                                              validator: (value) {
                                                if (value!.isEmpty) {
                                                  return 'Result required';
                                                }
                                                return null;
                                              },
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                            ),
                          ),
                          InkWell(
                            onTap: () async {
                              if (formKey.currentState!.validate()) {
                                formKey.currentState!.save();

                                showDialog(
                                  context: context,
                                  builder: (BuildContext context) {
                                    return Center(
                                      child: Material(
                                        color: Colors.transparent,
                                        child: Container(
                                          width:
                                              MediaQuery.of(context).size.width,
                                          height: 422,
                                          margin: EdgeInsets.all(20),
                                          decoration: BoxDecoration(
                                            borderRadius: BorderRadius.circular(
                                                20.0), // Border radius of 30
                                            color: Colors.white,
                                          ),
                                          padding: EdgeInsets.all(20.0),
                                          child: Column(
                                            crossAxisAlignment:
                                                CrossAxisAlignment.center,
                                            mainAxisAlignment:
                                                MainAxisAlignment.center,
                                            children: [
                                              Icon(
                                                Icons.warning,
                                                color: Colors.yellow,
                                                size: 50,
                                              ),
                                              SizedBox(height: 10), // Spacer
                                              Text(
                                                'WARNING.!!',
                                                textAlign: TextAlign.center,
                                                style: TextStyle(
                                                    fontSize: 15,
                                                    color: Colors.black,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ), // Text

                                              SizedBox(height: 20), // Spacer
                                              Text(
                                                'You are about to submit election results for this polling station. \n\nBe sure the results are accurate before proceeding. \n\nUpdating submitted results will require audit.',
                                                textAlign: TextAlign.start,
                                                style: TextStyle(
                                                    fontSize: 13,
                                                    color: Colors.black),
                                              ),
                                              SizedBox(height: 20), //
                                              Row(
                                                children: [
                                                  Expanded(
                                                    flex: 2,
                                                    child: InkWell(
                                                      onTap: () {
                                                        submit_vote(context,
                                                            _parliamentaryCandidates);
                                                      },
                                                      child: Container(
                                                        padding:
                                                            EdgeInsets.all(10),
                                                        margin: EdgeInsets
                                                            .symmetric(
                                                                horizontal: 15),
                                                        //height: 40,
                                                        width: MediaQuery.of(
                                                                context)
                                                            .size
                                                            .width,
                                                        decoration:
                                                            BoxDecoration(
                                                          color: Colors.green,
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(7),
                                                        ),
                                                        child: Center(
                                                          child: Text(
                                                            "Submit",
                                                            style: TextStyle(
                                                                color: Colors
                                                                    .white),
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                  Expanded(
                                                    child: InkWell(
                                                      onTap: () {
                                                        Navigator.of(context)
                                                            .pop();
                                                      },
                                                      child: Container(
                                                        padding:
                                                            EdgeInsets.all(10),
                                                        margin: EdgeInsets
                                                            .symmetric(
                                                                horizontal: 15),
                                                        //height: 40,
                                                        width: MediaQuery.of(
                                                                context)
                                                            .size
                                                            .width,
                                                        decoration:
                                                            BoxDecoration(
                                                          color: Colors.red,
                                                          borderRadius:
                                                              BorderRadius
                                                                  .circular(7),
                                                        ),
                                                        child: Center(
                                                          child: Text(
                                                            "Back",
                                                            style: TextStyle(
                                                                color: Colors
                                                                    .white),
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ],
                                              ),
                                            ],
                                          ),
                                        ),
                                      ),
                                    );
                                  },
                                );
                              }
                            },
                            child: Container(
                              padding: EdgeInsets.all(20),
                              margin: EdgeInsets.symmetric(horizontal: 15),
                              height: 59,
                              width: MediaQuery.of(context).size.width,
                              decoration: BoxDecoration(
                                color: Colors.black,
                                borderRadius: BorderRadius.circular(7),
                              ),
                              child: Center(
                                child: Text(
                                  "Continue",
                                  style: TextStyle(color: Colors.white),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 10),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            );
          }
        }
        return LoadingDialogBox(text: 'Please Wait..');
      },
    );
  }

  void submit_vote(BuildContext context, _parliamentaryCandidates) async {
    List<Map<String, dynamic>> results = [];

    for (int i = 0; i < textControllers.length; i++) {
      results.add({
        'election_parl_id':
            _parliamentaryCandidates[i].electionParlId.toString(),
        'votes': textControllers[i].text.toString(),
      });
    }
    var _data = {
      "polling_station_id": widget.data["polling_station_id"],
      "ballot": results,
    };

    // Show loading dialog
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return LoadingDialogBox(text: 'Please Wait..');
      },
    );

    try {
      var response = await http.post(
        Uri.parse(hostName + "elections/add-parliamentary-vote/"),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': 'Token ' + "4487f5a04fbcbbc32a1bc71788a2142aff324a24"
        },
        body: jsonEncode(_data),
      );

      Navigator.of(context).pop(); // Dismiss loading dialog

      if (response.statusCode == 200) {
        // Request successful, navigate to HomeScreen and clear stack
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (BuildContext context) => HomeScreen()),
          (Route<dynamic> route) => false,
        );

        // Show success dialog
        showDialog(
          context: context,
          builder: (BuildContext context) {
            return SuccessDialogBox(text: 'Results Submitted Sucessfully!');
          },
        );
      } else {
        print(response.body);
        // Request failed, display dialog box with error message

        Map<String, dynamic> errorResponse = jsonDecode(response.body);
        String errorMessage = errorResponse['message'];
        Map<String, dynamic> errors = errorResponse['errors'];

        // Prepare error messages to display
        StringBuffer errorMessages = StringBuffer();
        errors.forEach((key, value) {
          for (var msg in value) {
            errorMessages.writeln('$msg');
          }
        });

        showDialog(
          context: context,
          builder: (BuildContext context) {
            return ErrorDialogBox(text: '$errorMessages');
          },
        );
      }
    } catch (e) {
      print(e.toString());
      // Handle other exceptions if necessary
    }
  }
}
