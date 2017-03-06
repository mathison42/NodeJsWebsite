google.charts.load('current', {packages: ['corechart', 'line']});

if (userData) {
    google.charts.setOnLoadCallback(generateDashboardGraphs);
}

/**
 * results If no user data provided, crash gracefully. Otherwise generate graphs
 */
function generateDashboardGraphs() {
  if (userData.length == 0) {
    console.log('Charts: No userData found.');
  } else {
    drawGraphs(userData);
  }
}

/**
 * param data Full user data in JSON object
 * return Prints 1-4 graphs based on the most popular lifts
 */
function drawGraphs(data) {
  var count = countTotalLifts(userData);

  var dashCharts = ["chart_div0", "chart_div1", "chart_div2", "chart_div3"]
  var maxes = getMaxLifts(data[0], count);
  var maxColumns   = maxes[0];
  var maxColumnIds = maxes[1];

  // If user did not provide 4+ lifts, then don't print more than able
  var graphCount = dashCharts.length
  if (maxColumns.length < dashCharts.length) {
    graphCount = maxColumns.length;
  }

  for (var i = 0; i < graphCount; i++) {
      drawBasicGraph(data, maxColumnIds[i], dashCharts[i], maxDashDays);
  }
}
