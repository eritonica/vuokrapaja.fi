import fs from 'fs';
import express from "express";
import sessions from "./sessions.js";

import sanitize from "sanitize-filename";

const router = express.Router();

// DELETE /files
// headers: { token: <token> }
// body: { filename: <filename> }
router.delete("/files", async (req, res) => {
  sessions.checkSession(req, res, async () => {
    try {
      const filename = sanitize(req.body.filename);
      fs.unlinkSync(filename);
      res.status(200).json({ message: "File " + req.body.filename + " deleted successfully." });
    } catch(err) {
      console.error(err);
      res.status(500).json({ message: "File could not be deleted.", error: err });
    }
  });
});

export default { router };
