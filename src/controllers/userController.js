import createHttpError from "http-errors";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary";
import {User} from "../models/user";


export const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw createHttpError(400, "No file uploaded");
  }
  const result = await saveFileToCloudinary(req.file.buffer, req.user._id);

  const updatedUser = await User.findOneAndUpdate(
    { id: req.user._id },
    { avatar: result.secure_url },
    { returnDocument: 'after' },
  );
    // { new: true });
res.status(200).json({ url: updatedUser.avatar });
};
