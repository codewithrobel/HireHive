import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! I'm HireBot. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), text: input, isBot: false };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Simulate bot response
        setTimeout(() => {
            const responses = [
                "I can certainly help you with finding a job! Have you tried using the search filters on the Jobs page?",
                "To upload your CV, please log in and visit your Seeker Dashboard.",
                "Recruiters can post jobs by clicking the 'Post a New Job' button in their dashboard.",
                "You can add an avatar to your profile through the Dashboard settings.",
                "I'm a simple bot right now, but our team is continuously upgrading me with AI!"
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setMessages(prev => [...prev, { id: Date.now() + 1, text: randomResponse, isBot: true }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="mb-4 w-80 sm:w-96 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-2xl border border-white/60 dark:border-white/10 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_rgba(99,102,241,0.2)] overflow-hidden flex flex-col h-[400px]"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 p-4 flex justify-between items-center text-white shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
                                    <Bot size={24} className="text-white drop-shadow-sm" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg leading-tight flex items-center">HireBot <Sparkles size={14} className="ml-1 text-fuchsia-200" /></h3>
                                    <span className="text-xs text-indigo-100 font-medium flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div> Online
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors relative z-10">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50/50 dark:bg-zinc-950/50">
                            {messages.map(msg => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={msg.id}
                                    className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] rounded-2xl p-3 text-sm font-medium shadow-sm ${msg.isBot ? 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/5 rounded-tl-none' : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-none'}`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-zinc-200 dark:border-white/10 bg-white/80 dark:bg-zinc-900/80">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-zinc-100 dark:bg-black/40 text-zinc-900 dark:text-white rounded-xl px-4 py-2 border border-zinc-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium text-sm shadow-inner placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm disabled:shadow-none"
                                >
                                    <Send size={18} className="ml-0.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors border-2 z-50 ${isOpen ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-300' : 'bg-gradient-to-br from-indigo-600 to-fuchsia-600 border-white/20 text-white hover:animate-pulse hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]'}`}
            >
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </motion.button>
        </div>
    );
};

export default Chatbot;
