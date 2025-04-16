import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ChatView from './ChatView';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample conversations data
  const conversations = [
    {
      id: 1,
      user: {
        name: 'Sarah',
        isOnline: true
      },
      lastMessage: {
        content: 'The Way of Kings is amazing! Have you read...',
        time: '10:30 AM',
        unread: true
      },
      messages: [
        {
          content: 'Hey! Have you read The Way of Kings?',
          time: '10:15 AM',
          isSender: false
        },
        {
          content: 'Not yet, but I\'ve heard great things about it!',
          time: '10:20 AM',
          isSender: true
        },
        {
          content: 'The Way of Kings is amazing! Have you read any other Brandon Sanderson books?',
          time: '10:30 AM',
          isSender: false
        }
      ]
    },
    {
      id: 2,
      user: {
        name: 'Alex',
        isOnline: false
      },
      lastMessage: {
        content: 'Project Hail Mary was such a fun read...',
        time: 'Yesterday',
        unread: false
      },
      messages: [
        {
          content: 'Have you read Project Hail Mary?',
          time: 'Yesterday',
          isSender: false
        },
        {
          content: 'Yes! Andy Weir did it again!',
          time: 'Yesterday',
          isSender: true
        },
        {
          content: 'Project Hail Mary was such a fun read, I loved the science aspects',
          time: 'Yesterday',
          isSender: false
        }
      ]
    },
    {
      id: 3,
      user: {
        name: 'Emma',
        isOnline: true
      },
      lastMessage: {
        content: 'Shadow of the Gods had the best world...',
        time: '2 days ago',
        unread: false
      },
      messages: [
        {
          content: 'What did you think of Shadow of the Gods?',
          time: '2 days ago',
          isSender: false
        },
        {
          content: 'The Norse mythology elements were fantastic',
          time: '2 days ago',
          isSender: true
        },
        {
          content: 'Shadow of the Gods had the best world-building I\'ve seen in a while',
          time: '2 days ago',
          isSender: false
        }
      ]
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedChat) {
    return (
      <ChatView
        conversation={conversations.find(c => c.id === selectedChat)}
        onBack={() => setSelectedChat(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F5]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="px-4 py-3 border-b border-[#D4C5BE] bg-white">
          <h1 className="text-xl font-semibold text-[#6B4D3C] mb-3">Messages</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[#D4C5BE] focus:outline-none focus:border-[#8B7B74] text-sm bg-white"
            />
            <Search className="w-4 h-4 text-[#8B7B74] absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Conversations List */}
        <div className="divide-y divide-[#D4C5BE]">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedChat(conv.id)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-white transition-colors text-left"
            >
              <div className="w-10 h-10 rounded-full bg-[#6B4D3C] flex-shrink-0 flex items-center justify-center">
                <span className="text-white font-medium">
                  {conv.user.name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-medium text-[#6B4D3C] truncate">
                    {conv.user.name}
                  </h3>
                  <span className="text-xs text-[#8B7B74] flex-shrink-0 ml-2">
                    {conv.lastMessage.time}
                  </span>
                </div>
                <p className="text-sm text-[#8B7B74] truncate">
                  {conv.lastMessage.content}
                </p>
              </div>
              {conv.lastMessage.unread && (
                <div className="w-2 h-2 rounded-full bg-[#6B4D3C] mt-2" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
