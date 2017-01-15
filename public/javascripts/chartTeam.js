google.charts.load('current', {packages: ['corechart', 'line']});

function generateTeamGraph(lift) {
  //console.log("Team Lift: " + lift);
  if (userData.length == 0) {
    console.log('Lifts Chart: No userData found.');
} else if (!lift) {
    console.log('Lifts Chart: No lift found.');
} else {
    drawLiftGraph(userData, lift);
  }
}

function drawLiftGraph(data, lift) {
  var liftChart = "chart_div_team";
  var columnId = userData[0].indexOf(lift);
  drawBasicGraph(data, columnId, liftChart)
}
