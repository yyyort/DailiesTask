import { Router } from "express";
import { authValidator } from "../middleware/authValidator";
import { notesDeleteController, notesDeleteGroupController, notesGetAllController, notesGetAllGroups, notesGetAllPinnedController, notesGetController, notesPostController, notesPostGroupController, notesPutController, notesPutPinnedController } from "../controller/notes.controller";
import { schemaValidator } from "../middleware/schemaValidator";
import { NoteCreateSchema, NoteUpdateSchema } from "../model/notes.model";

const router = Router();

router.post("/notes", authValidator, schemaValidator(NoteCreateSchema), notesPostController);
router.post("/notes/groups", authValidator, notesPostGroupController);

router.get("/notes", authValidator, notesGetAllController);
router.get("/notes/groups", authValidator, notesGetAllGroups);
router.get("/notes/pinned", authValidator, notesGetAllPinnedController);
router.get("/notes/:id", authValidator, notesGetController);

router.put("/notes/:id", authValidator, schemaValidator(NoteUpdateSchema), notesPutController);

router.patch("/notes/:id/pinned", authValidator, notesPutPinnedController);

router.delete("/notes/:id", authValidator, notesDeleteController);
router.delete("/notes/groups/:name", authValidator, notesDeleteGroupController);

export default router;