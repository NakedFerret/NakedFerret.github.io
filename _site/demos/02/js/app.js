var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        init();
        clearInterval(readyStateCheckInterval);
    }
}, 100);


function init() {
  setInterval(updateTime, 1000);
}

function updateTime() {
  var clock = document.getElementById('clock');
  var date = formatDate(new Date());
  clock.innerHTML = date;  
}

function formatDate(d) {
  var hh = d.getHours();
  var m = d.getMinutes();
  var s = d.getSeconds();
  var dd = "AM";
  var h = hh;
  if (h >= 12) {
    h = hh-12;
    dd = "PM";
  }
    if (h === 0) {
        h = 12;
    }
  
    m = m<10?"0"+m:m;
    s = s<10?"0"+s:s;
  
  return h + ":" + m + ":" + s + " " + dd;
}
