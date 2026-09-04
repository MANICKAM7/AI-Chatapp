import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Message({ message, userAvatar }) {
  const isAssistant = message.role === 'assistant';
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  };

  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`py-4 px-4 md:px-6 w-full flex gap-3 md:gap-4 transition-colors ${
        isAssistant
          ? 'bg-[#111217]/50 border-y border-[#1c1e27]'
          : 'bg-transparent'
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isAssistant ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Bot size={18} />
          </div>
        ) : userAvatar ? (
          <img
            src={userAvatar}
            alt="User"
            className="w-8 h-8 rounded-xl object-cover ring-1 ring-white/10"
          />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <User size={18} />
          </div>
        )}
      </div>

      {/* Message Content Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-zinc-300">
            {isAssistant ? 'NexusAI Assistant' : 'You'}
          </span>
          {formattedTime && (
            <span className="text-[10px] text-zinc-500">{formattedTime}</span>
          )}
        </div>

        {isAssistant ? (
          <div className="prose-custom text-sm md:text-base break-words">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const codeText = String(children).replace(/\n$/, '');
                  const codeId = Math.random().toString(36).substring(2, 9);

                  if (!inline && match) {
                    return (
                      <div className="relative my-3 rounded-lg overflow-hidden border border-zinc-800 bg-[#0d0e14]">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-[#171821] text-xs text-zinc-400 border-b border-zinc-800">
                          <span className="font-mono lowercase">{match[1]}</span>
                          <button
                            onClick={() => copyToClipboard(codeText, codeId)}
                            className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors py-0.5 px-1.5 rounded hover:bg-zinc-800"
                            title="Copy code"
                          >
                            {copiedCode === codeId ? (
                              <>
                                <Check size={13} className="text-emerald-400" />
                                <span className="text-emerald-400 text-[11px]">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={13} />
                                <span className="text-[11px]">Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3 text-xs md:text-sm font-mono overflow-x-auto text-zinc-200 bg-[#0c0d12]">
                          <code>{children}</code>
                        </pre>
                      </div>
                    );
                  }

                  return (
                    <code
                      className="bg-zinc-800/80 text-indigo-300 font-mono text-xs px-1.5 py-0.5 rounded"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-zinc-100 text-sm md:text-base whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        )}
      </div>
    </motion.div>
  );
}
