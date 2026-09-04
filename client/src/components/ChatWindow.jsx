import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Menu,
  Plus,
  Bot,
  Sparkles,
  ArrowDown,
  Code2,
  Cpu,
  Layers,
  HelpCircle,
} from 'lucide-react';
import Message from './Message';
import ChatInput from './ChatInput';

export default function ChatWindow({
  conversation,
  messages,
  isLoading,
  onSendMessage,
  onNewChat,
  onToggleSidebar,
  userAvatar,
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll to bottom whenever messages or loading state changes
  const scrollToBottom = (behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Track scroll position to show/hide "Scroll to bottom" floating button
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        scrollContainerRef.current;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 150;
      setShowScrollBottom(isScrolledUp);
    }
  };

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handlePromptSuggestion = (promptText) => {
    onSendMessage(promptText);
  };

  const suggestionCards = [
    {
      title: 'Explain React',
      desc: 'Component lifecycle, hooks, and Virtual DOM concepts',
      icon: <Layers size={18} className="text-cyan-400" />,
      prompt: 'Explain React. What is it, how does the Virtual DOM work, and what are its key advantages?',
    },
    {
      title: 'Explain JavaScript',
      desc: 'Closures, Event Loop, and Asynchronous patterns',
      icon: <Code2 size={18} className="text-amber-400" />,
      prompt: 'Explain JavaScript closures with real-world code examples and why they are useful.',
    },
    {
      title: 'Help me with MERN',
      desc: 'Connect React frontend with Express & MongoDB',
      icon: <Cpu size={18} className="text-emerald-400" />,
      prompt: 'Help me with MERN stack development: explain best practices for connecting React to Express and MongoDB.',
    },
    {
      title: 'Generate interview questions',
      desc: 'Senior full-stack MERN interview questions & answers',
      icon: <HelpCircle size={18} className="text-purple-400" />,
      prompt: 'Generate 5 high-frequency MERN stack technical interview questions with concise, high-impact answers.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0e12] overflow-hidden relative">
      {/* Top Header */}
      <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-[#1c1e27] bg-[#111218]/90 backdrop-blur-md z-10 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-[#1c1e27] transition-colors"
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="text-sm md:text-base font-semibold text-zinc-100 truncate">
              {conversation?.title || 'New Chat'}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>Gemini Pro & Flash Ready</span>
            </div>
          </div>
        </div>

        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1c27] hover:bg-[#232635] text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/60 transition-colors shadow-sm"
          title="Start a new chat"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </header>

      {/* Messages Scroll Area */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col"
      >
        {messages.length === 0 ? (
          /* Empty / Welcome State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-2xl mx-auto w-full">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 mb-4"
            >
              <Bot size={30} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-zinc-100 tracking-tight mb-2"
            >
              AI Chat Assistant
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="text-sm md:text-base text-zinc-400 mb-8"
            >
              Hello! How can I help you today?
            </motion.p>

            {/* Suggestion prompt cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
              {suggestionCards.map((card, idx) => (
                <motion.button
                  key={card.title}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.06, duration: 0.25 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePromptSuggestion(card.prompt)}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#141620] hover:bg-[#1a1c2a] border border-zinc-800/80 hover:border-indigo-500/40 text-left transition-all group"
                >
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-indigo-500/30 transition-colors">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-xs md:text-sm font-semibold text-zinc-200 group-hover:text-indigo-300 transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                      {card.desc}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          /* Message List */
          <div className="flex-1 w-full max-w-4xl mx-auto py-4">
            {messages.map((msg, index) => (
              <Message
                key={msg._id || `${msg.role}-${index}`}
                message={msg}
                userAvatar={userAvatar}
              />
            ))}

            {/* Live Typing / Generating indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-4 px-4 md:px-6 w-full flex gap-3 md:gap-4 bg-[#111217]/50 border-y border-[#1c1e27]"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 flex-shrink-0 mt-0.5">
                  <Bot size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-zinc-300 mb-2">
                    NexusAI Assistant
                  </div>
                  <div className="flex items-center gap-1.5 py-1 text-indigo-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                    <span className="text-xs text-zinc-400 ml-2 font-mono">
                      Generating answer...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => scrollToBottom('smooth')}
          className="absolute right-6 bottom-28 p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 z-20 transition-transform"
          title="Scroll to latest message"
        >
          <ArrowDown size={18} />
        </motion.button>
      )}

      {/* Chat Input Bar */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        isLoading={isLoading}
      />
    </div>
  );
}
