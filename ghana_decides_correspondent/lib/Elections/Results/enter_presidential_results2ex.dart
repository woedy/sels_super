import 'dart:convert';


import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:ghd_correspondent/Components/generic_loading_dialogbox.dart';
import 'package:ghd_correspondent/Components/keyboard_utils.dart';
import 'package:ghd_correspondent/Elections/Results/models/election_presidential_candidate_model.dart';
import 'package:ghd_correspondent/Elections/upload_election_result.dart';
import 'package:ghd_correspondent/constants.dart';
import 'package:http/http.dart' as http;


Future<ElectionPresidentialCandidatesModel> get_election_presidential_candidates() async {

  var token = await getApiPref();

  final response = await http.get(
    Uri.parse(hostName + "elections/get-all-election-presidential-candidates/"),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Accept': 'application/json',
      'Authorization': 'Token '  + "4487f5a04fbcbbc32a1bc71788a2142aff324a24"
    },
  );


  if (response.statusCode == 200) {
    print(jsonDecode(response.body));
    final result = json.decode(response.body);
    if (result != null) {


    }
    return ElectionPresidentialCandidatesModel.fromJson(jsonDecode(response.body));
  } else if (response.statusCode == 422) {
    print(jsonDecode(response.body));
    return ElectionPresidentialCandidatesModel.fromJson(jsonDecode(response.body));
  }  else if (response.statusCode == 403) {
    print(jsonDecode(response.body));
    return ElectionPresidentialCandidatesModel.fromJson(jsonDecode(response.body));
  }   else if (response.statusCode == 400) {
    print(jsonDecode(response.body));
    return ElectionPresidentialCandidatesModel.fromJson(jsonDecode(response.body));
  }  else {

    throw Exception('Failed to load data');
  }
}


class EnterPresidentialResultScreen2 extends StatefulWidget {
  final data;
  const EnterPresidentialResultScreen2({super.key, required this.data});

  @override
  State<EnterPresidentialResultScreen2> createState() => _EnterPresidentialResultScreen2State();
}

class _EnterPresidentialResultScreen2State extends State<EnterPresidentialResultScreen2> {
  Map<int, GlobalKey<FormState>> formKeys = {};

  Map<int, TextEditingController> textControllers = {}; // Add this line



  Future<ElectionPresidentialCandidatesModel>? _futureGetPresidentialCandidate;

  Map<String, String> candidateInputs = {};



  @override
  void initState() {
    super.initState();
    _futureGetPresidentialCandidate = get_election_presidential_candidates();
/*    for (int i = 0; i < _presidential_candidates.length; i++) {
      formKeys[i] = GlobalKey<FormState>();
    }*/
  }


  @override
  Widget build(BuildContext context) {
    return (_futureGetPresidentialCandidate == null) ? buildColumn() : buildFutureBuilder();
  }




  buildColumn(){
    return Scaffold(
      body: Container(),
    );
  }



  FutureBuilder<ElectionPresidentialCandidatesModel> buildFutureBuilder() {
    return FutureBuilder<ElectionPresidentialCandidatesModel>(
        future: _futureGetPresidentialCandidate,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return LoadingDialogBox(text: 'Please Wait..',);
          }
          else if(snapshot.hasData) {

            var data = snapshot.data!;
            var _presidential_candidates = data.data;

            if(data.message == "Successful") {


              for (int i = 0; i < _presidential_candidates!.length; i++) {
                formKeys[i] = GlobalKey<FormState>();

                // Check if text controller already exists before initializing
                if (!textControllers.containsKey(i)) {
                  textControllers[i] = TextEditingController(); // Provide initial value
                }
              }

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
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    InkWell(
                                        onTap: (){
                                          Navigator.of(context).pop();
                                        },
                                        child: Icon(Icons.arrow_back, size: 35,)),

                                  ],
                                )
                            ),


                            Text(
                              "Enter Presidential Results",
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                  fontSize: 25,
                                  fontWeight: FontWeight.w600),
                            ),

                            SizedBox(
                              height: 5,
                            ),
                            Text(
                              widget.data['polling_station_name'],
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 23,),
                            ),

                            SizedBox(
                              height: 15,
                            ),



                            Expanded(
                                child: ListView.builder(
                                  itemCount: _presidential_candidates!.length,
                                  itemBuilder: (context, index){
                                    return Form(
                                      key: formKeys[index],

                                      child: Padding(
                                        padding: const EdgeInsets.all(8.0),
                                        child: Row(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          children: [
                                            Container(
                                              height: 120,
                                              width: 120,
                                              decoration: BoxDecoration(
                                                  color: Colors.transparent,
                                                  borderRadius: BorderRadius.circular(15),
                                                  image: DecorationImage(
                                                      image: NetworkImage(hostNameMedia + _presidential_candidates[index].candidate!.photo!.toString()),
                                                      fit: BoxFit.cover
                                                  )
                                              ),
                                            ),
                                            Container(
                                              height: 60,
                                              width: 60,
                                              margin: EdgeInsets.all(10),
                                              decoration: BoxDecoration(
                                                  color: Colors.red,
                                                  borderRadius: BorderRadius.circular(5),
                                                  image: DecorationImage(
                                                      image: NetworkImage(hostNameMedia + _presidential_candidates[index].candidate!.party!.partyLogo!.toString()),
                                                      fit: BoxFit.cover
                                                  )
                                              ),
                                            ),
                                            Expanded(
                                              child: Container(
                                                height: 120,
                                                width: 200,
                                                padding: EdgeInsets.all(10),
                                                decoration: BoxDecoration(
                                                  color: Colors.black.withOpacity(0.2),
                                                  borderRadius: BorderRadius.circular(10),
                                                  boxShadow: [
                                                    BoxShadow(
                                                      color: Colors.black.withOpacity(0.1),
                                                      spreadRadius: 1,
                                                      blurRadius: 2,
                                                      offset: Offset(0, 2), // changes position of shadow
                                                    ),
                                                  ],
                                                ),
                                                child: Center(
                                                  child: TextFormField(
                                                    controller: textControllers[index],
                                                    style: TextStyle(
                                                      color: Colors.white,
                                                      fontSize: 35,
                                                      fontWeight: FontWeight.w800,
                                                    ),
                                                    decoration: InputDecoration(
                                                      hintText: '0', // You can remove this if not needed
                                                      hintStyle: TextStyle(
                                                        color: Colors.white.withOpacity(0.4),
                                                        fontWeight: FontWeight.w800,
                                                      ),
                                                      border: InputBorder.none,
                                                    ),
                                                    inputFormatters: [
                                                      LengthLimitingTextInputFormatter(10), // Limit input to 10 digits
                                                      FilteringTextInputFormatter.digitsOnly, // Allow only digits
                                                    ],
                                                    /*          onChanged: (value) {
                                                      setState(() {
                                                        candidateInputs[_presidential_candidates[index].electionPrezId.toString()] = textControllers[index]!.text;
                                                        //candidateInputs[_presidential_candidates[index].electionPrezId.toString()] = value;

                                                      });
                                                    },
*/
                                                    validator: (value) {
                                                      if (value!.isEmpty) {
                                                        return 'Result required';
                                                      }
                                                    },
                                                    // Other properties remain the same
                                                  ),
                                                ),
                                              ),
                                            ),

                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                )

                            ),

                            InkWell(
                              onTap: () {
                                // Navigator.push(context, MaterialPageRoute(builder: (context) => UploadElectionResult(data: {})));
/*


                                if (formKeys.values.every((formKey) => formKey.currentState!.validate())) {
                                  formKeys.forEach((index, formKey) {
                                    formKey.currentState!.save();
                                    // Handle saving data for each form

                                    KeyboardUtil.hideKeyboard(context);

                                    List<Map<String, dynamic>> results = [];

                                    candidateInputs.forEach((key, value) {
                                      results.add({
                                        'election_prez_id': key,
                                        'votes': value,
                                      });
                                    });

                                    var _data = {
                                      "polling_station_id": widget.data["polling_station_id"],
                                      "ballot": results,
                                    };


                                    print(_data);
                                  });
                                }

*/


                                handleFormSubmit(_presidential_candidates);


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

                            SizedBox(
                              height: 10 ,
                            )


                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }

          }

          return LoadingDialogBox(text: 'Please Wait..',);


        }
    );
  }


// Modify the handleFormSubmit method to update the candidateInputs map
  void handleFormSubmit(_presidential_candidates) {
    if (formKeys.values.every((formKey) => formKey.currentState!.validate())) {
      formKeys.forEach((index, formKey) {
        formKey.currentState!.save();

        List<Map<String, dynamic>> results = [];
        textControllers.forEach((key, controller) {
          results.add({
            'election_prez_id': _presidential_candidates[index].electionParlId.toString(),
            'votes': controller.text,
          });
        });

        var _data = {
          "polling_station_id": widget.data["polling_station_id"],
          "ballot": results,
        };

        print(_data);
      });
    }
  }


  // Use dispose to dispose of text controllers
  @override
  void dispose() {
    textControllers.values.forEach((controller) => controller.dispose());
    super.dispose();
  }

}
