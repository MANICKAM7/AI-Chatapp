import React, { useRef, useEffect } from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatInput({ input, setInput, onSend, isLoading }) {
  const textareaRef = useRef(null);

  // Auto-resize textarea according to scroll height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        180
      )}px`;
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        onSend();
      }
    }
  };

  const isButtonDisabled = !input.trim() || isLoading;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4 md:pb-6">
      <div className="relative flex flex-col bg-[#14161f] border border-zinc-700/60 rounded-2xl shadow-xl shadow-black/40 focus-within:border-indigo-500/80 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all duration-200">
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message AI Assistant... (Shift + Enter for new line)"
          disabled={isLoading}
          className="w-full bg-transparent text-zinc-100 placeholder-zinc-500 text-sm md:text-base px-4 py-3.5 pr-14 focus:outline-none resize-none max-h-44 overflow-y-auto leading-relaxed"
        />

        <div className="flex items-center justify-between px-3 pb-2 pt-1 text-xs text-zinc-500">
          <span className="flex items-center gap-1 text-[11px] text-zinc-500/80">
            <Sparkles size={11} className="text-indigo-400" />
            Gemini 1.5 Flash Model
          </span>

          <motion.button
            whileHover={!isButtonDisabled ? { scale: 1.05 } : {}}
            whileTap={!isButtonDisabled ? { scale: 0.95 } : {}}
            onClick={onSend}
            disabled={isButtonDisabled}
            className={`p-2 rounded-xl flex items-center justify-center transition-all duration-200 ${
              isButtonDisabled
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
            title="Send message (Enter)"
          >
            <ArrowUp size={16} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
      <p className="text-center text-[11px] text-zinc-600 mt-2">
        NexusAI can produce unexpected results. Always verify critical information.
      </p>
    </div>
  );
}
