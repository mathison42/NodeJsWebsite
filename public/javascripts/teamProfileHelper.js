
// var a = '1'
// var b1 = "TEXT HERE"
// console.log(this['b'+a]);
var adminCount = 1; // assume 1 because user's email is automatically entered
// If teamProfile is updating, add the list of already generated admin email boxes

function updateAdminCount(length) {
    if (length)
        adminCount += length-1;
}
document.getElementById("addAdmin").addEventListener("click", function(){
    // Construct the breakline and newAdmin elements
    var br = document.createElement("br");
    var newAdmin = document.createElement('input');
    newAdmin.type = "email";
    newAdmin.name = "adminEmail" + adminCount;
    newAdmin.id = "adminEmail" + adminCount;
    newAdmin.size = "30"
    newAdmin.placeholder = "Other Admin Email #" + (adminCount + 1);

    // Add the elements to email list
    document.getElementById("adminInput").appendChild(newAdmin);
    document.getElementById("adminInput").appendChild(br);

    // Increment the admin counter
    adminCount++;
});

var teammateCount = 1; // assume 1 because user's email is automatically entered
// If teamProfile is updating, add the list of already generated teammate email boxes
function updateTeammateCount(length) {
    if (length)
        teammateCount += length-1;
}
document.getElementById("addTeammate").addEventListener("click", function(){
    // Construct the breakline and newAdmin elements
    var br = document.createElement("br");
    var newTeammate = document.createElement('input');
    newTeammate.type = "email";
    newTeammate.name = "teammateEmail" + teammateCount;
    newTeammate.id = "teammateEmail" + teammateCount;
    newTeammate.size = "30"
    newTeammate.placeholder = "Other Teammate Email #" + (teammateCount + 1);

    // Add the elements to email list
    document.getElementById("teammateInput").appendChild(newTeammate);
    document.getElementById("teammateInput").appendChild(br);

    // Increment the teammate counter
    teammateCount++;
});
