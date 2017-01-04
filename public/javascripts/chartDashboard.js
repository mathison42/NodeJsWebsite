google.charts.load('current', {packages: ['corechart', 'line']});

console.log("userData1: " + userData[0])

if (userData) {
    google.charts.setOnLoadCallback(generateDashboardGraphs);
}

function generateDashboardGraphs() {
  if (userData.length == 0) {
    console.log('Charts: No userData found.');
  } else {
    drawGraphs(userData);
  }
}

function drawGraphs(data) {
  var count = countTotalLifts(userData);

  var dashCharts = ["chart_div0", "chart_div1", "chart_div2", "chart_div3"]
  var maxes = getMaxLifts(data[0], count);
  var maxColumns   = maxes[0];
  var maxColumnIds = maxes[1];
  for (var i = 0; i < dashCharts.length; i++) {
      drawBasicGraph(data, maxColumnIds[i], dashCharts[i])
  }
}
