import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import {
  createNoteHandler,
  getAllNotesHandler,
  getSingleNoteHandler,
  updateNoteHandler,
  deleteNoteHandler,
} from '../controllers/notes.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', createNoteHandler);
router.get('/', getAllNotesHandler);
router.get('/:id', getSingleNoteHandler);
router.put('/:id', updateNoteHandler);
router.delete('/:id', deleteNoteHandler);

export default router;
