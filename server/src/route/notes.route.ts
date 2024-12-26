import { Router } from "express";
import { authValidator } from "../middleware/authValidator";
import { notesDeleteController, notesGetAllController, notesGetAllGroups, notesGetAllPinnedController, notesGetController, notesPostController, notesPutController, notesPutPinnedController } from "../controller/notes.controller";
import { schemaValidator } from "../middleware/schemaValidator";
import { NoteCreateSchema, NoteUpdateSchema } from "../model/notes.model";

const router = Router();

router.post("/notes", authValidator, schemaValidator(NoteCreateSchema), notesPostController);

router.get("/notes", authValidator, notesGetAllController);
router.get("/notes/groups", authValidator, notesGetAllGroups);
router.get("/notes/pinned", authValidator, notesGetAllPinnedController);
router.get("/notes/:id", authValidator, notesGetController);

router.put("/notes/:id", authValidator, schemaValidator(NoteUpdateSchema), notesPutController);

router.patch("/notes/:id/pinned", authValidator, notesPutPinnedController);

router.delete("/notes/:id", authValidator, notesDeleteController);

export default router;