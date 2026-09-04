import Conversation from '../models/Conversation.js';
import {
  generateAIResponse,
  generateConversationTitle,
} from '../services/geminiService.js';

// @desc    Send a message and get Gemini AI response
// @route   POST /api/chat
// @access  Private
export const sendMessage = async (req, res, next) => {
  try {
    const { message, conversationId } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    let conversation = null;
    let isNewConversation = false;

    // Check if conversation exists or should create new
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        userId: req.user._id,
      });
    }

    if (!conversation) {
      isNewConversation = true;
      const initialTitle = await generateConversationTitle(message);

      conversation = new Conversation({
        userId: req.user._id,
        title: initialTitle,
        messages: [],
      });
    }

    // Append user message
    const userMsgObj = {
      role: 'user',
      content: message.trim(),
      createdAt: new Date(),
    };
    conversation.messages.push(userMsgObj);

    // Get previous messages (excluding the one just added) for conversational context
    const history = conversation.messages.slice(0, -1);

    // Call Gemini API (with safety and multi-turn context)
    const aiContent = await generateAIResponse(history, message.trim());

    // Append assistant message
    const assistantMsgObj = {
      role: 'assistant',
      content: aiContent,
      createdAt: new Date(),
    };
    conversation.messages.push(assistantMsgObj);

    // If conversation had default title and this is first turn, ensure clean title
    if (!isNewConversation && conversation.title === 'New Chat' && conversation.messages.length <= 2) {
      conversation.title = await generateConversationTitle(message);
    }

    await conversation.save();

    res.status(200).json({
      success: true,
      conversationId: conversation._id,
      title: conversation.title,
      userMessage: userMsgObj,
      assistantMessage: assistantMsgObj,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations of logged-in user
// @route   GET /api/chat/conversations
// @access  Private
export const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .select('_id title createdAt updatedAt messages')
      .sort({ updatedAt: -1 });

    // Map to lightweight summary format for sidebar performance
    const summary = conversations.map((conv) => {
      const lastMsg =
        conv.messages.length > 0
          ? conv.messages[conv.messages.length - 1].content.substring(0, 60)
          : '';
      return {
        _id: conv._id,
        title: conv.title,
        messageCount: conv.messages.length,
        lastMessagePreview: lastMsg,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      conversations: summary,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single conversation with full message history
// @route   GET /api/chat/conversations/:id
// @access  Private
export const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new empty conversation
// @route   POST /api/chat/conversations
// @access  Private
export const createConversation = async (req, res, next) => {
  try {
    const { title } = req.body;

    const conversation = await Conversation.create({
      userId: req.user._id,
      title: title && title.trim() ? title.trim() : 'New Chat',
      messages: [],
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rename conversation title
// @route   PUT /api/chat/conversations/:id
// @access  Private
export const updateConversationTitle = async (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Title is required',
      });
    }

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: title.trim() },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a conversation
// @route   DELETE /api/chat/conversations/:id
// @access  Private
export const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found or unauthorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Conversation deleted successfully',
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};
