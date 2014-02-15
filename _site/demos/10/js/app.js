window.onload = init;

function init() {
    console.log("hello");
    prepareNotificationDemo();
    prepareAlarmDemo();
    prepareWebActivityDemo();
    prepareContactDemo();

    addNavigation("#nav-notify", "#notification");
    addNavigation("#nav-alarm", "#alarm");
    addNavigation("#nav-webactivity", "#webactivity");
    addNavigation("#nav-contact", "#contact");
}

// Navigation //
function addNavigation(buttonSelector, sectionSelector ) {

    var navSection = document.querySelector(sectionSelector);
    var navButton = document.querySelector(buttonSelector);
    var backButton = document.querySelector(sectionSelector + " .btn-back");
    var mainSection = document.querySelector('[data-position="current"]')

    navButton.addEventListener ('click', function () {
	navSection.className = 'current';
	mainSection.className = 'left';
    });
    backButton.addEventListener ('click', function () {
	navSection.className = 'right';
	mainSection.className = 'current';
    });
}

// Notification API //
function prepareNotificationDemo() {
    var notifyButton = document.querySelector('#btn-notify');
    notifyButton.addEventListener('click', showNotification);
}

function showNotification() {
    
    if (Notification.permission === 'granted') {
	createNotification();
    } else if (Notification.permission !== 'denied') {
	console.log("Permission Denied, requesting permission");
	Notification.requestPermission(requestPermissionResult);
    }

}

function createNotification() {
    var title = "Title!";
    var body = "Look at this bod";
    var tag = 0;
    var n = new Notification(title, {body: body, tag: tag});
}

function requestPermissionResult( permission ) {

    if(!('permission' in Notification)) {
	Notification.permission = permission;
    }

    if (permission === "granted") {
	createNotification();
    }
}

// Alarm API //
function prepareAlarmDemo() {
    var notifyLaterButton = document.querySelector('#btn-notify-wait');
    notifyLaterButton.addEventListener('click', scheduleNotification);
}

function scheduleNotification() {

    var myDate  = new Date();
    myDate.setSeconds(myDate.getSeconds() + 5);
    var data = { foo: "bar" };
    var request = navigator.mozAlarms.add(myDate, "ignoreTimezone", data);

    request.onsuccess = function () {
	console.log("The alarm has been scheduled");
    };

    request.onerror = function () { 
	console.log("An error occurred: " + this.error.name);
    };

}

navigator.mozSetMessageHandler("alarm", showNotification);

// WebActivity API //
function prepareWebActivityDemo() {


    connectButton("#btn-webactivity-browse-photo", { name: "browse", 
						     data: { type: "photos"} });
    connectButton("#btn-webactivity-dial", {name: "dial", data: 
					    {type: "webtelephony/number", number: "5555555"}});

    connectButton("#btn-webactivity-new-contact", {name: "new", 
						   data: {type: "webcontacts/contact"}});
}

function connectButton(btnSelector, params){
    var logSuccess = function() {
	console.log("WebActivity reported success");
    };

    var logError = function() {
	console.log(this.error);
    };

    document.querySelector(btnSelector).addEventListener('click', function() {
	var activity = new MozActivity(params);
	activity.onsuccess = logSuccess;
	activity.onerror = logError;
    });
}


// Contact API
function prepareContactDemo() {

    // Add some dummy contacts
    createAndSaveContact("Mary", "Jane");
    createAndSaveContact("John", "Doe");
    createAndSaveContact("Mary", "Poppins");
    createAndSaveContact("Jogi", "Bear");
    createAndSaveContact("Gerald", "Johanssen");
}

function createAndSaveContact(firstName, lastName) {
    var contactData = {
	givenName: [firstName],
	familyName: [lastName]
    }

    // Platform independent code
    var person = new mozContact(contactData);
    if( "init" in person ){
	person.init(contactData);
    }
    
    var saveOperation = navigator.mozContacts.save(person);
    
    saveOperation.onsuccess = function() {
	console.log("Saved: " + firstName + " " + lastName);
    }

    saveOperation.onerror = function() {
	console.error("Failed to save " + firstName + " " + lastName);
	console.error(this.error);
    }
}
