
    exports.getColumns = function(data) {
      var result = []
      if (data.length == 0) {
        console.log('No data found.');
      } else {
        result = data[0];
        for (var i=result.length-1; i>=0; i--) {
          if (result[i].trim() === "" || result[i].trim().toLowerCase() === "date") {
              result.splice(i, 1);
          }
        }
        return result;
      }
    };

    exports.generateDashboardTable = function(data) {
      if (data.length == 0) {
        console.log('No data found.');
      } else {
        var result = [];
        // Create an array full of zeros
        // NOTE: THIS IS ONE LESS BECAUSE DATA IS DUMB AND REMOVED DATE FROM THE FIRST LOCATION!
        // NEED TO FIGURE OUT HOW TO MAINTAIN DATE IN THE DATA
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

        // Determine Highest 5 Lifts
        var columns = exports.getColumns(data);
        var maxColumns   = [];
        var maxColumnIds = [];
        for (var i=0; i<5; i++){
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

        // Get Reps and Sets for those lifts
        for (var i=data.length-1; i>0; i--) {
          resultHTML += "<tr>";
          for (var j=0; j<maxColumns.length; j++) {
            //console.log(data[i][maxColumnIds[j]]);
            var outVal  = "";
            var actVal   = data[i][maxColumnIds[j]];
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

    exports.validValue = function (input) {
      var result = input;
      if (!exports.validWeight(input) && !exports.validDate(input)) {
        result = "<font color='gray'>" + input + "</font>";
      }
      return result;
    };

    exports.validWeight = function (input) {
      var result = false;
      var magic = "^(\\d+x\\d+(\\*\\d+)?)((-\\d+x\\d+(\\*\\d+)?)*)$";

      if (input.match(magic)) {
        result = true;
      }
      return result;
    };

    exports.validDate = function (input) {
      var result = false;
      var magicDate1 ="^(0?[1-9]|[12][0-9]|3[01])[\/|.|-](0?[1-9]|1[012])[\/|.|-]((19|20)\\d\\d)$";
      var magicDate2 ="^(0?[1-9]|1[012])[\/|.|-](0?[1-9]|[12][0-9]|3[01])[\/|.|-]((19|20)\\d\\d)$";

      if (input.match(magicDate1) || input.match(magicDate2)) {
        result = true;
      }
      return result;
    };

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

    // Caluate the one rep max using the Epley Formula
    // w = weight
    // r = reps, assume r > 1
    // 1RM = w(1 + r/30)
    exports.calculateOneRepMax = function (w, r) {
      var result;
      var raw1RM = w * (1 + r/30);
      result = Math.floor(raw1RM);
      return result;
    };

    exports.encode = function (input) {
        return encodeURIComponent(input);
    };
    exports.testing = function () {
        console.log("IM HERE");
    };

    exports.foo = function () { return 'FOO!'; };

    exports.bar = function () { return 'BAR!'; };
