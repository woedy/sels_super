import 'dart:ui';

import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:ghd_correspondent/Elections/enter_results.dart';
import 'package:ghd_correspondent/Elections/submitted_results.dart';
import 'package:ghd_correspondent/UserProfile/UserProfileScreen.dart';
import 'package:ghd_correspondent/constants.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {

  PageController _pageController = PageController(initialPage: 0);
  int currentPage = 0;

  List<BarChartGroupData> barChartData = [
    BarChartGroupData(
      x: 1,
      barRods: [
        BarChartRodData(
          toY: 12,
          color: Colors.blue,
          width: 20,
        ),
      ],
    ),
    BarChartGroupData(
      x: 2,
      barRods: [
        BarChartRodData(
          toY: 18,
          color: Colors.green,
          width: 20,
        ),
      ],
    ),
    BarChartGroupData(
      x: 3,
      barRods: [
        BarChartRodData(
          toY: 15,
          color: Colors.red,
          width: 20,
        ),
      ],
    ),
  ];


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        height: MediaQuery.of(context).size.height,
        width: MediaQuery.of(context).size.width,
        decoration: BoxDecoration(
            image: DecorationImage(
                image: AssetImage("assets/images/ghana_back.png"),
                fit: BoxFit.cover)),
        child: SafeArea(
          child: Container(
            height: MediaQuery.of(context).size.height,
            width: MediaQuery.of(context).size.width,
            //decoration: ,
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
              child: Container(
                // color: Colors.white.withOpacity(0.5),

                child: Column(
                  children: [
                    Expanded(
                      child: Column(
                        children: [

                          Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(20),
                              //color: Colors.black.withOpacity(0.5),
                            ),
                            padding: EdgeInsets.all(10),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      "Good Morning",
                                      style: TextStyle(
                                          fontSize: 15,
                                          fontWeight: FontWeight.w500),
                                    ),
                                    Text(
                                      "Sandra",
                                      style: TextStyle(
                                          fontSize: 20,
                                          fontWeight: FontWeight.w700,
                                          fontFamily: "Fontspring"),
                                    ),
                                  ],
                                ),
                                Row(
                                  children: [
                                    Container(
                                        padding: EdgeInsets.all(10),
                                        decoration: BoxDecoration(
                                          color: Colors.white.withOpacity(0.2),
                                          borderRadius:
                                          BorderRadius.circular(100),
                                          boxShadow: [
                                            BoxShadow(
                                              color:
                                              Colors.black.withOpacity(0.3),
                                              spreadRadius: 2,
                                              blurRadius: 3,
                                              offset: Offset(0,
                                                  2), // changes position of shadow
                                            ),
                                          ],
                                        ),
                                        child: Icon(
                                          Icons.notifications_active_outlined,
                                          size: 28,
                                          color: Colors.white,
                                        )),
                                    SizedBox(
                                      width: 10,
                                    ),
                                    InkWell(
                                      onTap: () {
                                        //Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context) => UserProfile()));
                                      },
                                      child: CircleAvatar(
                                        radius: 35,
                                      ),
                                    )
                                  ],
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: EdgeInsets.all(5),
                            decoration: BoxDecoration(
                              //color: ghPrimary.withOpacity(0.5),
                                borderRadius: BorderRadius.circular(10)
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceAround,
                              children: [
                                buildNavItem("Presidential", 0),
                                buildNavItem("Parliamentary", 1),

                              ],
                            ),
                          ),
                          SizedBox(
                            height: 20,
                          ),
                          Expanded(
                            child: PageView(

                              controller: _pageController,
                              onPageChanged: (int page) {
                                setState(() {
                                  currentPage = page;
                                });
                              },
                              children: [
                                Container(
                                  //color: Colors.white,
                                  height: 300,
                                  child:BarChart(
                                    BarChartData(
                                      barGroups: barChartData,
                                      borderData: FlBorderData(
                                        show: false,
                                      ),
                                      titlesData: FlTitlesData(
                                        bottomTitles: AxisTitles(
                                          sideTitles: SideTitles(showTitles: true),
                                        ),
                                        leftTitles: AxisTitles(
                                          sideTitles: SideTitles(showTitles: true),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                Container(
                                  //color: Colors.white,
                                  height: 300,
                                  child:BarChart(
                                    BarChartData(
                                      barGroups: barChartData,
                                      borderData: FlBorderData(
                                        show: false,
                                      ),
                                      titlesData: FlTitlesData(
                                        bottomTitles: AxisTitles(
                                          sideTitles: SideTitles(showTitles: true),
                                        ),
                                        leftTitles: AxisTitles(
                                          sideTitles: SideTitles(showTitles: true),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                // Add more pages as needed
                              ],
                            ),
                          ),
                          Container(
                            padding: EdgeInsets.all(10),
                            child: Row(
                              children: [
                                Expanded(
                                  child: InkWell(
                                    onTap: (){
                                      Navigator.push(context, MaterialPageRoute(builder: (context) => EnterResultScreen()));




                                    },
                                    child: Container(
                                      padding: EdgeInsets.all(15),
                                      margin: EdgeInsets.all(5),
                                      decoration: BoxDecoration(
                                        color: Colors.black.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(10),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(0.1),
                                            spreadRadius: 1,
                                            blurRadius: 2,
                                            offset: Offset(0,
                                                2), // changes position of shadow
                                          ),
                                        ],
                                      ),
                                      child: Column(
                                        children: [
                                          Icon(
                                            Icons.list,
                                            color: Colors.white,
                                            size: 40,
                                          ),
                                          SizedBox(
                                            height: 5,
                                          ),
                                          Text(
                                            "Enter Election\nResults",
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w600),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                                Expanded(
                                  child: InkWell(
                                    onTap: (){
                                      Navigator.push(context, MaterialPageRoute(builder: (context) => SubmittedResultScreen()));

                                    },
                                    child: Container(
                                      padding: EdgeInsets.all(15),
                                      margin: EdgeInsets.all(5),
                                      decoration: BoxDecoration(
                                        color: Colors.black.withOpacity(0.2),
                                        borderRadius: BorderRadius.circular(10),
                                        boxShadow: [
                                          BoxShadow(
                                            color: Colors.black.withOpacity(0.1),
                                            spreadRadius: 1,
                                            blurRadius: 2,
                                            offset: Offset(0,
                                                2), // changes position of shadow
                                          ),
                                        ],
                                      ),
                                      child: Column(
                                        children: [
                                          Icon(
                                            Icons.checklist,
                                            color: Colors.white,
                                            size: 40,
                                          ),
                                          SizedBox(
                                            height: 5,
                                          ),
                                          Text(
                                            "View Submited\nResults ",
                                            textAlign: TextAlign.center,
                                            style: TextStyle(
                                                fontSize: 15,
                                                fontWeight: FontWeight.w600),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),

                        ],
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(vertical: 15),
                      margin: EdgeInsets.all(15),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(100),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.grey.withOpacity(0.5),
                            spreadRadius: 5,
                            blurRadius: 7,
                            offset: Offset(0, 3), // changes position of shadow
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        //crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          InkWell(
                            onTap: () {
                              /*      Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context) => DashboardScreen()));
                      */
                            },
                            child: Column(
                              children: [
                                Icon(
                                  Icons.home,
                                  color: Colors.white,
                                  size: 40,
                                )
                              ],
                            ),
                          ),
                          InkWell(
                            onTap: () {
                              // Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context) => UserBookings()));
                            },
                            child: Column(
                              children: [     Icon(
                                Icons.call,
                                color: Colors.black,
                                size: 40,
                              )],
                            ),
                          ),

                          InkWell(
                            onTap: () {
                              Navigator.of(context).push(MaterialPageRoute(builder: (BuildContext context) => UserProfileScreen()));
                            },
                            child: Column(
                              children: [     Icon(
                                Icons.person,
                                color: Colors.black,
                                size: 40,
                              )],
                            ),
                          ),

                        ],
                      ),
                    )
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }


  Widget buildNavItem(String title, int pageIndex) {
    bool isSelected = currentPage == pageIndex;

    return GestureDetector(
      onTap: () {
        _pageController.animateToPage(
          pageIndex,
          duration: Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      },
      child: Container(
        margin: EdgeInsets.all(5),
        padding: EdgeInsets.all(10),
        width: 120,
        decoration: BoxDecoration(
          color: isSelected ? Colors.grey.withOpacity(0.3) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Center(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
            ),
          ),
        ),
      ),
    );
  }
}
