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

    document.querySelector("#btn-contact-create").addEventListener('click', function() {
	// Add some dummy contacts
	createAndSaveContact("Mary", "Jane");
	createAndSaveContact("John", "Doe");
	createAndSaveContact("Mary", "Poppins");
	createAndSaveContact("Jogi", "Bear");
	createAndSaveContact("Gerald", "Johanssen");
    });

    document.querySelector("#btn-contact-find").addEventListener('click', function() {
	var options = {
	    filterValue : "John",
	    filterBy    : ["givenName"],
	    filterOp    : "contains",
	    filterLimit : 1
	}

	var search = navigator.mozContacts.find(options);

	search.onsuccess = function() {
	    if (search.result.length === 1) {
		var person = search.result[0];
		var firstName = person.givenName[0];
		var lastName = person.familyName[0];
		console.log("Found:" + firstName + " " + lastName);
	    } else {
		console.log("Sorry, there is no such contact.")
	    }
	}

	search.onerror = function() {
	    console.error("Search failed");
	}
    });

    document.querySelector("#btn-contact-update").addEventListener('click', function() {

	var updateContact = function(contact) {

	    var updateRequest = navigator.mozContacts.save(contact); 

	    updateRequest.onsuccess = function() {
		console.log("contact #" + contact.id + " updated");
	    };

	    updateRequest.onerror = function() {
		console.error("could not update contact #" + contact.id);
	    };
	};


	var options = {
	    filterValue : "John",
	    filterBy    : ["givenName"],
	    filterOp    : "contains",
	    filterLimit : 1
	}

	var search = navigator.mozContacts.find(options);

	search.onsuccess = function() {
	    if (search.result.length === 1) {
		var person = search.result[0];

		// Change last name to Mathews
		person.familyName[0] = "Mathews";

		updateContact(person)
	    } else {
		console.log("Sorry, there is no such contact.")
	    }
	}

	search.onerror = function() {
	    console.error("Search failed");
	}

	
    });

    
    document.querySelector("#btn-contact-delete").addEventListener('click', function() {

	var deleteContact = function(contact) {

	    var deleteRequest = navigator.mozContacts.remove(contact); 

	    deleteRequest.onsuccess = function() {
		console.log("contact #" + contact.id + " removed");
	    };

	    deleteRequest.onerror = function() {
		console.error("could not remove contact #" + contact.id);
	    };
	};


	var options = {
	    filterValue : "John",
	    filterBy    : ["givenName"],
	    filterOp    : "contains",
	    filterLimit : 1
	}

	var search = navigator.mozContacts.find(options);

	search.onsuccess = function() {
	    if (search.result.length === 1) {
		var person = search.result[0];

		// Change last name to Mathews
		person.familyName[0] = "Mathews";

		deleteContact(person)
	    } else {
		console.log("Sorry, there is no such contact.")
	    }
	}

	search.onerror = function() {
	    console.error("Search failed");
	}
	
    });

    document.querySelector("#btn-contact-clear").addEventListener('click', function() {

	var clearRequest = navigator.mozContacts.clear();

	clearRequest.onsuccess = function () {
	    console.log('All contacts have been removed.');
	}

	clearRequest.onerror = function () {
	    console.error('Contacts were not cleared');
	}
    });

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
