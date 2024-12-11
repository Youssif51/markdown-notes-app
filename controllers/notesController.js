import { PrismaClient } from "@prisma/client";
import { promises as fs } from "fs";
import { marked } from "marked";
import { checkGrammar } from "../services/grammarService.js";

const prisma = new PrismaClient();

export const createNote = async (req, res) => {
  const { title, content } = req.body;
  console.log(title, content);

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const storeNotes = await prisma.note.create({
      data: { title, content },
    });

    res.status(201).json(storeNotes);
  } catch (error) {
    res.status(500).json({
      message: "Error creating notes",
      error: error.message,
    });
  }
};

export const markdownToHTML = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const convertTitle = marked(`# ${title}`, { sanitize: true });
    const convertContent = marked(content, { sanitize: true });

    res.status(201).json({ title: convertTitle, content: convertContent });
  } catch (error) {
    res.status(500).json({
      message: "Error converting notes to HTML",
      error: error.message,
    });
  }
};

export const grammarCheck = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  try {
    const editContent = await checkGrammar(content);
    if (!editContent.edits[0])
      return res
        .status(201)
        .json({ message: "you are right , there is no misspelling" });
    const description = editContent.edits[0].description;
    const sentence = `your sentence is ====> ${editContent.edits[0].sentence}`;
    const replacement = `the correct is ====> ${editContent.edits[0].replacement}`;
    res.status(200).json({ description, sentence, replacement });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while checking grammar",
      error: error.message,
    });
  }
};

export const uploadFile = async (req, res) => {
  const file = req.file;
  console.log("File received:", file);

  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required.",
    });
  }

  if (!file) {
    return res.status(400).json({ message: "File not uploaded or invalid." });
  }

  try {
    let fromFileUploaded = null;

    if (file.mimetype === "text/plain" || file.mimetype === "text/markdown") {
      try {
        const fileContent = await fs.readFile(file.path, "utf8");

        fromFileUploaded = marked(fileContent);
      } catch (readError) {
        return res.status(500).json({
          message: "Error reading file content.",
          error: readError.message,
        });
      }
    }

    const htmlTitle = marked(`# ${title}`);
    const htmlContent = marked(content);

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        fileUrl: file ? `/uploads/${file.filename}` : null,
      },
    });

    res.status(201).json({
      message: "Note with file created successfully",
      note: newNote,
      htmlTitle,
      htmlContent,
      fromFileUploaded,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading file.",
      error: error.message || error,
    });
  }
};

export const getNotes = async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notes", error });
  }
};
