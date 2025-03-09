"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const Note_1 = require("./models/Note");
const errors_1 = require("./errors");
const app = (0, express_1.default)();
const port = 3000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Connect to MongoDB
const mongoURI = 'mongodb+srv://oyiohachinedujude:<qFs6vZ9N4Byp0akt@cluster0.v1baz.mongodb.net/notesdb?retryWrites=true&w=majority&appName=Cluster0';
mongoose_1.default.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
// Routes
app.get('/api/notes', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notes = yield Note_1.Note.find();
        res.json(notes);
    }
    catch (err) {
        next(err);
    }
}));
app.get('/api/notes/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note_1.Note.findById(req.params.id);
        if (!note)
            throw new errors_1.NotFoundError('Note not found');
        res.json(note);
    }
    catch (err) {
        next(err);
    }
}));
app.post('/api/notes', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, content } = req.body;
        if (!title || !content)
            throw new errors_1.ValidationError('Title and content are required');
        const newNote = new Note_1.Note({ title, content });
        yield newNote.save();
        res.status(201).json(newNote);
    }
    catch (err) {
        next(err);
    }
}));
app.delete('/api/notes/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const note = yield Note_1.Note.findByIdAndDelete(req.params.id);
        if (!note)
            throw new errors_1.NotFoundError('Note not found');
        res.json({ message: 'Note deleted' });
    }
    catch (err) {
        next(err);
    }
}));
// Global error handler
app.use((err, req, res, next) => {
    if (err instanceof errors_1.NotFoundError) {
        res.status(404).json({ message: err.message });
    }
    else if (err instanceof errors_1.ValidationError) {
        res.status(400).json({ message: err.message });
    }
    else {
        res.status(500).json({ message: 'Something went wrong' });
    }
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
