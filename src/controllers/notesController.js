// import { title } from "node:process";
import Note from "../models/note.js";
import createHttpError from "http-errors";
// import { TAGS } from "../constants/tags.js";

export const getAllNotes = async (req, res) => {
  const { page=1, perPage=10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

  const notesQuery = Note.find();
  if (tag) {
    notesQuery.where({ tag }).equals(tag) ;
  }
  if (search) {
    notesQuery.where({
      title: { $regex: search, $options: "i" },
      content: { $regex: search, $options: "i" },
    });
  }

// notesQuery.where({ $text: { $search: search } });

  const [notes, totalNotes] = await Promise.all([
    notesQuery.clone.countDocuments(),
    notesQuery.skip(skip).limit(perPage),
  ]);
  // const notes = await Note.find().skip(skip).limit(perPage);
  // const totalNotes = await Note.find().countDocuments();
  const totalPages = Math.ceil(totalNotes / perPage);
  res.status(200).json({
    page,
    perPage,
    totalPages,
    notes,
   totalNotes
  });
};
//  message: "Retrieved all notes", data: notes
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);
  if (!note) {
    throw createHttpError(404, "Note not found");
  }
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}`, data: note });
};

export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json({ message: "Note created successfully", data: note });
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({ _id: noteId });
  if (!note) {
    throw createHttpError(404, "Note not found");
  }
  res.status(200).json({ message: `Deleted note with ID: ${noteId}`, data: note });
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate(
    { _id: noteId },
    req.body,
    { returnDocument: "after" }
  );
  if (!note) {
    throw createHttpError(404, "Note not found");
  }
  res.status(200).json({ message: `Updated note with ID: ${noteId}`, data: note });
};
