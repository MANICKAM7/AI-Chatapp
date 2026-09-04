import express from 'express';
import {
  sendMessage,
  getConversations,
  getConversationById,
  createConversation,
  updateConversationTitle,
  deleteConversation,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, createConversation);
router.get('/conversations/:id', protect, getConversationById);
router.put('/conversations/:id', protect, updateConversationTitle);
router.delete('/conversations/:id', protect, deleteConversation);

export default router;
