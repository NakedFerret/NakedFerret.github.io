var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 100);

navigator.mozSetMessageHandler("alarm", showNotification);

function init() {
    var notifyButton = document.getElementById('notifyButton');
    notifyButton.addEventListener('click', showNotification);

    var notifyLaterButton = document.getElementById('notifyLaterButton');
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

