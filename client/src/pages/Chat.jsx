import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import UserProfile from '../components/UserProfile';
import { chatAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Chat() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [currentConvId, setCurrentConvId] = useState(null);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // UI state
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      if (res.conversations) {
        setConversations(res.conversations);
      }
    } catch (err) {
      console.error('[Error fetching conversations]:', err.message);
    }
  };

  // Select existing conversation
  const handleSelectConversation = async (convId) => {
    if (convId === currentConvId) return;

    try {
      setIsLoading(true);
      setCurrentConvId(convId);
      const res = await chatAPI.getConversationById(convId);
      if (res.conversation) {
        setCurrentConversation(res.conversation);
        setMessages(res.conversation.messages || []);
      }
    } catch (err) {
      console.error('[Error loading conversation]:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to New Chat
  const handleNewChat = () => {
    setCurrentConvId(null);
    setCurrentConversation(null);
    setMessages([]);
  };

  // Send message to Gemini
  const handleSendMessage = async (messageText) => {
    if (!messageText.trim() || isLoading) return;

    // Optimistic user message for immediate smooth responsiveness
    const optimisticUserMsg = {
      role: 'user',
      content: messageText,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimisticUserMsg]);
    setIsLoading(true);

    try {
      const res = await chatAPI.sendMessage(messageText, currentConvId);

      if (res.success) {
        setCurrentConvId(res.conversationId);
        setCurrentConversation(res.conversation);

        // Replace messages with updated server truth (or append assistant message)
        setMessages(res.conversation.messages);

        // Refresh or update conversations list in sidebar
        setConversations((prev) => {
          const filtered = prev.filter((c) => c._id !== res.conversationId);
          const updatedItem = {
            _id: res.conversationId,
            title: res.title,
            messageCount: res.conversation.messages.length,
            lastMessagePreview: res.assistantMessage.content.substring(0, 60),
            updatedAt: new Date().toISOString(),
          };
          return [updatedItem, ...filtered];
        });
      }
    } catch (err) {
      console.error('[Error sending message]:', err.message);

      // Append helpful error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **Error communicating with AI**: ${err.message || 'Something went wrong. Please check your network and try again.'}`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Rename conversation title
  const handleRenameConversation = async (convId, newTitle) => {
    try {
      const res = await chatAPI.updateConversationTitle(convId, newTitle);
      if (res.success) {
        setConversations((prev) =>
          prev.map((c) => (c._id === convId ? { ...c, title: newTitle } : c))
        );

        if (currentConvId === convId && currentConversation) {
          setCurrentConversation((prev) => ({ ...prev, title: newTitle }));
        }
      }
    } catch (err) {
      console.error('[Error renaming conversation]:', err.message);
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (convId) => {
    try {
      const res = await chatAPI.deleteConversation(convId);
      if (res.success) {
        setConversations((prev) => prev.filter((c) => c._id !== convId));

        if (currentConvId === convId) {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('[Error deleting conversation]:', err.message);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0d0e12] overflow-hidden">
      {/* Left Sidebar */}
      <Sidebar
        conversations={conversations}
        currentConvId={currentConvId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onRenameConversation={handleRenameConversation}
        onDeleteConversation={handleDeleteConversation}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Chat Area */}
      <ChatWindow
        conversation={currentConversation}
        messages={messages}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onNewChat={handleNewChat}
        onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
        userAvatar={user?.avatar}
      />

      {/* User Profile / Settings Modal */}
      <UserProfile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
