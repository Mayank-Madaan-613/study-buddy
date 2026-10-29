import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icons } from '../components/Icons';
import { useStudy } from '../context/StudyContext';
import { sendStudyBotMessage } from '../services/gemini';

// Non-lossy, complete Markdown renderer that preserves 100% of the text
const FormattedText = ({ text }) => {
  if (!text) return null;

  const renderInline = (str) => {
    const parts = [];
    let keyIdx = 0;
    const regex = /(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={keyIdx++} className="font-bold text-white">
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code key={keyIdx++} className="bg-slate-900/90 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono border border-slate-700/60">
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith('*') && token.endsWith('*')) {
        parts.push(
          <em key={keyIdx++} className="italic text-slate-300">
            {token.slice(1, -1)}
          </em>
        );
      }
      lastIndex = match.index + token.length;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : str;
  };

  // Parse lines into structured blocks without dropping ANY line
  const lines = text.split('\n');
  const blocks = [];
  let currentCode = null;
  let codeLang = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Fenced code block detection
    if (line.trim().startsWith('```')) {
      if (currentCode !== null) {
        blocks.push({ type: 'code', content: currentCode.join('\n'), lang: codeLang });
        currentCode = null;
      } else {
        currentCode = [];
        codeLang = line.trim().slice(3).trim();
      }
      continue;
    }

    if (currentCode !== null) {
      currentCode.push(line);
      continue;
    }

    const trimmed = line.trim();

    if (!trimmed) {
      blocks.push({ type: 'break' });
      continue;
    }

    // Headers
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', content: trimmed.slice(4) });
    } else if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', content: trimmed.slice(3) });
    } else if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'h1', content: trimmed.slice(2) });
    } 
    // Bullet list items
    else if (/^[-*]\s+/.test(trimmed)) {
      blocks.push({ type: 'bullet', content: trimmed.replace(/^[-*]\s+/, '') });
    } 
    // Numbered list items
    else if (/^\d+\.\s+/.test(trimmed)) {
      const match = trimmed.match(/^(\d+)\.\s+(.*)$/);
      blocks.push({ 
        type: 'numbered', 
        num: match ? match[1] : '•', 
        content: match ? match[2] : trimmed 
      });
    } 
    // Standard paragraphs & explanations
    else {
      blocks.push({ type: 'p', content: line });
    }
  }

  // Handle unclosed code block if response was long
  if (currentCode !== null) {
    blocks.push({ type: 'code', content: currentCode.join('\n'), lang: codeLang });
  }

  return (
    <div className="space-y-2 text-sm sm:text-base leading-relaxed break-words">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'code':
            return (
              <pre key={idx} className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-xl font-mono text-xs text-indigo-200 overflow-x-auto my-2.5">
                <code>{block.content}</code>
              </pre>
            );
          case 'h1':
            return (
              <h1 key={idx} className="text-xl font-black text-white mt-3 mb-1">
                {renderInline(block.content)}
              </h1>
            );
          case 'h2':
            return (
              <h2 key={idx} className="text-lg font-bold text-white mt-2.5 mb-1">
                {renderInline(block.content)}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={idx} className="text-base font-bold text-indigo-300 mt-2 mb-0.5">
                {renderInline(block.content)}
              </h3>
            );
          case 'bullet':
            return (
              <div key={idx} className="flex items-start gap-2.5 my-1 pl-1">
                <span className="text-indigo-400 mt-1 select-none font-bold text-xs">•</span>
                <div className="flex-1 text-slate-200">{renderInline(block.content)}</div>
              </div>
            );
          case 'numbered':
            return (
              <div key={idx} className="flex items-start gap-2.5 my-1.5 pl-1">
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 mt-0.5">
                  {block.num}
                </span>
                <div className="flex-1 text-slate-200">{renderInline(block.content)}</div>
              </div>
            );
          case 'break':
            return <div key={idx} className="h-1.5" />;
          case 'p':
          default:
            return (
              <p key={idx} className="text-slate-200">
                {renderInline(block.content)}
              </p>
            );
        }
      })}
    </div>
  );
};

const DEFAULT_MESSAGES = [
  { 
    role: 'assistant', 
    text: "Hello! I am **StudyBot**, your real AI tutor powered by Gemini. 🎓\n\nI can help break down complex subjects, build revision timetables, suggest active recall flashcards, or write code examples. What topic are you working on today?" 
  }
];

const STUDY_TOOLS = [
  { label: "🎯 Quiz Me", prompt: "Quiz me with 3 active recall questions on: " },
  { label: "💡 Explain Like I'm 12", prompt: "Explain this concept in simple terms with a real-world analogy: " },
  { label: "📅 7-Day Study Plan", prompt: "Create a 7-day revision schedule with daily Pomodoro sessions for: " },
  { label: "📝 Key Summary", prompt: "Summarize the core takeaways and formulas for: " },
];

const ChatView = () => {
  const { addToast } = useStudy();

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('study_buddy_chat_messages');
    return saved ? JSON.parse(saved) : DEFAULT_MESSAGES;
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    localStorage.setItem('study_buddy_chat_messages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend.trim();
    if (!text || isTyping) return;

    cancelRef.current = false;
    const userMessage = { role: 'user', text };
    const historySnapshot = [...messages];
    
    // Add user message to UI
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Call Gemini API
      const result = await sendStudyBotMessage(historySnapshot, text);
      
      if (!cancelRef.current) {
        setMessages(prev => [...prev, { role: 'assistant', text: result.text }]);
      }
    } catch (err) {
      if (!cancelRef.current) {
        setMessages(prev => [
          ...prev, 
          { 
            role: 'assistant', 
            text: "⚠️ An unexpected connection error occurred. Please try again." 
          }
        ]);
      }
    } finally {
      setIsTyping(false);
    }
  };

  const handleStop = () => {
    cancelRef.current = true;
    setIsTyping(false);
    addToast("Response cancelled", "info");
  };

  const handleSend = (e) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleToolClick = (toolPrompt) => {
    setInput(toolPrompt);
    inputRef.current?.focus();
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    addToast("Copied to clipboard", "info");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([
      { 
        role: 'assistant', 
        text: "Chat cleared! 🧹 Ready for our next study topic. What would you like to learn?" 
      }
    ]);
    setShowClearConfirm(false);
    addToast("Chat history cleared", "info");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] max-w-4xl mx-auto pb-4 pt-1 overflow-hidden relative">
      {/* Chat Header */}
      <header className="mb-3 flex shrink-0 items-center justify-between glass-panel p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Icons.Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              StudyBot AI
              <span className="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Gemini Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">Real-time study tutor & concept clarifier</p>
          </div>
        </div>

        <button 
          onClick={() => setShowClearConfirm(true)}
          className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-xl transition-all border border-slate-700/60"
          title="Clear Conversation"
        >
          <Icons.Refresh className="w-4 h-4" />
        </button>
      </header>

      {/* Interactive Study Utility Presets */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-1 no-scrollbar shrink-0">
        {STUDY_TOOLS.map((tool, idx) => (
          <button
            key={idx}
            onClick={() => handleToolClick(tool.prompt)}
            className="px-3 py-1.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 hover:border-indigo-400/50 text-xs font-semibold text-indigo-300 hover:text-white transition-all whitespace-nowrap shrink-0 shadow-sm flex items-center gap-1.5"
          >
            {tool.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto w-full px-2 space-y-5 flex flex-col no-scrollbar">
        {messages.map((msg, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25 }}
            key={i} 
            className={`flex group ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0 mr-3 mt-1 border border-indigo-500/25">
                <Icons.Sparkles className="w-4 h-4 text-indigo-400" />
              </div>
            )}

            <div className={`relative max-w-[85%] sm:max-w-[78%] p-4 sm:p-5 shadow-lg ${
              msg.role === 'user' 
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl rounded-tr-sm border border-indigo-500/30 shadow-indigo-600/15' 
                : 'glass-panel bg-slate-900/75 border border-slate-800 text-slate-200 rounded-2xl rounded-tl-sm'
            }`}>
              <FormattedText text={msg.text} />

              {/* Copy message button */}
              {msg.role === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-indigo-400">StudyBot • Gemini</span>
                  <button
                    onClick={() => copyToClipboard(msg.text, i)}
                    className="hover:text-indigo-300 transition-colors flex items-center gap-1 text-[11px]"
                    title="Copy message"
                  >
                    {copiedIndex === i ? (
                      <>
                        <Icons.Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Icons.Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator with Cancel button */}
        {isTyping && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0 border border-indigo-500/25">
              <Icons.Sparkles className="w-4 h-4 text-indigo-400 animate-spin" />
            </div>
            <div className="glass-panel px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-800 flex items-center gap-3 shadow-md">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span className="text-xs text-slate-400">Generating with Gemini...</span>
              <button 
                onClick={handleStop}
                className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 ml-2 px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              >
                Stop
              </button>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="shrink-0 relative mx-1 mt-2">
        <input 
          ref={inputRef}
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask StudyBot to explain, quiz, summarize, or plan..." 
          className="w-full bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-white rounded-2xl pl-5 pr-14 py-4 text-sm sm:text-base focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-xl placeholder-slate-500"
        />
        <button 
          type="submit"
          disabled={!input.trim() || isTyping}
          className={`absolute right-2.5 top-2.5 bottom-2.5 w-11 flex items-center justify-center rounded-xl transition-all shadow-md ${
            input.trim() && !isTyping 
              ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-indigo-500/25 cursor-pointer' 
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Icons.Send className="w-5 h-5 ml-0.5" />
        </button>
      </form>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-panel w-full max-w-sm p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative"
            >
              <h3 className="text-lg font-bold text-white mb-2">Clear chat history?</h3>
              <p className="text-slate-400 text-sm mb-6">
                This will reset the conversation with StudyBot.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearChat}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30"
                >
                  Clear Chat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatView;
