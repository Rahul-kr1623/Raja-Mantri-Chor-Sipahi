import React, { useState, useRef, useEffect } from 'react';
import { useRoomStore } from '../../store/roomStore';
import { usePlayerStore } from '../../store/playerStore';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send } from 'lucide-react';
import { ChatMessage } from '../../types';

export const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const room = useRoomStore(state => state.room);
  const playerId = usePlayerStore(state => state.playerId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = room?.chatMessages || [];
  const players = room?.players || {};

  const [unreadCount, setUnreadCount] = useState(0);
  const prevMessagesLength = useRef(messages.length);

  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      if (!isOpen) {
        setUnreadCount(prev => prev + (messages.length - prevMessagesLength.current));
      }
    }
    prevMessagesLength.current = messages.length;
  }, [messages.length, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !playerId) return;

    useRoomStore.getState().dispatchAction({ type: 'SEND_CHAT', text: text.trim() });
    setText('');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-14 h-14 flex items-center justify-center rounded-full bg-[var(--color-heritage-saffron)] text-white shadow-[var(--shadow-tactile-lg)] hover:-translate-y-1 transition-transform tactile-border"
      >
        <MessageSquare size={24} />
        <AnimatePresence>
          {unreadCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[var(--color-heritage-indigo)]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-20 right-4 left-4 sm:left-auto z-50 sm:w-80 h-[50vh] sm:h-96 flex flex-col bg-[var(--color-heritage-paper)] shadow-2xl rounded-sm tactile-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[var(--color-heritage-indigo)] text-white p-3 flex justify-between items-center">
              <span className="font-bold tracking-widest uppercase text-sm">Table Chat</span>
              <button onClick={() => setIsOpen(false)} className="hover:text-[var(--color-heritage-saffron)] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-white/50">
              {messages.length === 0 ? (
                <p className="text-center text-[var(--color-heritage-indigo)] opacity-50 text-sm mt-4 font-medium">No messages yet. Say hello!</p>
              ) : (
                messages.map(msg => {
                  const isMe = msg.playerId === playerId;
                  const sender = players[msg.playerId];
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-bold text-[var(--color-heritage-indigo)] opacity-60 mb-0.5">
                        {sender ? sender.name : 'Unknown'}
                      </span>
                      <div className={`px-3 py-2 rounded-sm max-w-[85%] ${
                        isMe 
                          ? 'bg-[var(--color-heritage-saffron)] text-white' 
                          : 'bg-[var(--color-heritage-paper-dark)] text-[var(--color-heritage-indigo)] border border-[var(--color-heritage-indigo)]'
                      }`}>
                        <p className="text-sm font-medium">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t-2 border-[var(--color-heritage-indigo)] flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[var(--color-heritage-paper-dark)] px-3 py-2 rounded-sm text-sm border border-[var(--color-heritage-indigo)] focus:outline-none focus:border-[var(--color-heritage-saffron)] text-[var(--color-heritage-indigo)] font-medium"
              />
              <button 
                type="submit"
                disabled={!text.trim()}
                className="p-2 bg-[var(--color-heritage-indigo)] text-white rounded-sm disabled:opacity-50 hover:bg-[var(--color-heritage-saffron)] transition-colors tactile-border"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
