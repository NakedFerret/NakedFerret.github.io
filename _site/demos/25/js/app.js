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
    prepareIndexSection();
    prepareCreateNoteSection();
    prepareEditNoteSection();
    prepareEditMode();
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

function prepareIndexSection() {
    reloadNotes();
    addNavigation("#nav-create-note", "#create-note");
}

function prepareCreateNoteSection() {

    var form = new NoteForm('#create-note');
    var backButton = document.querySelector("#create-note .btn-back");
    var saveButton = document.querySelector("#create-note .btn-save");
    
    form.init();

    // Discard Button
    backButton.addEventListener('click', function() {
        form.reset();
    });

    // Save button
    saveButton.addEventListener('click', function() {
        saveNote(form, null, function() {
            backButton.click();
            reloadNotes();
        });
    });
}

function prepareEditNoteSection() {

    var form = new NoteForm('#edit-note');
    var section = document.querySelector("#edit-note");
    var backBtn = document.querySelector("#edit-note .btn-back");
    var saveBtn = document.querySelector("#edit-note .btn-save");
    var deleteBtn = document.querySelector('#edit-note .btn-delete')
    
    function getNoteId() {
        return parseInt(section.getAttribute("note-id"));  
    };
    
    form.init();

    // Discard Button
    backBtn.addEventListener('click', function() {
        form.reset();
        section.removeAttribute("note-id");
    });

    // Save button
    saveBtn.addEventListener('click', function() {
       saveNote(form, getNoteId(), function() {
            backBtn.click();
            reloadNotes();
        });
    });
    
    // Delete button
    deleteBtn.addEventListener('click', function() {
        deleteNotes([getNoteId()], function() {
            backBtn.click();
            reloadNotes();
        });
    });
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
    
    var noteLISelector = "li[note-id=\"" + note.id + "\"]";
    addNavigation(noteLISelector + " a", "#edit-note");
    
    var anchor = noteListItem.querySelector("a");
    anchor.addEventListener('click', function() {
        var editForm = document.querySelector("#edit-note");
        editForm.setAttribute("note-id", note.id);
        populateEditNoteSection();
    });
}

function NoteForm(formSectionSelector) {
    var form = document.querySelector(formSectionSelector + " form");
    
    var dateButton = document.querySelector(formSectionSelector + " .btn-date");
    var datePicker = form.querySelector(".picker-date");
    
    var titleInput = form.querySelector(".note-form-title");
    var contentInput = form.querySelector(".note-form-content");
    
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
        return titleInput.value;
    };
    
    this.setTitle = function(title) {
        titleInput.value = title;
    }

    this.getContent = function() {
        return contentInput.value;
    };
    
    this.setContent = function(content) {
        contentInput.value = content;
    }
    
    this.getDate = function() {
        return datePicker.value;
    };
    
    this.setDate = function(date) {
        datePicker.value = date;
        if(date != "") {
            dateButton.innerHTML = date;    
        } else {
            dateButton.innerHTML = "Date Due";    
        }
        
    }
}
    
function populateEditNoteSection() {
    var section = document.querySelector("#edit-note");
    var form = new NoteForm("#edit-note");
    var noteId = parseInt(section.getAttribute("note-id"));    
    
    var dbRequest = window.indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function() {
        var db = this.result;

        var transaction = db.transaction([noteStoreName], "readonly");
        var notes = transaction.objectStore(noteStoreName);

        var getRequest = notes.get(noteId);
        
        getRequest.onsuccess = function(event) {
            var note = this.result;
            form.setTitle(note.title);
            form.setContent(note.content);
            form.setDate(note.date);
        }
        
        getRequest.onerror = function() {
            console.error(this.error);
        }

        transaction.onerror = function() {
            console.error(this.error);
        }
    };
    
    dbRequest.onerror = function() {
        console.error(this.error);
    };
    
}

function saveNote(form, id, successCallback) {

    successCallback = successCallback || function() {};

    var dbRequest = window.indexedDB.open(dbName, 1);

    dbRequest.onsuccess = function() {
        var db = this.result;

        var transaction = db.transaction([noteStoreName], "readwrite");
        var notes = transaction.objectStore(noteStoreName);
        
        var note = new Note(form.getTitle(), form.getContent(), form.getDate());
        
        if( id !== null ) {
            note.id = id;
        }
        
        notes.put(note);

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

    var indexScrollSection = document.querySelector("#index .scrollable.header");

    var editModeDone = document.querySelector("#btn-end-edit-mode");
    var deleteAll = document.querySelector("#btn-delete-all");
    var deleteSelected = document.querySelector("#btn-delete-selected");

    multiDelete.addEventListener("click", function() {
        editNoteSection.classList.add('edit');
        indexScrollSection.classList.add("edit");
        noteList.setAttribute("data-type", "edit");
    });

    editModeDone.addEventListener("click", function() {
        uncheckAllNotes();

        editNoteSection.classList.remove('edit');
        indexScrollSection.classList.remove("edit");
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
