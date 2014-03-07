window.onload = init;

var dbName = "MainDB"
// Name of the IDB Object Store used to store notes
var noteStoreName = "notes"
// The Note object that goes in said store
function Note(title, content) {
    this.id
    this.title = title || "";
    this.content = content || "";
}

function init() {
    prepareDB();
    prepareCreateNoteSection();
    prepareIndexSection();
    addNavigation("#nav-create-note", "#create-note");
}

function prepareDB() {

    // This will call onupgradeneeded if it's...needed
    var request = window.indexedDB.open(dbName, 1);

    request.onupgradeneeded = function() { 
	var db = this.result;

	// Create an objectStore for this database
	var notes = db.createObjectStore(noteStoreName, 
					 {keyPath: "id", autoIncrement: true});
	notes.transaction.oncomplete = function(event) {
	    console.log("DB created!");
	    db.close();
	};
    };
}

function prepareCreateNoteSection() {

    var form = new CreateNoteForm();
    var backButton = document.querySelector("#create-note .btn-back");

    // Discard Button
    backButton.addEventListener('click', function() {
	form.reset();
    });

    // Save button
    document.querySelector("#btn-create-note-save").addEventListener('click', function() {
	saveNote(form, function() {
	    utils.status.show("Note Saved");
	    backButton.click();
	    reloadNotes();
	});
    });
}

function prepareIndexSection() {
    reloadNotes();
}

function reloadNotes() {

    var openRequest = window.indexedDB.open(dbName, 1);
    
    openRequest.onsuccess = function() {
	var db = this.result;
	
	var transaction = db.transaction([noteStoreName], "readonly");
	var notes = transaction.objectStore(noteStoreName);
	
	var cursorRequest = notes.openCursor();
	var listEmpty = false;
	
	cursorRequest.onsuccess = function() {
	    var cursor = this.result;

	    if(! listEmpty) {
		clearNoteList();
		listEmpty = true;
	    }

	    if(cursor) {
		var note = cursor.value;
		addNoteToList(note);
		cursor.continue();
	    } else {
		utils.status.show("Done loading notes");
	    }
	};

	cursorRequest.onerror = function() {
	    console.error(this.error);
	};
    };
    
    openRequest.onerror = function() {
	console.error(this.error);
    };
}

function clearNoteList() {
    var noteList = document.querySelector("#note-list");
    while (noteList.hasChildNodes()) {
	noteList.removeChild(noteList.lastChild);
    }
}

function addNoteToList(note) {
    var template = document.querySelector("#note-li-template");
    var noteList = document.querySelector("#note-list");

    var structure = template.cloneNode(true);
    structure.querySelector('.note-title').innerHTML = note.title;
    structure.querySelector('.note-content').innerHTML = note.content;
    noteList.appendChild(structure);
}


function CreateNoteForm() {
    var form = document.querySelector('form');

    this.reset = function() {
	form.reset();
    };

    this.getTitle = function() {
	var titleInput = document.querySelector("#create-note-form-title")
	return titleInput.value;
    };

    this.getContent = function() {
	var contentInput = document.querySelector("#create-note-form-content")
	return contentInput.value;
    };
}

function saveNote(form, successCallback) {

    successCallback = successCallback || function() {};

    var dbRequest = window.indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function() {
	console.log("db opened!");

	var db = this.result;
	
	var transaction = db.transaction([noteStoreName], "readwrite");
	var notes = transaction.objectStore(noteStoreName);
	
	var newNote = new Note(form.getTitle(), form.getContent());
	notes.add(newNote);
	
	transaction.oncomplete = function() {
	    console.log("Note added");
	    successCallback();
	}

	transaction.onerror = function() {
	    console.log("Failed to add note");
	    console.error(this.error);
	}
    };
    
    dbRequest.onerror = function() {
	console.error(this.error);
    };
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
