var helpers = require("./helpers.js");

exports.generateLiftTable = function(lift, data) {
    var columns = helpers.getColumns(data);
    console.log("Columns: " + columns);
    var liftId = columns.indexOf(lift) + 1;
    console.log("liftId: " + liftId);
    var resultHTML = "<thead><tr>";
    resultHTML += "<th>Date</th>";
    resultHTML += "<th>" + lift + " Reps</th>";
    resultHTML += "<th>1RM</th>";
    resultHTML += "</tr></thead><tbody>";

    // Get Reps and Sets for those lifts
    for (var i=data.length-1; i>0; i--) {
        var actVal   = data[i][liftId];
        if (actVal) {
            resultHTML += "<tr>";

            // Date Value
            var outDate  = "";
            var actDate   = data[i][0];
            if (actDate) {
                outDate = helpers.validValue(actDate);
            }
            resultHTML += "<td>" + outDate + "</td>"

            // Lift Value
            var outVal  = "";
            if (actVal) {
                outVal = helpers.validValue(actVal);
            }
            resultHTML += "<td>" + outVal + "</td>"

            // 1RM Value
            var oneRM = "";
            if (actVal) {
                oneRM += helpers.getOneRepMax(actVal)
            }
            resultHTML += "<td>" + oneRM + "</td>"
            resultHTML += "</tr>";
        }
    }
    resultHTML += "</tbody>";

    return resultHTML;
};
