// title — обов’язковий рядок, з параметром trim: true
// content — необов’язковий рядок (за замовчуванням порожній), з параметром trim: true
// tag — приймає одне із фіксованих значень (Work, Personal, Meeting, Shopping, Ideas, Travel, Finance, Health, Important, Todo). Необов’язковий рядок (за замовчуванням Todo)

import { Schema, model} from "mongoose";


const noteSchema = new Schema({
  title : { type: String, required: true, trim: true },
  content : { type: String, default: "", trim: true },
  tag : { type: String, enum: ["Work", "Personal", "Meeting", "Shopping", "Ideas", "Travel", "Finance", "Health", "Important", "Todo"], default: "Todo" },
},
{
  timestamps: true,
}
);
const Note = model("Note", noteSchema);

export default Note;
