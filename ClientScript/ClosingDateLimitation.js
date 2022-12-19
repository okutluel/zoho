
/** 
 * ClosingDateLimitation
 * Assures that the Closing Date is within the pre-determined guidelines of the Status (Probability), warns users with appropriate time frames
 * Version: 1.0
 * Author:  Ozlem Kutluel
 * returning false prevents <SAVE> actiona
**/


/* Get closing date input */
var temp = ZDK.Page.getField("Closing_Date").getValue();
log(temp);

/* Get Date/Time format of currently logged-in user */
var format = $Crm.user.date_format;
log(format);

/* Replace all possible split characters with a space */
temp = temp.replaceAll(". ", " ");
temp = temp.replaceAll(", ", " ");
temp = temp.replaceAll("/", " ");
temp = temp.replaceAll(".", " ");
temp = temp.replaceAll("-", " ");

/* Replace all possible non-english characters with a space */
if (temp.includes("年")) {
    temp = temp.replaceAll("年", " ");
    temp = temp.replaceAll("月", " ");
    temp = temp.slice(0, -1);
}

/* Split by " " */
tempArray = temp.split(" ");

/* Initialize storage variables */
var month = 0;
var day = 0;
var year = 0;

/* Find position of information based on the Date/Time format */
month = format.indexOf("M");
if (month == -1) {
    month = format.indexOf("m");
}
day = format.indexOf("D");
if (day == -1) {
    day = format.indexOf("d");
}
year = format.indexOf("Y");
if (year == -1) {
    year = format.indexOf("y");
}

/* Iterate through all possible orders and pull information appropriately */
if (month < day && month < year) {
    temp = tempArray[0];
    temp = temp.concat(" ");
    if (day < year) {
        temp = temp.concat(tempArray[1]);
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[2]); 
    }
    else {
        temp = temp.concat(tempArray[2]);
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[1]);
    }
}

if (day < month && day < year) {
    if (month < year) {
        temp = tempArray[1];
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[0]);
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[2]);
    }
    else {
        temp = tempArray[2];
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[0]);
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[1]);
    }
}

if (year < month && year < day) {
    if (month < day) {
        temp = tempArray[1];
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[2]);
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[0]);
    }
    else {
        temp = tempArray[2];
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[1]);
        temp = temp.concat(" ");
        temp = temp.concat(tempArray[0]);
    }
}

/* Make closing date readable by Date() */
var closingDate = new Date(temp);
log(closingDate);

/* Get probability input */
var probability = ZDK.Page.getField("Probability").getValue();

/* Get current date */
var currDate = new Date();
log(currDate);

/* Create variable to store earliest date */
var capDate = new Date();

/* Create variable to store latest date */
var botDate = new Date();

switch (probability) {
    case 1:
        // Set capDate to between 3 and 4 months from now
        capDate.setMonth(capDate.getMonth() + 4);
        botDate.setMonth(botDate.getMonth() + 3);
        var errorMessage = "You have selected the stage: Opportunity Identified. The closing date is suggested to be between 3 to 4 months. If this is an exception, please indicate the reason in the notes section.";
        break;
    case 10:
        // Set capDate to between 3 and 4 months from now
        capDate.setMonth(capDate.getMonth() + 4);
        botDate.setMonth(botDate.getMonth() + 3);
        var errorMessage = "You have selected the stage: RFI/RFP Submitted. The closing date is suggested to be between 3 to 4 months. If this is an exception, please indicate the reason in the notes section.";
        break;
    case 20:
        // Set capDate to between 2 and 3 months from now
        capDate.setMonth(capDate.getMonth() + 3);
        botDate.setMonth(botDate.getMonth() + 2);
        var errorMessage = "You have selected the stage: Proposal Submitted. The closing date is suggested to be between 2 to 3 months. If this is an exception, please indicate the reason in the notes section.";
        break;
    case 50:
        // Set capDate to between 1 and 2 months from now
        capDate.setMonth(capDate.getMonth() + 2);
        botDate.setMonth(botDate.getMonth() + 1);
        var errorMessage = "You have selected the stage: Upside. The closing date is suggested to be between 1 to 2 months. If this is an exception, please indicate the reason in the notes section.";
        break;
    case 75:
        // Set capDate to between 15 days and 1 months from now
        capDate.setMonth(capDate.getMonth() + 1);
        botDate.setDate(botDate.getDate() + 15);
        var errorMessage = "You have selected the stage: Probable. The closing date is suggested to be between 15 days to 1 month. If this is an exception, please indicate the reason in the notes section.";
        break;
    case 90:
        // Set capDate to 15 days from now
        capDate.setDate(capDate.getDate() + 15);
        var errorMessage = "You have selected the stage: Commit. The closing date is suggested to be below 15 days. If this is an exception, please indicate the reason in the notes section.";
        break;
}

/* Check to see if inputted date is within guidelines */
/* If not, display error message */
if (closingDate > capDate) {
    log("WRONG DATE");
    ZDK.Client.showAlert(errorMessage);
    // ar field_obj = ZDK.Page.getField('Custom_Field1');
    // field_obj.setMandatory(true);
}
else if (closingDate < botDate) {
    log("WRONG DATE");
    ZDK.Client.showAlert(errorMessage);
}
/* If yes, allow save */
else {
    log("CORRECT DATE");
    return true;
}
