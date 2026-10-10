import React from 'react';
import { Target, Compass, Mic, MessageSquare, Sparkles, Languages } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  activeTab: 'questions' | 'career' | 'mock' | 'chat';
  setActiveTab: (tab: 'questions' | 'career' | 'mock' | 'chat') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
}) => {
  const isTr = language === 'tr';

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-tight">
                  CoachPulse <span className="text-indigo-400">AI</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-full">
                  PRO AGENT
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {isTr
                  ? 'Mülakatçı Unvanına Özel Soru & Kariyer Yol Haritası Koçu'
                  : 'Interviewer Persona Question & Career Roadmap Coach'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('questions')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'questions'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>{isTr ? 'Mülakatçı Soruları' : 'Interview Questions'}</span>
            </button>

            <button
              onClick={() => setActiveTab('career')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'career'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{isTr ? 'Eğitim & Sonraki Adım' : 'Training & Next Step'}</span>
            </button>

            <button
              onClick={() => setActiveTab('mock')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'mock'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isTr ? 'Mülakat Simülasyonu' : 'Mock Simulator'}</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'chat'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isTr ? 'Koç Danışma' : 'Coach Advice'}</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Language Switch */}
            <button
              onClick={() => setLanguage(isTr ? 'en' : 'tr')}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition-colors"
              title={isTr ? 'Dili değiştir' : 'Change language'}
            >
              <Languages className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold uppercase">{language}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('questions')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'questions' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/80'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>{isTr ? 'Sorular' : 'Questions'}</span>
          </button>
          <button
            onClick={() => setActiveTab('career')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'career' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{isTr ? 'Sonraki Adım' : 'Next Step'}</span>
          </button>
          <button
            onClick={() => setActiveTab('mock')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'mock' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/80'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isTr ? 'Simülatör' : 'Simulator'}</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-300 bg-slate-800/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isTr ? 'Koç' : 'Coach'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
