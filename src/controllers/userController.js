import createHttpError from "http-errors";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import {User} from "../models/user";


export const updateUserAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, "No file uploaded");
  }
  const result = await saveFileToCloudinary(req.file.buffer, );

  const updatedUser = await User.findOneAndUpdate(
    { _Sid: req.user._id },
    { avatar: result.secure_url },
    { returnDocument: 'after' },
  );
    // { new: true });
res.status(200).json({ url: updatedUser.avatar });
};
