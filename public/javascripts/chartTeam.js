google.charts.load('current', {packages: ['corechart', 'line']});

function generateTeamGraph(lift) {
  //console.log("Team Lift: " + lift);
  if (teamData.length == 0) {
    console.log('Team Lifts Chart: No teamData found.');
} else if (!lift) {
    console.log('Team Lifts Chart: No lift found.');
} else {
    drawTeamLiftGraph(teamData, lift);
  }
}

function drawTeamLiftGraph(team, lift) {
  var liftChart = "chart_div_team";
  var dt = generateTeamData(team, lift);
  drawTeamGraph(dt, lift, liftChart);
}

function generateTeamData(teamFullData, lift) {

  var dt = new google.visualization.DataTable();
  dt.addColumn('date', 'X');

  // Get total number of teammates
  var teamCount = 0;
  for (var user in teamFullData) {
    if (teamFullData.hasOwnProperty(user)) {
      teamCount++
      dt.addColumn('number', user);
    }
  }

  // Map of User's Index location of lift
  var teamLiftIndexes = generateLiftIndexMap(teamFullData, lift);
  //console.log("teamLiftIndexes", teamLiftIndexes);

  // Gather user data into individual lists [Date, string/lift]
  var teamLiftData = {};
  for (var user in teamFullData) {
    if (teamFullData.hasOwnProperty(user)) {
      teamLiftData[user] = generateUserLiftData(teamFullData[user], teamLiftIndexes[user]);
    }
  }
  //console.log("teamLiftData", teamLiftData);
  // Get 1RM for all lifts
  var team1RMData = {};
  for (var user in teamLiftData) {
    if (teamLiftData.hasOwnProperty(user)) {
      team1RMData[user] = generate1RMData(teamLiftData[user]);
    }
  }
  //console.log("team1RMData", team1RMData);

  // Merge into master map
  var masterLiftMap = {};
  var userCount = 0;
  for (var user in team1RMData) {
    if (team1RMData.hasOwnProperty(user)) {
      var user1RMData = team1RMData[user];
      for (var i = 0; i < user1RMData.length; i++) {
        var date = user1RMData[i][0];
        var data = masterLiftMap[date];
        if (!data) {
          data = new Array(teamCount);
          for (var j = 0; j < teamCount; j++) {
            data[j] = undefined;
          }
        }
        data[userCount] = user1RMData[i][1];
        masterLiftMap[date] = data;
      }
      userCount++;
    }
  }
  //console.log("masterLiftMap", masterLiftMap);

  // Create master array
  var masterLiftArray = [];
  for (var date in masterLiftMap) {
    if (masterLiftMap.hasOwnProperty(date)) {
      var fullData = [];
      var data = masterLiftMap[date];
      fullData.push(new Date(date));
      for (var i = 0; i < data.length; i++) {
        fullData.push(data[i]);
      }
      masterLiftArray.push(fullData);
    }
  }
  //console.log("masterLiftArray1", masterLiftArray);

  // Sort Data by Date
  masterLiftArray.sort(function(a,b){
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return a[0] - b[0];
  });

  //console.log("masterLiftArray2", masterLiftArray);

  // Now that it's ordered, repeat previous if undefined, and add each row to dt
  // Initialize the first data point
  if (masterLiftArray.length) {
      var prev = masterLiftArray[0];
      for (var i = 1; i < prev.length; i++) {
        if (!prev[i]) {
          prev[i] = 0;
        }
      }
      dt.addRow(prev);
      for (var i = 1; i < masterLiftArray.length; i++) {
        var data = masterLiftArray[i];
        for (var j = 1; j < data.length; j++) {
          if (!data[j]) {
            data[j] = prev[j];
          }
        }
        dt.addRow(data);
        masterLiftArray[i] = data;
        prev = data;
      }
  } else {
      console.log("[Warning] No data found for lift '"+ lift + "'");
  }
  //console.log("masterLiftArray", masterLiftArray);

  return dt;
}

function generateLiftIndexMap(team, lift) {
  var result = {};
  for (var key in team) {
    if (team.hasOwnProperty(key)) {
      //console.log(key + " -> " + team[key]);
      result[key] = team[key][0].indexOf(lift);
    }
  }
  return result;
}

function generateUserLiftData(userFullData, liftIndex) {
  var userLiftData = [];
  // Skip first row, which is columns
  for (var i = 1; i < userFullData.length; i++) {
    var lift = userFullData[i][liftIndex];
    if (lift) {
      var dateLift = [];
      // NOTE: Confirm Date Index and valid Date
      if (validDate(userFullData[i][0])) {
        dateLift.push(userFullData[i][0]);
        dateLift.push(lift);
        userLiftData.push(dateLift);
      }
    }
  }
  return userLiftData;
}

function generate1RMData(userLiftData) {
    for (var i = 0; i < userLiftData.length; i++) {
      var lift = userLiftData[i][1]
      if (lift) {
        userLiftData[i][1] = getOneRepMax(lift);
      }
    }
    return userLiftData;
}
