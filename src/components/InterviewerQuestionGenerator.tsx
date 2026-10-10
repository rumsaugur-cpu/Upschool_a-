import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
  Copy,
  Check,
  Building,
  Briefcase,
  Layers,
  FileText,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { InterviewQuestionsResult, InterviewQuestion, Language } from '../types';
import { INTERVIEW_PRESETS } from '../data/samplePresets';

interface InterviewerQuestionGeneratorProps {
  language: Language;
  onSendToMock: (question: InterviewQuestion, interviewerTitle: string, targetRole: string) => void;
  candidateBackgroundFromTraining?: string;
}

export const InterviewerQuestionGenerator: React.FC<InterviewerQuestionGeneratorProps> = ({
  language,
  onSendToMock,
  candidateBackgroundFromTraining = '',
}) => {
  const isTr = language === 'tr';

  const [interviewerTitle, setInterviewerTitle] = useState('Chief Marketing Officer (CMO)');
  const [targetRole, setTargetRole] = useState('Kıdemli Dijital Pazarlama & Büyüme Uzmanı');
  const [companyType, setCompanyType] = useState('B2B SaaS / E-Ticaret');
  const [interviewStage, setInterviewStage] = useState('Yönetici & Strateji Final Görüşmesi');
  const [candidateBackground, setCandidateBackground] = useState(
    candidateBackgroundFromTraining ||
      'Performans pazarlaması, GA4, Meta/Google reklam bütçe yönetimi ve ROAS optimizasyonunda 4 yıllık tecrübe.'
  );
  const [showAdvancedBg, setShowAdvancedBg] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<InterviewQuestionsResult | null>(null);

  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');

  const handleApplyPreset = (presetId: string) => {
    const p = INTERVIEW_PRESETS.find((item) => item.id === presetId);
    if (p) {
      setInterviewerTitle(p.interviewerTitle);
      setTargetRole(p.targetRole);
      setCompanyType(p.companyType);
      setInterviewStage(p.interviewStage);
      setCandidateBackground(p.candidateBackground);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!interviewerTitle.trim()) {
      setError(isTr ? 'Lütfen mülakatçının unvanını giriniz.' : 'Please enter interviewer title.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          targetRole,
          companyType,
          interviewStage,
          candidateBackground,
          language,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || (isTr ? 'Sorular oluşturulurken bir aksaklık yaşandı. Lütfen tekrar deneyin.' : 'Error generating questions. Please try again.'));
        setIsLoading(false);
        return;
      }

      const data: InterviewQuestionsResult = await response.json();
      setResults(data);
      if (data.questions && data.questions.length > 0) {
        setExpandedQuestionId(data.questions[0].id);
      }
    } catch (err: any) {
      setError(err?.message || (isTr ? 'Bağlantı sırasında bir hata oluştu. Lütfen tekrar deneyin.' : 'Error generating questions. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyQuestion = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categories = results
    ? Array.from(new Set(results.questions.map((q) => q.category)))
    : [];

  const filteredQuestions =
    results?.questions.filter(
      (q) => activeCategoryFilter === 'all' || q.category === activeCategoryFilter
    ) || [];

  return (
    <div className="space-y-8">
      {/* Top Banner / Explanation */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold mb-2 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isTr ? 'Mülakatçı Odaklı İstihbarat' : 'Interviewer-Centric Intelligence'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isTr ? 'Mülakatçının Unvanına Özel Soru Üretici' : 'Tailored Questions by Interviewer Title'}
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              {isTr
                ? 'Bir CTO, bir İK Direktörü veya bir CMO aynı adaya asla aynı soruları sormaz. Mülakata gireceğiniz kişinin unvanını girin; o kişinin neyi test edeceğini, soracağı soruları ve STAR yanıt stratejilerini anında keşfedin.'
                : 'A CTO, HR Director, or CMO never asks the same questions. Provide the interviewer’s exact title to discover their evaluation mindset, exact questions, traps, and winning STAR answers.'}
            </p>
          </div>

          {/* Quick Presets */}
          <div className="shrink-0 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <span className="text-xs font-medium text-slate-400 block mb-2">
              {isTr ? '⚡ Hızlı Örnek Senaryo Seç:' : '⚡ Select Quick Scenario:'}
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-xs">
              {INTERVIEW_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p.id)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-700/70 hover:bg-indigo-600/80 text-slate-200 hover:text-white transition-colors"
                >
                  {p.label.split(' ')[0]} {p.label.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-slate-950/40">
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Interviewer Title */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {isTr ? 'Mülakatçının Unvanı / Rolü *' : 'Interviewer Title *'}
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-indigo-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder={isTr ? 'Örn: Engineering Manager, CMO, CTO' : 'e.g. Engineering Manager, CMO, HR Lead'}
                  value={interviewerTitle}
                  onChange={(e) => setInterviewerTitle(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Target Role */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {isTr ? 'Gireceğiniz Pozisyon (Hedef Rol)' : 'Target Candidate Role'}
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-purple-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder={isTr ? 'Örn: Senior Full-Stack Developer' : 'e.g. Senior Frontend Developer'}
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Company Type */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {isTr ? 'Şirket Tipi / Sektör' : 'Company Type / Sector'}
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-emerald-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder={isTr ? 'Örn: B2B SaaS, E-Ticaret, FinTech' : 'e.g. B2B SaaS, FinTech Scale-Up'}
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {/* Interview Stage */}
            <div className="lg:col-span-1">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {isTr ? 'Mülakat Aşaması' : 'Interview Stage'}
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={interviewStage}
                  onChange={(e) => setInterviewStage(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="Teknik & Yetkinlik Mülakatı">
                    {isTr ? 'Teknik & Yetkinlik Mülakatı' : 'Technical & Competency'}
                  </option>
                  <option value="Yönetici & Strateji Final Görüşmesi">
                    {isTr ? 'Yönetici & Final Görüşmesi' : 'Executive & Final Round'}
                  </option>
                  <option value="İlk İK & Kültürel Uyum">
                    {isTr ? 'İlk İK & Kültürel Uyum' : 'HR Screening & Cultural Fit'}
                  </option>
                  <option value="Vaka Çalışması & Sunum">
                    {isTr ? 'Vaka Çalışması (Case Study)' : 'Case Study & Presentation'}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Toggle Candidate Background context */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvancedBg(!showAdvancedBg)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>
                {showAdvancedBg
                  ? isTr
                    ? 'Geçmiş Deneyim / Eğitim Notunu Gizle'
                    : 'Hide Background Context'
                  : isTr
                    ? '+ Aldığınız Eğitimleri veya Geçmiş Deneyiminizi Ekleyin (Daha Keskin Sorular)'
                    : '+ Add Background & Training Context (Sharper questions)'}
              </span>
            </button>

            {showAdvancedBg && (
              <div className="mt-2">
                <textarea
                  rows={2}
                  placeholder={
                    isTr
                      ? 'Aldığınız eğitimler, sertifikalar veya uzmanlık alanınız hakkında kısa notlar (Sorular geçmişinize göre adapte edilir).'
                      : 'Key courses, certifications, or past project highlights.'
                  }
                  value={candidateBackground}
                  onChange={(e) => setCandidateBackground(e.target.value)}
                  className="w-full p-3 bg-slate-800/70 border border-slate-700 rounded-xl text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {isTr
                      ? 'Mülakatçının Zihniyeti Çözümleniyor...'
                      : 'Decoding Interviewer Mindset...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isTr
                      ? `"${interviewerTitle}" İçin Soruları Üret`
                      : `Generate Questions for "${interviewerTitle}"`}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-8 animate-fadeIn">
          {/* Interviewer Persona Mindset Breakdown */}
          <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {interviewerTitle} {isTr ? 'Zihniyeti ve Değerlendirme Filtresi' : 'Mindset & Evaluation Filter'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTr
                    ? 'Bu unvana sahip yöneticinin gizli kriterleri ve değerlendirme refleksi'
                    : 'Unspoken criteria, hidden anxieties, and priority lenses of this role'}
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-6 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              {results.interviewerMindset.perspectiveSummary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Priorities */}
              <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isTr ? 'En Çok Neye Odaklanır?' : 'Key Priorities'}</span>
                </div>
                <ul className="space-y-1.5">
                  {results.interviewerMindset.keyPriorities.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-indigo-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Red Flags to Avoid */}
              <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isTr ? 'Kırmızı Çizgiler (Uzak Dur)' : 'Red Flags to Avoid'}</span>
                </div>
                <ul className="space-y-1.5">
                  {results.interviewerMindset.redFlagsToAvoid.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What Wows Them */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{isTr ? 'Onu En Çok Ne Etkiler?' : 'What Wows Them'}</span>
                </div>
                <ul className="space-y-1.5">
                  {results.interviewerMindset.whatWowsThem.map((item, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Generated Questions List */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <span>{isTr ? 'Potansiyel Mülakat Soruları' : 'Potential Interview Questions'}</span>
                  <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2.5 py-0.5 rounded-full font-medium">
                    {results.questions.length} {isTr ? 'Soru' : 'Questions'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isTr
                    ? 'Sorunun üzerine tıklayarak mülakatçının amacını, tuzakları ve STAR cevabını inceleyin.'
                    : 'Click any question to expand interviewer intent, STAR guidelines, and ideal outline.'}
                </p>
              </div>

              {/* Category Filter Pills */}
              {categories.length > 1 && (
                <div className="flex flex-wrap gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setActiveCategoryFilter('all')}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                      activeCategoryFilter === 'all'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {isTr ? 'Tümü' : 'All'}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategoryFilter(cat)}
                      className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                        activeCategoryFilter === cat
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Questions Accordion */}
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => {
                const isExpanded = expandedQuestionId === q.id;

                return (
                  <div
                    key={q.id || idx}
                    className={`bg-slate-900 border rounded-2xl transition-all overflow-hidden ${
                      isExpanded
                        ? 'border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header bar */}
                    <div
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-start space-x-3.5 flex-1">
                        <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-indigo-500/20">
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center space-x-2 mb-1.5">
                            <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                              {q.category}
                            </span>
                          </div>
                          <h4 className="text-base font-semibold text-white leading-snug">
                            {q.question}
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyQuestion(q.question, q.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                          title={isTr ? 'Soruyu kopyala' : 'Copy question'}
                        >
                          {copiedId === q.id ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <div className="text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-indigo-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-800/80 space-y-5 bg-slate-950/40">
                        {/* What they are really probing */}
                        <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
                          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
                            <HelpCircle className="w-4 h-4" />
                            <span>
                              {isTr
                                ? `Mülakatçı (${interviewerTitle}) Neyi Test Ediyor?`
                                : `What ${interviewerTitle} Is Secretly Testing:`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {q.interviewerObjective}
                          </p>
                        </div>

                        {/* STAR Response Framework */}
                        <div>
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-2.5 flex items-center space-x-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span>
                              {isTr
                                ? 'STAR Yanıt Mimarisi (Durum • Görev • Eylem • Sonuç)'
                                : 'STAR Response Architecture'}
                            </span>
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                                [S] {isTr ? 'Durum (Situation)' : 'Situation'}
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.starGuidance.situation}
                              </p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                                [T] {isTr ? 'Görev (Task)' : 'Task'}
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.starGuidance.task}
                              </p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                                [A] {isTr ? 'Eylem (Action)' : 'Action'}
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.starGuidance.action}
                              </p>
                            </div>
                            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                                [R] {isTr ? 'Sonuç & Metrik (Result)' : 'Result & Metrics'}
                              </span>
                              <p className="text-xs text-slate-300">
                                {q.starGuidance.result}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Traps & Talking points */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="bg-emerald-950/20 border border-emerald-900/30 rounded-xl p-3.5">
                            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isTr ? 'Vurgulanması Gereken Noktalar' : 'Key Talking Points'}</span>
                            </span>
                            <ul className="space-y-1">
                              {q.keyTalkingPoints.map((tp, idx2) => (
                                <li key={idx2} className="text-xs text-slate-300 flex items-start space-x-1.5">
                                  <span className="text-emerald-400 font-bold">•</span>
                                  <span>{tp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-3.5">
                            <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center space-x-1.5 mb-2">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{isTr ? 'Yaygın Tuzaklar (Uzak Dur)' : 'Common Traps to Avoid'}</span>
                            </span>
                            <ul className="space-y-1">
                              {q.commonTraps.map((trap, idx2) => (
                                <li key={idx2} className="text-xs text-slate-300 flex items-start space-x-1.5">
                                  <span className="text-red-400 font-bold">•</span>
                                  <span>{trap}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Ideal outline */}
                        <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4">
                          <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center space-x-1.5 mb-1.5">
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>{isTr ? 'Örnek İdeal Cevap Taslağı' : 'Ideal Model Answer Outline'}</span>
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed italic">
                            "{q.idealAnswerOutline}"
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => handleCopyQuestion(`${q.question}\n\nİdeal Cevap Taslağı:\n${q.idealAnswerOutline}`, q.id)}
                            className="px-3.5 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center space-x-1.5 border border-slate-700 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{isTr ? 'Tüm Rehberi Kopyala' : 'Copy Full Guide'}</span>
                          </button>

                          {/* Send to Mock Interview Simulator */}
                          <button
                            type="button"
                            onClick={() => onSendToMock(q, interviewerTitle, targetRole)}
                            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>
                              {isTr
                                ? 'Bu Soruyu Şimdi Simülatörde Cevapla'
                                : 'Practice Answering this Question Now'}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reverse Questions: Questions to ask this specific interviewer */}
          {results.reverseQuestions && results.reverseQuestions.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {isTr
                      ? `Sizin ${interviewerTitle} Kişisine Sorabileceğiniz Stratejik Karşı Sorular`
                      : `Strategic Reverse Questions to Ask this ${interviewerTitle}`}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isTr
                      ? 'Mülakatın sonunda "Bize sormak istediğiniz bir soru var mı?" dendiğinde bu soruları sorarak fark yaratın.'
                      : 'Ask these high-impact questions when they ask "Do you have any questions for us?"'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.reverseQuestions.map((rq, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 border border-slate-700/70 rounded-xl p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider mb-1.5">
                        {isTr ? `Stratejik Soru #${idx + 1}` : `Strategic Question #${idx + 1}`}
                      </div>
                      <p className="text-sm font-semibold text-white mb-3">
                        "{rq.question}"
                      </p>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                      <span className="font-semibold text-indigo-400 block mb-0.5">
                        {isTr ? 'Neden çok etkili?' : 'Why it stands out:'}
                      </span>
                      {rq.strategicReason}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
