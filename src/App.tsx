/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { InterviewerQuestionGenerator } from './components/InterviewerQuestionGenerator';
import { TrainingCareerAnalyzer } from './components/TrainingCareerAnalyzer';
import { MockInterviewPractice } from './components/MockInterviewPractice';
import { CoachChat } from './components/CoachChat';
import { Language, InterviewQuestion } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'questions' | 'career' | 'mock' | 'chat'>('questions');
  const [language, setLanguage] = useState<Language>('tr');

  // Shared state between features
  const [mockQuestion, setMockQuestion] = useState<string>(
    'Bize geçmişte yönettiğiniz ve ölçülebilir başarı sağladığınız en karmaşık projeden bahseder misiniz?'
  );
  const [mockInterviewerTitle, setMockInterviewerTitle] = useState<string>('Chief Marketing Officer (CMO)');
  const [mockTargetRole, setMockTargetRole] = useState<string>('Kıdemli Dijital Pazarlama Uzmanı');

  const [backgroundFromTraining, setBackgroundFromTraining] = useState<string>('');

  const handleSendToMock = (
    q: InterviewQuestion,
    interviewerTitle: string,
    targetRole: string
  ) => {
    setMockQuestion(q.question);
    setMockInterviewerTitle(interviewerTitle);
    setMockTargetRole(targetRole);
    setActiveTab('mock');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendToQuestions = (backgroundSummary: string) => {
    setBackgroundFromTraining(backgroundSummary);
    setActiveTab('questions');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'questions' && (
          <InterviewerQuestionGenerator
            language={language}
            onSendToMock={handleSendToMock}
            candidateBackgroundFromTraining={backgroundFromTraining}
          />
        )}

        {activeTab === 'career' && (
          <TrainingCareerAnalyzer
            language={language}
            onSendToInterviewQuestions={handleSendToQuestions}
          />
        )}

        {activeTab === 'mock' && (
          <MockInterviewPractice
            initialQuestion={mockQuestion}
            initialInterviewerTitle={mockInterviewerTitle}
            initialTargetRole={mockTargetRole}
            language={language}
          />
        )}

        {activeTab === 'chat' && (
          <CoachChat language={language} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            CoachPulse AI — Yapay Zeka Mülakat İstihbaratı & Kariyer Mimarı
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Mülakatçı Unvanına Özel Sorular</span>
            <span>•</span>
            <span>Eğitim Analizi & Sonraki Adım</span>
            <span>•</span>
            <span>STAR Simülatörü</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
