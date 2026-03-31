import { Joi , Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import { isValidObjectId } from 'mongoose';



export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(10).default(10),
    tag: Joi.string().valid(...TAGS),
    search: Joi.string().trim().allow('').optional(),
  })
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().default(''),
    tag: Joi.string().valid(...TAGS)
  })
};

export const checkNoteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(
      (value, helpers) => {
        return isValidObjectId(value) ? value : helpers.error('any.invalid');
       }
    ).length(24).required()
  })
};

export const updateNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1),
    content: Joi.string().default(''),
    tag: Joi.string().valid(...TAGS)
  }).min(1),
 ...checkNoteIdSchema
};
