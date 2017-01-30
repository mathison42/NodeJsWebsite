
function countTotalLifts(data) {
  var result = [];
  // Create an array full of zeros
  for (var i=0; i<data[0].length; i++) {
    result[i] = 0;
  }

  console.log("Count: " + result);
  // Count all lifts
  for (var i=0; i<data.length; i++) {
    var row = data[i];
    for (var j=0; j<row.length; j++) {
      if (data[i][j]) {
    //   console.log("found: " + data[i][j]);
        result[j] += 1;
      }
    }
  }
  console.log("Count: " + result);
  return result;
}

function getMaxLifts(columns, count) {

    // Determine Highest "5" Lifts
    var topLiftsCount = 5;
    if (columns.length < 5) {
      topLiftsCount = columns.length
    }

    var maxColumns   = [];
    var maxColumnIds = [];
    for (var i = 0; i < topLiftsCount; i++){
      var max   = -1;
      var maxId = -1;
      for (var j = 1; j < count.length; j++) {
        if (count[j] > max) {
          max = count[j];
          maxId = j;
        }
      }
      maxColumns[i]   = columns[maxId];
      maxColumnIds[i] = maxId;
      count[maxId]   = -1;
    }
    return [maxColumns, maxColumnIds];
}

function getOneRepMax(input) {
    if (!input) {
    return "";
    }

    var result = "";
    var weight = 0;
    var reps   = 0;
    var magic = "^(\\d+x\\d+(\\*\\d+)?)((-\\d+x\\d+(\\*\\d+)?)*)$";
    var subMagic = "\\d+x\\d+"
    var inputArray = input.match(magic);

    if (inputArray) {
        // Get the last rep
        var full = "";
        if (inputArray[4] !== undefined || inputArray[4]) {
          full = inputArray[4].match(subMagic);
        } else if (inputArray[1] != undefined || inputArray[1]) {
          full = inputArray[1].match(subMagic);
        } else {
          console.log("[Error] Finding last rep failed.");
          console.log("[Result] inputArray: " + inputArray);
          console.log("[Result] Input: " + input);
        }

        //console.log("full", full);
        // Try and determine which value is weight and reps
        var fullArray = full[0].split("x");
        if (fullArray.length === 2) {
          // Assume weight is [1] and reps is [0]
          if (fullArray[0] <= 30 && fullArray[1] > 30) {
            weight = fullArray[1];
            reps   = fullArray[0];
          // No idea or values are reversed.. weight is [0] and reps is [1]
          } else {
            weight = fullArray[0];
            reps   = fullArray[1];
          }
        } else {
          console.log("[Error] Last Rep Array length != 2.");
          console.log("[Result]fullArray" + fullArray);
        }
    } else if (!isNaN(input) && input >= 0) {
        weight = input;
        reps   = 1;
    }

    // Calculate one rep max
    result = calculateOneRepMax(weight, reps);
    return result;
};

// Caluate the one rep max using the Epley Formula
// w = weight
// r = reps, assume r > 1
// 1RM = w(1 + r/30)
function calculateOneRepMax(w, r) {
    var result;
    if (!isNaN(w) && w >= 0 && !isNaN(r) && r > 0) {
        var raw1RM = w * (1 + r/30);
        result = Math.floor(raw1RM);
    }
    return result;
};

/*
 * param input Confirms lift string data is valid and fits regex formatting
 * return true or false based on weight value [ex. 100x5*3-110x5 || 100]
 */
function validWeight(input) {
  var result = false;
  var magic = "^(\\d+x\\d+(\\*\\d+)?)((-\\d+x\\d+(\\*\\d+)?)*)$";

  if (input && input.match(magic)) {
    result = true;
    // Confirms single values are still valid (within reason)
    // Eventually want to tackle this by lift...
  } else if (input && !isNaN(input) && input >= 0 && input < 500) {
      result = true;
  }
  return result;
};

/*
 * param input String data value. [Month Day Year] or [Day Month Year]
 * return Confirms if String date is valid or not
 */
function validDate (input) {
  var result = false;
  var magicDate1 ="^(0?[1-9]|[12][0-9]|3[01])[\/|.|-](0?[1-9]|1[012])[\/|.|-]((19|20)\\d\\d)$";
  var magicDate2 ="^(0?[1-9]|1[012])[\/|.|-](0?[1-9]|[12][0-9]|3[01])[\/|.|-]((19|20)\\d\\d)$";

  if (input.match(magicDate1) || input.match(magicDate2)) {
    // Date is not greater than today's date
    var today = new Date();
    var inputDate = new Date(input);
    if (today.getTime() >= inputDate.getTime()) {
      result = true;
    }
  }
  return result;
};

function drawBasicGraph(data, liftId, graphId, lastXRecords) {

    var dt = new google.visualization.DataTable();
    dt.addColumn('date', 'X');
    dt.addColumn('number', '1RM');

    // Calculate how many days to show
    var limit;
    if (lastXRecords < 0) {
        limit = 1;
    } else {
        limit = data.length - 1 - lastXRecords;
        if (limit < 1) {
            limit = 1;
        }
    }
    for (var i=data.length-1; i>limit; i--) {
         //console.log(data[i][liftId]);
        if (validWeight(data[i][liftId])) {
            dt.addRow([new Date(data[i][0]), getOneRepMax(data[i][liftId])]);
        }
    }

    var options = {
        // hAxis: {
        //   title: 'Date'
        // },
        vAxis: {
            title: 'Weight (lbs)'
        },
        legend: { position: 'none' }
    };

    var chart = new google.visualization.LineChart(document.getElementById(graphId));
    chart.draw(dt, options);
    var title = document.getElementById(graphId + "_title");
    title.textContent = data[0][liftId];
};

function drawTeamGraph(dt, lift, graphId) {

    var options = {
        // hAxis: {
        //   title: 'Date'
        // },
        vAxis: {
            title: 'Weight (lbs)'
        },
        legend: {}
    };

    var chart = new google.visualization.LineChart(document.getElementById(graphId));
    chart.draw(dt, options);
    var title = document.getElementById(graphId + "_title");
    title.textContent = lift;
}
