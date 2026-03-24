import  {HttpError} from "http-errors";
// import { error } from "node:console";


export const errorHandler =(err, req, res, next) => {
if (err instanceof HttpError){
  return res.status(err.status).json({ message: err.message ||err.name });
}


const isProd = process.env.NODE_ENV === 'production';
  res.status(500).json({
    message:  isProd ?  "some problem" : err.message, });
};
