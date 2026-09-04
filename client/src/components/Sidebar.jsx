import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  MoreVertical,
  Edit2,
  Trash2,
  Check,
  X,
  Settings,
  Bot,
  ChevronLeft,
  ChevronRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({
  conversations,
  currentConvId,
  onSelectConversation,
  onNewChat,
  onRenameConversation,
  onDeleteConversation,
  isMobileOpen,
  setIsMobileOpen,
  onOpenProfile,
}) {
  const { user, logout } = useAuth();

  // Inline rename state
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // Dropdown menu state
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Delete modal state
  const [deleteModalId, setDeleteModalId] = useState(null);

  // Desktop sidebar collapse state
  const [isCollapsed, setIsCollapsed] = useState(false);

  const startEditing = (conv, e) => {
    e.stopPropagation();
    setEditingId(conv._id);
    setEditTitle(conv.title);
    setMenuOpenId(null);
  };

  const handleSaveRename = async (id, e) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      await onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const confirmDelete = async () => {
    if (deleteModalId) {
      await onDeleteConversation(deleteModalId);
      setDeleteModalId(null);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Container */}
      <motion.aside
        animate={{
          width: isCollapsed ? '72px' : '280px',
        }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className={`fixed md:relative z-50 top-0 left-0 h-full flex flex-col bg-[#111218] border-r border-[#1e2029] select-none transition-transform duration-300 md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header / Brand */}
        <div className="flex items-center justify-between p-4 border-b border-[#1c1e27] min-h-[64px]">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 flex-shrink-0">
              <Bot size={20} />
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="truncate"
              >
                <h1 className="text-base font-bold text-zinc-100 tracking-tight leading-none">
                  NexusAI
                </h1>
                <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
                  MERN + Gemini
                </span>
              </motion.div>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1c25] transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="flex md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1c25] transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              onNewChat();
              setIsMobileOpen(false);
            }}
            className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all ${
              isCollapsed ? 'justify-center px-0' : 'justify-start'
            }`}
            title="Start a new chat"
          >
            <Plus size={18} />
            {!isCollapsed && <span>New Chat</span>}
          </motion.button>
        </div>

        {/* Chat History Section */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-1.5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
              Chat History
            </div>
          )}

          {conversations.length === 0 ? (
            !isCollapsed && (
              <div className="text-center py-8 px-4 text-xs text-zinc-500">
                No chats yet. Start a new conversation!
              </div>
            )
          ) : (
            conversations.map((conv) => {
              const isActive = conv._id === currentConvId;
              const isEditing = editingId === conv._id;

              return (
                <div
                  key={conv._id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectConversation(conv._id);
                      setIsMobileOpen(false);
                    }
                  }}
                  className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1e202c] text-zinc-100 font-medium border border-indigo-500/30'
                      : 'text-zinc-400 hover:bg-[#161822] hover:text-zinc-200'
                  }`}
                  title={conv.title}
                >
                  <MessageSquare
                    size={16}
                    className={`flex-shrink-0 ${
                      isActive ? 'text-indigo-400' : 'text-zinc-500'
                    }`}
                  />

                  {!isCollapsed && (
                    <>
                      {isEditing ? (
                        <div
                          className="flex-1 flex items-center gap-1 min-w-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(conv._id, e);
                              if (e.key === 'Escape') handleCancelRename(e);
                            }}
                            autoFocus
                            className="flex-1 bg-[#0d0e14] border border-indigo-500 rounded px-2 py-0.5 text-xs text-zinc-100 focus:outline-none"
                          />
                          <button
                            onClick={(e) => handleSaveRename(conv._id, e)}
                            className="p-1 hover:text-emerald-400 text-zinc-400"
                            title="Save"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={handleCancelRename}
                            className="p-1 hover:text-rose-400 text-zinc-400"
                            title="Cancel"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <span className="flex-1 text-xs truncate">{conv.title}</span>
                      )}

                      {/* Dropdown Action Menu */}
                      {!isEditing && (
                        <div
                          className="relative flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() =>
                              setMenuOpenId(menuOpenId === conv._id ? null : conv._id)
                            }
                            className={`p-1 rounded-md transition-opacity ${
                              isActive || menuOpenId === conv._id
                                ? 'opacity-100 text-zinc-400 hover:text-zinc-200'
                                : 'opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            <MoreVertical size={14} />
                          </button>

                          {/* Popup Menu */}
                          {menuOpenId === conv._id && (
                            <div className="absolute right-0 top-6 w-28 bg-[#181924] border border-zinc-700/80 rounded-xl shadow-xl py-1 z-30">
                              <button
                                onClick={(e) => startEditing(conv, e)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-zinc-300 hover:bg-[#202230] hover:text-white transition-colors"
                              >
                                <Edit2 size={12} />
                                <span>Rename</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteModalId(conv._id);
                                  setMenuOpenId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
                              >
                                <Trash2 size={12} />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Card at Bottom */}
        <div className="p-3 border-t border-[#1c1e27] bg-[#111218]">
          <div
            onClick={onOpenProfile}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-[#181924] cursor-pointer transition-all ${
              isCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user?.avatar ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name}`
                }
                alt="Profile"
                className="w-8 h-8 rounded-xl object-cover bg-zinc-800 ring-1 ring-white/10 flex-shrink-0"
              />
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-200 truncate">
                    {user?.name || 'User'}
                  </div>
                  <div className="text-[11px] text-zinc-500 truncate">
                    {user?.email}
                  </div>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenProfile();
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                title="Profile & Settings"
              >
                <Settings size={15} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-[#161822] border border-zinc-700/80 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center gap-3 text-rose-400 mb-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <AlertTriangle size={20} />
                </div>
                <h3 className="text-base font-semibold text-zinc-100">
                  Delete Conversation?
                </h3>
              </div>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                This will permanently delete this conversation and all associated
                messages from your chat history.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteModalId(null)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/25 transition-colors"
                >
                  Delete Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
