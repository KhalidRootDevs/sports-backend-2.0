import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import { createContactUs, deleteContactUs, getAllContactUs, getOneContactUs } from './controller';

const router = Router();

// Create a new contact us entry
router.post('/contact-us', authenticate, createContactUs);

// Get all contact us entries
router.get('/contact-us', getAllContactUs);

// Get a single contact us entry by ID
router.get('/contact-us/:id', getOneContactUs);

// Delete a contact us entry by ID
router.delete('/contact-us/:id', deleteContactUs);

export default router;
