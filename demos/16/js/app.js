window.onload = init;

function init() {
    console.log("hello");
    prepareNotificationDemo();
    prepareAlarmDemo();
    prepareWebActivityDemo();
    prepareContactDemo();
    prepareDeviceStorageDemo();
		prepareIndexedDBDemo();

    addNavigation("#nav-notify", "#notification");
    addNavigation("#nav-alarm", "#alarm");
    addNavigation("#nav-webactivity", "#webactivity");
    addNavigation("#nav-contact", "#contact");
    addNavigation("#nav-device-storage", "#device-storage");
		addNavigation("#nav-indexed-db", "#indexed-db");
}

// Navigation //
function addNavigation(buttonSelector, sectionSelector) {

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

// Dialogs //
function addDialog(buttonSelector, dialogSelector, cancelCallback, confirmCallback) {

    cancelCallback = cancelCallback || function(){};
    confirmCallback = confirmCallback || function(){};

    var dialog = document.querySelector(dialogSelector);
    var dialogButton = document.querySelector(buttonSelector);

    var cancelButton = document.querySelector(dialogSelector + " .cancel");
    var confirmButton = document.querySelector(dialogSelector + " .confirm");

    dialogButton.addEventListener ('click', function () {
				dialog.className = 'fade-in';
    });

    cancelButton.addEventListener ('click', function () {
				dialog.className = 'fade-out';
				cancelCallback();
    });

    confirmButton.addEventListener ('click', function () {
				dialog.className = 'fade-out';
				confirmCallback();
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
								utils.status.show("Found contact " + firstName + " " + lastName);
						} else {
								utils.status.show("Could not find contact " + firstName + " " 
																	+ lastName);
						}
				}

				search.onerror = function() {
						utils.status.show("Could not perform search");
						console.error(this.error);
				}
    });

    document.querySelector("#btn-contact-update").addEventListener('click', function() {

				var updateContact = function(contact) {

						var updateRequest = navigator.mozContacts.save(contact); 

						var firstName = contact.givenName[0];
						var lastName = contact.familyName[0];

						updateRequest.onsuccess = function() {
								utils.status.show("Contact " + firstName + " " + lastName + 
																	" (#" + contact.id + ") updated");
						};

						updateRequest.onerror = function() {
								utils.status.show("Contact " + firstName + " " + lastName + 
																	" (#" + contact.id + ") could not be updated");
								console.error(this.error)
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
								utils.status.show("Could not find contact to update");
						}
				}

				search.onerror = function() {
						utils.status.show("Could not perform search for contact");
						console.error(this.error);
				}
    });

    
    document.querySelector("#btn-contact-delete").addEventListener('click', function() {

				var deleteContact = function(contact) {

						var deleteRequest = navigator.mozContacts.remove(contact); 

						var firstName = contact.givenName[0];
						var lastName = contact.familyName[0];

						deleteRequest.onsuccess = function() {
								utils.status.show("Contact " + firstName + " " + lastName + 
																	" (#" + contact.id + ") removed");
								
								console.log(this.error);
						};

						deleteRequest.onerror = function() {
								utils.status.show("Contact " + firstName + " " + lastName + 
																	" (#" + contact.id + ") could not be removed");
								console.error(this.error);
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
								utils.status.show("Could not find contact to delete");
						}
				}

				search.onerror = function() {
						utils.status.show("Could not perform search for contact");
						console.error(this.error);
				}
				
    });
    
    addDialog("#btn-contact-clear", "#contact-confirm", null, function() {

    		var clearRequest = navigator.mozContacts.clear();

    		clearRequest.onsuccess = function () {
						utils.status.show('All contacts have been removed');
    		}

    		clearRequest.onerror = function () {
						utils.status.show('Could not remove contacts');
    				console.error(this.error);
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
				utils.status.show("Contact Added: " + firstName + " " + lastName);
    }

    saveOperation.onerror = function() {
				utils.status.show("Could not save contact: " + 
													firstName + " " + lastName);
				console.error(this.error);
    }
}

// Device Storage //
function prepareDeviceStorageDemo() {

    // This demo stores the icon of this app in the 'pictures' storage
    var icon_url = "/img/ic_api_showcase.png";
    var icon_filename = "api_showcase_icon.png";

    // Get the available space
    var pics = navigator.getDeviceStorage('pictures');
    var request = pics.freeSpace();
    request.onsuccess = function () {
    		var size = parseInt(this.result / 1048576);
    		document.querySelector("#available-storage").innerHTML = size + " MB";
    }
    request.onerror = function () {
    		console.error(this.error);
    		utils.status.show("Could not access the device storage");
    }
    
    // Add image
    document.querySelector("#add-file").addEventListener('click', function() {
				getBase64FromImageUrl(icon_url, function(dataURL) {
						var file = dataURLToBlob(dataURL);
						
						var request = pics.addNamed(file, icon_filename);

						request.onsuccess = function () {
								utils.status.show("Added file");
								var name = this.result;
						}

						// An error typically occur if a file with the same name already exist
						request.onerror = function () {
								utils.status.show("Could not add file");
								console.error(this.error);
						}
						
				});
				
    });
    
    // Get image
    document.querySelector("#get-file").addEventListener('click', function() {
				var request = pics.get(icon_filename);

				request.onsuccess = function () {
						var file = this.result;
						utils.status.show("File found");
						console.log(file);
				}

				request.onerror = function () {
						utils.status.show("File not found");
						console.error(this.error);
				}
    });

    // 	<button id="delete-file"> Delete File </button>
    document.querySelector("#delete-file").addEventListener('click', function() {
				var request = pics.delete(icon_filename);

				request.onsuccess = function () {
						utils.status.show("File deleted");
				}

				request.onerror = function () {
						utils.status.show("Error deleting file");
						console.error(this.error);
				}
    });

}

// Utility methods to store image
function getBase64FromImageUrl(URL, callback) {
    var img = new Image();
    img.src = URL;
    img.onload = function () {

				var canvas = document.createElement("canvas");
				canvas.width =this.width;
				canvas.height =this.height;

				var ctx = canvas.getContext("2d");
				ctx.drawImage(this, 0, 0);

				var dataURL = canvas.toDataURL("image/png");
				callback(dataURL);
    }
}

function dataURLToBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
				var parts = dataURL.split(',');
				var contentType = parts[0].split(':')[1];
				var raw = parts[1];

				return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
				uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}


// IndexedDB

function prepareIndexedDBDemo() {

		var dbName = "TestDB";
		var peopleObjectStoreName = "people";

		// The object to store in the people object store
		function Person(name, id) {
				this.name = name;
				this.id = id;
		}

		// The populated objects in the people database
		var people = [new Person("Mary",1), new Person("Bob",2), new Person("Phil",3)];

		// the designated test dummy. This person will be used in the get, update,
		// and delete parts
		var person = people[2];
		
		// Prepare the db
		var request = window.indexedDB.open(dbName, 1);

		request.onupgradeneeded = function(event) { 
				var db = event.target.result;
				// Create an objectStore for this database
				db.createObjectStore(peopleObjectStoreName, {keyPath: "id"});
				db.close();
		};

		var db;

		document.querySelector("#open-db").addEventListener('click', function() {

				if( db !== undefined ) {
						utils.status.show("Database already opened");
						return
				}

				var request = window.indexedDB.open(dbName, 1);

				request.onsuccess = function() {
						utils.status.show("Databased openened");
						console.log(this.result);
						db = this.result;
				}

				request.onerror = function() {
						utils.statush.show("Failed to open databse");
						console.error(this.error);
				}
		});

		document.querySelector("#add-db").addEventListener('click', function() {

        if( db === undefined ) {
						utils.status.show("Database not opened");
						return
				}
				
				var transaction = db.transaction([peopleObjectStoreName], "readwrite");
				var peopleOBJ = transaction.objectStore(peopleObjectStoreName);

				for( var i in people ) {
						peopleOBJ.add(people[i]);
				}

				transaction.oncomplete = function(event) {
						utils.status.show("Finished adding");
						console.log(people);
				};

				transaction.onerror = function(event) {
						utils.status.show("Failed to add");
						console.error(this.error);
				};
				
		});


		document.querySelector("#get-db").addEventListener('click', function() {
				if( db === undefined ) {
						utils.status.show("Database not opened");
						return
				}
				
				var transaction = db.transaction([peopleObjectStoreName]);
				var peopleOBJ = transaction.objectStore(peopleObjectStoreName);

				peopleOBJ.get(person.id).onsuccess = function (event) {

						if(event.target.result !== undefined)  {
								utils.status.show("Found " + person.name);
						} else {
								utils.status.show("Could not find " + person.name);
						}
				};
				
		});

		document.querySelector("#update-db").addEventListener('click', function() {

				if( db === undefined ) {
						utils.status.show("Database not opened");
						return
				}

				var transaction = db.transaction([peopleObjectStoreName], "readwrite");
				var peopleOBJ = transaction.objectStore(peopleObjectStoreName);

				// update person
				var nameBefore = person.name;
				person.name = "Jane";
				var requestUpdate = peopleOBJ.put(person);

				requestUpdate.onsuccess = function() {
						utils.status.show("Updated " + nameBefore + " to " + person.name);
				};

				requestUpdate.onerror = function() {
						utils.status.show("Could not updated " + nameBefore);
						console.error(this.error);
				};

				transaction.onerror = function(event) {
						console.log("update transaction failed");
						console.error(this.error);
				};
				
		});
		
		document.querySelector("#delete-db").addEventListener('click', function() {

				if( db === undefined ) {
						utils.status.show("Database not opened");
						return;
				}

				var transaction = db.transaction([peopleObjectStoreName], "readwrite");
				var peopleOBJ = transaction.objectStore(peopleObjectStoreName);
				var deleteRequest = peopleOBJ.delete(person.id);

				deleteRequest.onsuccess = function() {
						utils.status.show(person.name + " was deleted");
				};

				deleteRequest.onerror = function() {
						utils.status.show("Failed to delete " + person.name);
						console.error(this.error);
				};
		});

		document.querySelector("#close-db").addEventListener('click', function() {

				if( db === undefined ) {
						utils.status.show("Database not opened");
						return
				}

				db.close();
				db = undefined;
				utils.status.show("Database closed");
		});
		
		
}
