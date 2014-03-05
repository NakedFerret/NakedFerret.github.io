// hello.js
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 100);

function init() {
    console.log("ready!");
    var button = document.getElementById('coolButton');
    var state = 0; // 0 = normal | 1 = converted

    button.addEventListener('click', function(event) {

	if(state === 0) {
	    document.body.style.backgroundColor = 'black';
	    this.innerHTML = "Turn It Back!";
	    state = 1;
	} else if( state === 1) {
	    document.body.style.backgroundColor = '#fdf3e6';
	    this.innerHTML = "Do That Again!";
	    state = 0;
	}
    });

    prepareInstall();
}


function prepareInstall() {

    var isFFOS = ("mozApps" in navigator && navigator.userAgent.search("Mobile") != -1);

    if ( isFFOS ) {
	
	var installMessage = document.querySelector("#install-message");
	var installButton = document.querySelector("#btn-install");

	installMessage.classList.remove('hidden');
	installButton.classList.remove('hidden');

	installButton.addEventListener('click', function() {

	    var manifestUrl = 'http://demo01.andreani.in/manifest.webapp';
	    var req = navigator.mozApps.installPackage(manifestUrl);

	    req.onsuccess = function() {
		console.log(this.result);
	    };
	    req.onerror = function() {
		console.log(this.error);
	    };
	});
    } 
}
