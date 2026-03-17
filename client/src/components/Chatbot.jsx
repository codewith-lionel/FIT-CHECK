import { useEffect, useRef, useState } from 'react';
import { chatApi } from '../services/api';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'ai', text: 'Hey there! Ask me anything about outfits, fits, or styling.' },
  ]);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text }]);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await chatApi.send(text);
      setMessages((prev) => [...prev, { from: 'ai', text: reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { from: 'ai', text: 'Sorry, unable to reply now.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-xl text-white flex items-center justify-center text-2xl hover:scale-105 transition"
        aria-label="Open AI stylist chat"
      >
        <FiMessageCircle />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)}></div>
      )}

      <div
        className={`fixed z-50 bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 transition transform ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <div>
            <p className="text-sm text-slate-500">AI Stylist</p>
            <p className="font-semibold text-slate-900">Need outfit advice?</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-900">
            <FiX />
          </button>
        </div>
        <div className="p-4 h-80 overflow-y-auto space-y-3 bg-slate-50/60">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                msg.from === 'user'
                  ? 'ml-auto bg-slate-900 text-white'
                  : 'bg-white text-slate-800 border border-slate-100 shadow-sm'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-full px-3 py-2">
            <textarea
              rows={1}
              value={input}
              onKeyDown={handleKey}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about fits, colors, vibes..."
              className="flex-1 bg-transparent outline-none text-sm resize-none"
            />
            <button
              onClick={send}
              disabled={loading}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              ) : (
                <FiSend />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;
