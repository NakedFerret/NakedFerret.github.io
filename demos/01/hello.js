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
}
