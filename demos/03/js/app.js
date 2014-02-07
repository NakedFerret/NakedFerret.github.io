var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 100);


function init() {
    setInterval(updateTime, 1000);
}

function Hand(element, degree_rotation) {
    this.degree_rotation = degree_rotation;
    this.element = element;

    this.update = function(time) {
	console.log
	degree = time * degree_rotation;
	this.element.style.MozTransform = "rotate("+degree+"deg)";
    };
}

function updateTime() {
    // Rotate image

    var d = new Date();

    console.log(d.toString());

    var hour_hand = new Hand(document.getElementById('hour-hand'), 30);
    var minute_hand = new Hand(document.getElementById('minute-hand'), 6);
    var second_hand = new Hand(document.getElementById('second-hand'), 6);

    minute_hand.update(d.getMinutes());
    second_hand.update(d.getSeconds());

    var h = d.getHours();
    if (h >= 12) {
	h -= 12;
    }

    hour_hand.update(h);
    
}


