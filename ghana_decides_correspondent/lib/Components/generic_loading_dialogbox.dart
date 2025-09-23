import 'package:flutter/material.dart';
import 'package:ghd_correspondent/constants.dart';

class LoadingDialogBox extends StatefulWidget {
  final String text;

  const LoadingDialogBox({Key? key, required this.text}) : super(key: key);

  @override
  State<LoadingDialogBox> createState() => _LoadingDialogBoxState();
}

class _LoadingDialogBoxState extends State<LoadingDialogBox>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: 1),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
          image: DecorationImage(
            image: AssetImage("assets/images/ghana_back.png"),
            fit: BoxFit.cover,
          ),
        ),
        child: Center(
          child: Material(
            color: Colors.transparent,
            child: Container(
              width: MediaQuery.of(context).size.width,
              height: 322,
              margin: EdgeInsets.all(20),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20.0),
                color: Colors.white.withOpacity(0.3),
              ),
              padding: EdgeInsets.all(20.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  RotationTransition(
                    turns: _controller,
                    child: Image.asset(
                      "assets/icons/loading.png",
                      color: ghPrimary,

                    ),
                  ),
                  SizedBox(height: 20),
                  Text(
                    widget.text,
                    style: TextStyle(fontSize: 15),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
