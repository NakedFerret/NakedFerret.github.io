window.onload = function() {
    var button = document.querySelector("button");

    button.addEventListener('click', function() {

        var person = new mozContact({givenName: ["Sherlock"], 
                                     familyName: ["Holmes"]});
        if( "init" in person ){
	    person.init(contactData);
        }
	navigator.mozContacts.save(person);

    });
};
