import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, Bot, User, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface CoachChatProps {
  language: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
}

export const CoachChat: React.FC<CoachChatProps> = ({ language }) => {
  const isTr = language === 'tr';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'coach',
      text: isTr
        ? 'Merhaba! Ben sizin Kariyer & Mülakat Koçunuzum. Mülakat stratejileri, unvana özel sorular, eğitimlerinizi CV’de parlatma veya zor sorulara (maaş beklentisi, kariyer boşlukları vb.) nasıl cevap vereceğiniz konusunda aklınıza takılan her şeyi bana sorabilirsiniz.'
        : 'Hello! I am your AI Career & Interview Coach. Ask me anything regarding interview strategies, handling tough questions (salary expectations, career gaps), or positioning your courses on your resume.',
      timestamp: '09:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const suggestedQuestions = isTr
    ? [
        'Mülakatta "Bize kendinizden bahsedin" sorusuna aldığım eğitimleri de katarak nasıl 2 dakikalık giriş yapmalıyım?',
        'Mülakatçı maaş beklentimi sorduğunda pazarlık alanını kaybetmeden ne cevap vermeliyim?',
        'Eğitimde öğrendiğim ama henüz iş ortamında deneyimlemediğim bir teknoloji sorulduğunda ne demeliyim?',
        'Kariyer boşluğumu (Career Gap) bu eğitimlerle nasıl pozitif bir avantaja dönüştürebilirim?',
      ]
    : [
        'How should I structure the "Tell me about yourself" answer integrating my courses?',
        'How do I answer salary expectation questions without losing leverage?',
        'How do I answer questions about tools I learned in courses but haven’t used in production?',
        'How do I turn a career gap into a positive narrative using my recent trainings?',
      ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/career/coach-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Coach chat error');
      }

      const data = await response.json();

      const coachMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: data.reply || (isTr ? 'Anladım. Başka sorunuz var mı?' : 'Understood. Anything else?'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'coach',
        text: isTr
          ? 'Üzgünüm, şu an bağlantıda bir aksaklık oldu. Lütfen tekrar deneyin.'
          : 'Sorry, there was a temporary issue. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {isTr ? 'Kariyer & Mülakat Koçu ile Canlı Danışma' : 'Direct AI Career & Interview Coach'}
            </h1>
            <p className="text-xs text-slate-400">
              {isTr
                ? 'Mülakat taktikleri, zor sorular, maaş müzakeresi ve kariyer dönüşümü için birebir akıl hocası'
                : '1-on-1 strategic guidance for challenging questions, salary talk, and positioning'}
            </p>
          </div>
        </div>

        {/* Suggested Quick Questions */}
        <div className="pt-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>{isTr ? 'Örnek Sık Sorulan Konular:' : 'Frequent Strategic Questions:'}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sq)}
                className="text-xs bg-slate-800/80 hover:bg-indigo-600/60 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700/80 transition-colors text-left"
              >
                "{sq}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[520px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'coach' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-tl-none whitespace-pre-line'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] block mt-1.5 ${
                    msg.sender === 'user' ? 'text-indigo-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-600/30">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-700 flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/70 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isTr
                  ? 'Koça bir soru sorun (örn: "Maaş sorulduğunda ne diyeyim?")...'
                  : 'Ask the coach anything...'
              }
              className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center space-x-2 transition-all cursor-pointer shadow-md shadow-indigo-600/25"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{isTr ? 'Gönder' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
