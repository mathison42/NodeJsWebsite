
/**
 * param  data  Complete user data in JSON format from database
 * return String list of all column names, Date is removed.
 */
exports.getColumns = function(data) {
  var result = []
  if (data.length == 0) {
    console.log('No data found.');
  } else {
    result = data[0];
    for (var i=result.length-1; i>=0; i--) {
      // Remove date column
      if (result[i].trim() === "" || result[i].trim().toLowerCase() === "date") {
          result.splice(i, 1);
      }
    }
    return result;
  }
};

/**
 * param data Complete user data in JSON format from database
 * param lastXRecords The number of records to display
 * return HTML table for Dashboard consisting of top 5 workouts
 */
exports.generateDashboardTable = function(data, lastXRecords) {
  if (data.length == 0) {
    console.log('No data found.');
  } else {
    var result = [];
    // Create an array full of zeros
    for (var i=0; i<=data[0].length; i++) {
      result[i] = 0;
    }

    // Count all lifts
    for (var i=1; i<data.length; i++) {
      var row = data[i];
      // console.log("Row" + i + ": " + row);
      for (var j=1; j<row.length; j++) {
        if (data[i][j]) {
          result[j] += 1;
        }
      }
    }
    console.log("Count: " + result);

    // Determine Highest "5" Lifts
    var columns = exports.getColumns(data);
    var topLiftsCount = 5;
    if (columns.length < 5) {
      topLiftsCount = columns.length
    }
    var maxColumns   = [];
    var maxColumnIds = [];
    for (var i=0; i<topLiftsCount; i++){
      var max   = -1
      var maxId = -1
      for (var j=1; j<result.length; j++) {
        if (result[j] > max) {
          max = result[j];
          maxId = j;
        }
      }
      maxColumns[i]   = columns[maxId-1]; // -1 because Date is removed
      maxColumnIds[i] = maxId
      result[maxId]   = -1;
    }

    maxColumns.splice(0, 0, "Date");
    maxColumnIds.splice(0, 0, 0);
    console.log("Max Columns: " + maxColumns);

    var resultHTML = "<thead><tr>";

    for (var i=0; i<maxColumns.length; i++) {
      resultHTML += "<th>" + maxColumns[i] + "</th>";
      if (i != 0){
        resultHTML += "<th>1RM</th>";
      }
    }

    resultHTML += "</tr></thead><tbody>";

    // Calculate how many days to show
    var limit = data.length - 1 - lastXRecords;
    if (limit < 0) {
      limit = 0;
    }
    // Get Reps and Sets for those lifts
    for (var i=data.length-1; i>limit; i--) {
      resultHTML += "<tr>";
      for (var j=0; j<maxColumns.length; j++) {
        //console.log(data[i][maxColumnIds[j]]);
        var outVal  = "";
        var actVal  = data[i][maxColumnIds[j]];
        if (data[i][maxColumnIds[j]]) {
          outVal = exports.validValue(actVal);
        }
        resultHTML += "<td>" + outVal + "</td>"
        if (j != 0) {
          resultHTML += "<td>" + exports.getOneRepMax(actVal) + "</td>"
        }
      }
      resultHTML += "</tr>";
    }
    resultHTML += "</tr></tbody>";

    return resultHTML;
  }
};

/*
 * param input User lift data or date in String format
 * return Surrounds string in gray font if invalid
 */
exports.validValue = function (input) {
  var result = input;
  if (!exports.validWeight(input) && !exports.validDate(input)) {
    result = "<font color='gray'>" + input + "</font>";
  }
  return result;
};

/*
 * param input Confirms lift string data is valid and fits regex formatting
 * return true or false based on weight value [ex. 100x5*3-110x5]
 */
exports.validWeight = function (input) {
  var result = false;
  var magic = "^(\\d+x\\d+(\\*\\d+)?)((-\\d+x\\d+(\\*\\d+)?)*)$";

  if (input.match(magic)) {
    result = true;
  }
  return result;
};

/*
 * param input String data value. [Month Day Year] or [Day Month Year]
 * return Confirms if String date is valid or not
 */
exports.validDate = function (input) {
  var result = false;
  var magicDate1 ="^(0?[1-9]|[12][0-9]|3[01])[\/|.|-](0?[1-9]|1[012])[\/|.|-]((19|20)\\d\\d)$";
  var magicDate2 ="^(0?[1-9]|1[012])[\/|.|-](0?[1-9]|[12][0-9]|3[01])[\/|.|-]((19|20)\\d\\d)$";

  if (input.match(magicDate1) || input.match(magicDate2)) {
    result = true;
  }
  return result;
};

/*
 * param input Single lift value from user data
 * return Parse and confirm valid value, then calculates 1RM
 */
exports.getOneRepMax = function (input) {
  if (input == "" || input == undefined || input == null) {
    return "";
  }

  var result = "";
  // Needs to properly parse a single number too!
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

    // Try and determine which value is weight and reps
    var reps;
    var weight;
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
    // Calculate one rep max
    result = exports.calculateOneRepMax(weight, reps);
  }
  return result;
};

/**
 * Caluate the one rep max using the Epley Formula -> 1RM = w(1 + r/30)
 * param w  weight
 * param r  reps, assume r > 1
 * return One rep max
 */
exports.calculateOneRepMax = function (w, r) {
  var result;
  var raw1RM = w * (1 + r/30);
  result = Math.floor(raw1RM);
  return result;
};

/**
 * param input Value to encode for use in URIs
 * return Encoded URI value
 */
exports.encode = function (input) {
    return encodeURIComponent(input);
};

exports.testing = function () {
    console.log("IM HERE");
};

exports.foo = function () { return 'FOO!'; };

exports.bar = function () { return 'BAR!'; };
