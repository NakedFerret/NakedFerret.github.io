var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 100);

navigator.mozSetMessageHandler("alarm", showNotification);

function init() {


    var notifyButton = document.querySelector('#btn-notify');
    notifyButton.addEventListener('click', showNotification);

    var notifyLaterButton = document.querySelector('#btn-notify-wait');
    notifyLaterButton.addEventListener('click', scheduleNotification);

    document.querySelector('#nav-notify').addEventListener ('click', function () {
	document.querySelector('#notification').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
    });

    document.querySelector('#btn-notification-back').addEventListener ('click', function () {
	document.querySelector('#notification').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
    });

    document.querySelector('#nav-alarm').addEventListener ('click', function () {
	document.querySelector('#alarm').className = 'current';
	document.querySelector('[data-position="current"]').className = 'left';
    });

    document.querySelector('#btn-alarm-back').addEventListener ('click', function () {
	document.querySelector('#alarm').className = 'right';
	document.querySelector('[data-position="current"]').className = 'current';
    });

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

