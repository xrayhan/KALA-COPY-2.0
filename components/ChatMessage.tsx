
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.id.startsWith('sys-');

  if (isSystem) {
    return (
      <div className="flex justify-center my-6 message-fade-in">
        <div className="px-6 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-xs font-medium backdrop-blur-md shadow-lg shadow-pink-500/5">
          <i className="fas fa-heart mr-2 animate-pulse"></i>
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-6 message-fade-in ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[88%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shadow-xl transition-transform hover:scale-110 ${
          isUser 
            ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 ml-4' 
            : 'bg-gradient-to-br from-pink-500 to-purple-700 mr-4 border border-white/10'
        }`}>
          {isUser ? <i className="fas fa-hand-holding-heart"></i> : <i className="fas fa-female text-lg"></i>}
        </div>
        <div className="flex flex-col">
          <div className={`px-5 py-3.5 rounded-2xl text-[15px] leading-relaxed shadow-2xl relative ${
            isUser 
              ? 'bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-tr-none' 
              : 'bg-[#121215]/80 backdrop-blur-md text-gray-200 border border-white/5 rounded-tl-none'
          }`}>
            <p className="whitespace-pre-wrap">{message.text}</p>
            {!isUser && (
               <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-500/50 rounded-full animate-ping opacity-20"></div>
            )}
          </div>
          <div className={`text-[10px] mt-1.5 opacity-40 font-medium ${isUser ? 'text-right mr-1' : 'text-left ml-1'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
