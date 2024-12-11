import express from "express";
export const router = express.Router();
import {
  getNotes,
  uploadFile,
  createNote,
  markdownToHTML,
  grammarCheck,
} from "../controllers/notesController.js";
import { upload } from "../middlewares/fileUpload.js";

router.post("/notes", createNote);
router.post("/notes/render", markdownToHTML);
router.post("/notes/check-grammar", grammarCheck);
router.post("/notes/upload", upload.single("file"), uploadFile);
router.get("/notes", getNotes);
