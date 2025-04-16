import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatView = ({ conversation, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  // Add keyboard shortcut for going back
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Go back when pressing Escape key
      if (e.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onBack]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Here you would typically send the message to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  if (!conversation) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-[#FAF7F5]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#D4C5BE] bg-white sticky top-0 z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[#FAF7F5] transition-colors text-[#6B4D3C]"
          title="Press Esc to go back"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Messages</span>
        </button>
        <div className="flex items-center gap-3 ml-2">
          <div className="w-8 h-8 rounded-full bg-[#6B4D3C] flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {conversation.user.name[0]}
            </span>
          </div>
          <div>
            <h2 className="font-medium text-[#6B4D3C]">{conversation.user.name}</h2>
            <p className="text-xs text-[#8B7B74]">
              {conversation.user.isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.isSender ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                message.isSender
                  ? 'bg-[#6B4D3C] text-white'
                  : 'bg-white border border-[#D4C5BE]'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.isSender ? 'text-white/70' : 'text-[#8B7B74]'
              }`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form 
        onSubmit={handleSend}
        className="px-4 py-3 border-t border-[#D4C5BE] bg-white sticky bottom-0"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border border-[#D4C5BE] focus:outline-none focus:border-[#8B7B74] text-sm bg-[#FAF7F5]"
          />
          <button
            type="submit"
            className="p-2 rounded-full bg-[#6B4D3C] text-white disabled:opacity-50 hover:bg-[#5A3C2B] transition-colors"
            disabled={!newMessage.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatView;
