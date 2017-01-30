google.charts.load('current', {packages: ['corechart', 'line']});

console.log("Lift: " + lift)

if (userData && lift) {
    google.charts.setOnLoadCallback(generateLiftGraph);
}

function generateLiftGraph() {
  if (userData.length == 0) {
    console.log('Lifts Chart: No userData found.');
} else if (!lift) {
    console.log('Lifts Chart: No lift found.');
} else {
    drawLiftGraph(userData);
  }
}
function drawLiftGraph(data) {
  var liftChart = "chart_div_lift";
  var columnId = userData[0].indexOf(lift);
  drawBasicGraph(data, columnId, liftChart, -1);
}
