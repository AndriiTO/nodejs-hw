import {Router } from "express";
import { getAllNotes, getNoteById , createNote , deleteNote ,updateNote } from "../controllers/notesController.js";
import { celebrate } from "celebrate";
import { createNoteSchema, checkNoteIdSchema, updateNoteSchema, getAllNotesSchema } from "../validations/notesValidation.js";

const router = Router();
// localhost.get/notes
router.get('/notes', celebrate(getAllNotesSchema), getAllNotes);


// GET /notes/:noteId
router.get('/notes/:noteId', celebrate(checkNoteIdSchema), getNoteById);

router.post('/notes', celebrate(createNoteSchema), createNote);

router.delete('/notes/:noteId',celebrate(checkNoteIdSchema),  deleteNote);

router.patch('/notes/:noteId', celebrate(updateNoteSchema), updateNote);
export default router;


