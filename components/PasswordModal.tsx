
import React, { useState } from 'react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '11223344') {
      onSuccess();
      setPassword('');
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl transition-all animate-fadeIn">
      <div className="w-full max-w-sm p-8 glass-effect rounded-[2.5rem] border border-pink-500/30 shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <div className="w-24 h-24 bg-pink-600/10 rounded-full blur-3xl -mr-12 -mt-12"></div>
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white orbitron tracking-tight">Access Key</h3>
            <p className="text-xs text-pink-400/80 font-medium uppercase tracking-widest">Secret Mode Verification</p>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all z-10"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mb-8 leading-relaxed">
           আমাদের এই গোপন পৃথিবীতে (১৮+) প্রবেশ করতে পাসওয়ার্ডটি দে জান...
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="পাসওয়ার্ড..."
              className={`w-full px-5 py-4 bg-white/5 border rounded-2xl focus:outline-none transition-all text-center tracking-[0.3em] text-xl font-bold ${
                error 
                  ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                  : 'border-white/10 focus:border-pink-500/50 focus:bg-white/10'
              }`}
              autoFocus
            />
            <div className={`absolute -bottom-6 left-0 right-0 text-center transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
               <span className="text-[10px] text-red-400 font-bold uppercase tracking-tighter italic">! ভুল পাসওয়ার্ড রে জান !</span>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-pink-600/20 active:scale-95 flex items-center justify-center gap-3 overflow-hidden group"
          >
            <span className="relative z-10">গোপন দরজা খোল</span>
            <i className="fas fa-key text-xs opacity-50 group-hover:translate-x-1 transition-transform"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
