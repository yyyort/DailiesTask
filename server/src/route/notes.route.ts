import { Router } from "express";
import { authValidator } from "../middleware/authValidator";
import { notesDeleteController, notesGetAllController, notesGetAllGroups, notesGetController, notesPostController, notesPutController, notesPutGroupController, notesPutPinnedController } from "../controller/notes.controller";
import { schemaValidator } from "../middleware/schemaValidator";
import { NoteCreateSchema, NoteUpdateSchema } from "../model/notes.model";

const router = Router();

router.get("/notes", authValidator, notesGetAllController);
router.get("/notes/:id", authValidator, notesGetController);
router.get("/notes/groups", authValidator, notesGetAllGroups);
router.post("/notes", authValidator, schemaValidator(NoteCreateSchema), notesPostController);
router.put("/notes/:id", authValidator, schemaValidator(NoteUpdateSchema), notesPutController);
router.patch("/notes/:id/pinned", authValidator, notesPutPinnedController);
router.patch("/notes/:id/group", authValidator, notesPutGroupController);
router.delete("/notes/:id", authValidator, notesDeleteController);

export default router;