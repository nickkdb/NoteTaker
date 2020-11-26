const express= require("express");
const path= require("path");
const fs= require("fs");

const app= express();
const PORT= process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let savedNotes= fs.readFileSync(path.join(__dirname, "/db/db.json"));
savedNotes= JSON.parse(savedNotes);
if (savedNotes.length > 0) {
for (let i = 0; i < savedNotes.length; i++) {
    savedNotes[i].id = (i + 1);
}
    } else {
        savedNotes = [];
    }
console.log(savedNotes);


app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/api/notes", (req,res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

app.post("/api/notes", (req,res) => {
var newNote= req.body;
if (savedNotes.length < 1) {
savedNotes.push(newNote);
} else {
    var lastIndex= (savedNotes.length - 1);
    newNote.id = (savedNotes[lastIndex].id + 1);
    console.log(newNote);
    savedNotes.push(newNote);
}
fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(savedNotes), (err) => 
err ? console.error(err) : console.log("success!"));
res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.delete("/api/notes/:id", (req, res) => {
var selectedId= req.params.id;
console.log(selectedId);
for (let i = 0; i < savedNotes.length; i++) {
    if (selectedId == savedNotes[i].id) {
        savedNotes.splice(i, 1);
    }
}
for (let i = 0; i < savedNotes.length; i++) {
    savedNotes[i].id = (i + 1);
}
fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(savedNotes), (err) => 
err ? console.error(err) : console.log("success!"));
res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});




app.listen(PORT, function() {
    // Log (server-side) when our server has started
    console.log("Server listening on: http://localhost:" + PORT);
  });