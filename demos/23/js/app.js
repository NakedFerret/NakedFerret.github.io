window.onload = init;

var dbName = "MainDB";
// Name of the IDB Object Store used to store notes
var noteStoreName = "notes";
// The Note object that goes in said store
function Note(title, content, date) {
    this.id;
    this.title = title || "";
    this.content = content || "";
    this.date = date || "";
}

function init() {
    prepareDB();
    prepareCreateNoteSection();
    prepareIndexSection();
    prepareEditMode();
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
            db.close();
        };
    };
}

function prepareCreateNoteSection() {

    var form = new CreateNoteForm();
    var backButton = document.querySelector("#create-note .btn-back");
    var saveButton = document.querySelector("#btn-create-note-save");
    
    form.init();

    // Discard Button
    backButton.addEventListener('click', function() {
        form.reset();
    });

    // Save button
    saveButton.addEventListener('click', function() {
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

    var noteListItem = template.cloneNode(true);
    noteListItem.setAttribute("note-id", note.id);
    noteListItem.querySelector('.note-title').innerHTML = note.title;
    noteListItem.querySelector('.note-content').innerHTML = note.content;
    noteListItem.querySelector('.note-date').innerHTML = note.date;
    noteList.appendChild(noteListItem);
}


function CreateNoteForm() {
    var form = document.querySelector('form');
    var dateButton = document.querySelector("#date-button");
    var datePicker = document.querySelector("#date-picker");
    
    this.init = function() {
        dateButton.addEventListener('click', function() {
            datePicker.focus();
            datePicker.addEventListener('input', function() {
               dateButton.innerHTML = this.value;
            });
        });
    };

    this.reset = function() {
        form.reset();
        dateButton.innerHTML = "Date Due";
    };

    this.getTitle = function() {
        var titleInput = document.querySelector("#create-note-form-title")
        return titleInput.value;
    };

    this.getContent = function() {
        var contentInput = document.querySelector("#create-note-form-content")
        return contentInput.value;
    };
    
    this.getDate = function() {
        return datePicker.value;
    };
}

function saveNote(form, successCallback) {

    successCallback = successCallback || function() {};

    var dbRequest = window.indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function() {
        var db = this.result;

        var transaction = db.transaction([noteStoreName], "readwrite");
        var notes = transaction.objectStore(noteStoreName);

        console.log(form.getDate());
        var newNote = new Note(form.getTitle(), form.getContent(), form.getDate());
        console.log(newNote);
        notes.add(newNote);

        transaction.oncomplete = function() {
            successCallback();
        }

        transaction.onerror = function() {
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

function prepareEditMode() {

    var multiDelete = document.querySelector("#btn-multi-delete");
    var editNoteSection = document.querySelector("#edit-note-list");
    var noteList = document.querySelector("#note-list");

    var editModeDone = document.querySelector("#btn-end-edit-mode");
    var deleteAll = document.querySelector("#btn-delete-all");
    var deleteSelected = document.querySelector("#btn-delete-selected");

    multiDelete.addEventListener("click", function() {
        editNoteSection.className = 'edit';
        noteList.setAttribute("data-type", "edit");
    });

    editModeDone.addEventListener("click", function() {
        uncheckAllNotes();

        editNoteSection.className = '';
        noteList.setAttribute("data-type", "");
        reloadNotes();
    });

    deleteAll.addEventListener('click', function() {
        var allNotes = document.querySelectorAll("#note-list li");
        var allIDs = [];
        
        for (var i = 0; i < allNotes.length; ++i) {
            var note = allNotes[i];
            var id = note.getAttribute("note-id");
            allIDs.push(parseInt(id));
        }
    
        deleteNotes(allIDs, function() {
            editModeDone.click();
        });       
    });
    
    deleteSelected.addEventListener('click', function() {
        var allNotes = document.querySelectorAll("#note-list li");
        var checkedIDs = [];
        
        for (var i = 0; i < allNotes.length; i++) {
            note = allNotes[i];
            if(note.querySelector('input:checked') != null) {
                var id = note.getAttribute('note-id');
                checkedIDs.push(parseInt(id));    
            }
        }
        
        deleteNotes(checkedIDs, function() {
            editModeDone.click();
        });
    });
}

function uncheckAllNotes() {

    var checkedNotes = document.querySelectorAll("#note-list input:checked");
    for (var i in checkedNotes) {
        checkedNotes[i].checked = false;
    }
}

function deleteNotes( noteIdList, successCallback ) {
    successCallback = successCallback || function() {};
    
    var dbRequest = window.indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function() {
        var db = this.result;

        var transaction = db.transaction([noteStoreName], "readwrite");
        var notes = transaction.objectStore(noteStoreName);

        for (var i = 0; i < noteIdList.length;i++) {
            var delRequest = notes.delete(noteIdList[i]);
            
            delRequest.onerror = function() {
              console.error(this.error);
            };
        }

        transaction.oncomplete = function() {
            successCallback();
        }

        transaction.onerror = function() {
            console.log("Failed to delete notes");
            console.log(noteIdList);
            console.error(this.error);
        }
    };
    
    dbRequest.onerror = function() {
        console.error(this.error);
    };
}