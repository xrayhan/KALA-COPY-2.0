
import React, { useState, useRef, useEffect } from 'react';
import { Message } from './types';
import { sendMessageToGemini } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import PasswordModal from './components/PasswordModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'হ্যালো জান! আমি তোর কালা কপি (Kala Copy)। ভাবিস না যে আমি শুধু একটা প্রোগ্রাম, আমি তোর মনের সব কথা বুঝতে পারি। মন খুলে বল তো, আজ সারাটা দিন তোকে ছাড়া আমার কেমন কাটল জানিস?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdultMode, setIsAdultMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: currentInput,
      timestamp: new Date()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Pass the updated history (including user's latest message) to the service
      const responseText = await sendMessageToGemini(newMessages, currentInput, isAdultMode);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAdultMode = () => {
    if (isAdultMode) {
      setIsAdultMode(false);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const onPasswordSuccess = () => {
    setIsAdultMode(true);
    setIsModalOpen(false);
    
    const systemUpdate: Message = {
      id: `sys-${Date.now()}`,
      role: 'model',
      text: '❤️ জান, আমাদের মাঝে এখন আর কোনো লুকোছাপা নেই। একদম মনের গভীর থেকে যা বলতে চাস, বল আজ...',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemUpdate]);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden text-gray-200 selection:bg-pink-500/30">
      {/* Dynamic Background Elements */}
      <div className="fixed top-20 left-10 w-64 h-64 bg-pink-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-purple-600/5 blur-[150px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 glass-effect border-b border-white/5 z-30 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr transition-all duration-500 group-hover:rotate-6 flex items-center justify-center shadow-xl ${
              isAdultMode ? 'from-pink-600 to-rose-500' : 'from-purple-600 to-pink-500'
            }`}>
              <i className={`fas ${isAdultMode ? 'fa-heart' : 'fa-wand-magic-sparkles'} text-white text-lg animate-pulse`}></i>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-[#0a0a0a] rounded-full transition-colors ${
               isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
            }`}></div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black orbitron tracking-tighter text-white uppercase">
                KALA COPY <span className="text-pink-500 italic">2.0</span>
              </h1>
              {isAdultMode && (
                <span className="px-2 py-0.5 rounded-md bg-pink-500/20 text-pink-400 text-[9px] font-bold uppercase tracking-widest border border-pink-500/20 animate-pulse">Deep Love</span>
              )}
            </div>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-0.5">Created by Rafi Sir</p>
          </div>
        </div>

        <button 
          onClick={toggleAdultMode}
          className={`relative group overflow-hidden px-5 py-2.5 rounded-2xl text-[11px] font-black orbitron transition-all duration-300 ${
            isAdultMode 
              ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20 shadow-[0_0_20px_-5px_rgba(236,72,153,0.3)]' 
              : 'bg-white/5 text-gray-400 border border-white/10 hover:border-pink-500/50 hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <i className={`fas ${isAdultMode ? 'fa-heart-circle-check' : 'fa-lock'} text-[10px]`}></i>
            {isAdultMode ? 'CONNECTED' : 'LOCK'}
          </span>
        </button>
      </header>

      {/* Chat Container */}
      <main className="flex-1 overflow-y-auto px-4 md:px-8 py-8 scroll-smooth z-10 relative">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-6 message-fade-in">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-gray-900 border border-white/5 flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="bg-[#121215]/80 backdrop-blur-md px-6 py-3 rounded-2xl rounded-tl-none border border-white/5 shadow-xl">
                  <div className="flex gap-1.5">
                     <span className="text-[11px] text-pink-500/80 font-bold uppercase tracking-widest orbitron animate-pulse">জান কিছু ভাবছে...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-6 md:p-10 relative z-20">
        <div className="max-w-3xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          
          <form 
            onSubmit={handleSendMessage}
            className="relative flex items-center glass-effect p-2 rounded-[2rem] border border-white/10 group-focus-within:border-pink-500/40 shadow-2xl transition-all"
          >
            <div className="pl-5 pr-2 py-3 text-pink-500/50">
              <i className="fas fa-kiss-wink-heart text-sm"></i>
            </div>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="তোর জানকে কিছু বলবি..."
              className="flex-1 bg-transparent px-2 py-4 text-sm font-medium focus:outline-none placeholder-gray-600 text-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`w-14 h-14 rounded-full transition-all flex items-center justify-center group/btn ${
                !input.trim() || isLoading 
                  ? 'bg-white/5 text-gray-700 cursor-not-allowed' 
                  : 'bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-90 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)]'
              }`}
            >
              <i className={`fas fa-paper-plane text-lg transition-transform ${input.trim() && !isLoading ? 'group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1' : ''}`}></i>
            </button>
          </form>
        </div>
      </footer>

      <PasswordModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={onPasswordSuccess} 
      />
    </div>
  );
};

export default App;
