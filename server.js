const fs = require('fs');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    const dbNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    res.json(dbNotes);
});

app.post('/api/notes', (req, res) => {
    const body = { ...req.body };
    const dbNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    body.id = uuidv4();

    fs.writeFileSync('./db/db.json', JSON.stringify(dbNotes.concat(body)), 'utf-8');
    res.send(body);
});

app.delete('/api/notes/:id', (req, res) => {
    const { id } = req.params;
    const dbNotes = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8'));
    const filteredNotes = dbNotes.filter((note) => note.id !== id);
    fs.writeFileSync('./db/db.json', JSON.stringify(filteredNotes), 'utf-8');
    res.send("Deleted");
});

app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));