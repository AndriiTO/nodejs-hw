// title — обов’язковий рядок, з параметром trim: true
// content — необов’язковий рядок (за замовчуванням порожній), з параметром trim: true
// tag — приймає одне із фіксованих значень (Work, Personal, Meeting, Shopping, Ideas, Travel, Finance, Health, Important, Todo). Необов’язковий рядок (за замовчуванням Todo)

import { Schema, model} from "mongoose";
import { TAGS } from "../constants/tags.js";

const noteSchema = new Schema({
  userId : { type: Schema.Types.ObjectId, required: true, ref: "User" },
  title : { type: String, required: true, trim: true },
  content : { type: String, default: "", trim: true },
  tag : { type: String, enum: TAGS, default: "Todo" },
},
{
  timestamps: true,
}
);
noteSchema.index({ title: "text", content: "text" });
const Note = model("Note", noteSchema);



export default Note;
