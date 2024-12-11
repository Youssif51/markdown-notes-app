import express from "express";
import { router } from "./routes/notes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/upload", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("markdown notes app runing...");
});

app.use("/api", router);

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
