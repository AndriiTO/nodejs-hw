import {Router } from "express";
import { getAllNotes, getNoteById , createNote , deleteNote ,updateNote } from "../controllers/notesControllers.js";

const router = Router();
// localhost.get/notes
router.get('/notes', getAllNotes);


// GET /notes/:noteId
router.get('/notes/:noteId', getNoteById);

router.post('/notes', createNote);

router.delete('/notes/:noteId', deleteNote);

router.patch('/notes/:noteId', updateNote);
export default router;


