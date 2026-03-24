import Note from "../models/note.js";
import createHttpError from "http-errors";

export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json({ message: "Retrieved all notes", data: notes });
};

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
