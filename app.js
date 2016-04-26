var opGrafApp = angular.module('opGrafApp', ['nvd3']);

opGrafApp.controller('OpGrafCtrl', function ($scope, $window) {
  $scope.semester = "8";
  $scope.year = 2014;
  $scope.update = function() {
    $scope.options = {
               chart: {
                   type: 'multiChart',
                   interpolate: 'linear',
                   height: $window.innerHeight*0.85,
                   margin : {
                       top: 30,
                       right: 50,
                       bottom: 50,
                       left: 50
                   },
                   transitionDuration: 500,
                   yDomain2: [0, 5],
                   xAxis: {
                       tickFormat: function(d){
                           return d3.time.format('%x')(new Date(d));
                       }
                   },
                   yAxis1: {
                       tickFormat: function(d){
                           return d3.format(',.1f')(d);
                       }
                   },
                   yAxis2: {
                       tickFormat: function(d){
                           return d3.format(',.1f')(d);
                       }
                   },
                   tooltip: {
                    contentGenerator: function (e) {
                      var series = e.series[0];
                      if (series.value === null) return;
                      var date = new Date(parseInt(e.value));

                      var rows =
                        "<tr>" +
                         "<td class='key'></td>" +
                        "</tr>" +
                        "<tr>" +
                          "<td class='key'>" + 'Date: ' + "</td>" +
                          "<td class='x-value'>" +date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear()+ "</td>" +
                        "</tr>";

                      var header =
                        "<thead>" +
                          "<tr>" +
                            "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                            "<td class='x-value'><strong>" + (series.value?series.value.toFixed(2):0) + "</strong></td>" +

                          "</tr>" +
                        "</thead>";

                      return "<table>" +
                          header +
                          "<tbody>" +
                            rows +
                          "</tbody>" +
                        "</table>";
                    }
                }
               }
           };

    $scope.data = [
        {
            key: "opintopisteesi",
            yAxis: 1,
            type: "line",
            values: []
        },
        {
            key: "suositusvauhti",
            yAxis: 1,
            type: "line",
            values: []
        },
        {
            key: "keskiarvo",
            yAxis: 2,
            type: "line",
            values: []
        }
    ];

    var rawData = $scope.rawInput.match(/     [A-Z]?\d{3,}.*\n/g);
    var courses = [];

    rawData.forEach(function(row) {
      var course = {};
      row = row.replace(/^\s+|\s+$/g, '');
      row = row.replace(/\(|\)/g, '');
      row = row.split(/[\s]{2,}/);

      course.id = row[0];
      course.name = row[1];
      course.credits = parseInt(row[2]);
      course.grade = parseInt(row[3]);
      course.date = new Date(row[4].split(".")[2], row[4].split(".")[1], row[4].split(".")[0]).getTime()

      courses.push(course);
    });

    function compare(a,b) {
      if (a.date < b.date) return -1;
      else return 1;
    }

    courses.sort(compare);

    var sum = 0, gradeSum = 0, c = 0;

    courses.forEach(function(course) {
      var credit = {x:course.date};
      var gradeAvg = {x:course.date};

      sum += course.credits;

      if (course.grade) {
        gradeSum += course.grade;
        c++;
        gradeAvg.y = (gradeSum/c);
        $scope.data[2]["values"].push(gradeAvg);
      }

      credit.y = (sum);
      $scope.data[0]["values"].push(credit);

    });

    var startDate = new Date($scope.year, $scope.semester, 1).getTime();
    var length = $scope.data[0]["values"].length;

    sum = 0;

    $scope.data[1]["values"].push({x: startDate,y: sum});
    while(startDate < $scope.data[0]["values"][length-1].x) {
      sum += 60;
      startDate += 31556926000
      $scope.data[1]["values"].push({x: startDate,y: sum});
    }

  }
});
