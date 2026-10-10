import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Plus,
  Trash2,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Copy,
  Check,
  Send,
  Calendar,
  Briefcase,
  Share2,
} from 'lucide-react';
import { TrainingItem, TrainingAnalysisResult, Language } from '../types';
import { TRAINING_PRESETS } from '../data/samplePresets';

interface TrainingCareerAnalyzerProps {
  language: Language;
  onSendToInterviewQuestions?: (backgroundSummary: string) => void;
}

export const TrainingCareerAnalyzer: React.FC<TrainingCareerAnalyzerProps> = ({
  language,
  onSendToInterviewQuestions,
}) => {
  const isTr = language === 'tr';

  const [currentRoleOrLevel, setCurrentRoleOrLevel] = useState(
    'Dijital Pazarlama & Performans Uzmanı (2 Yıl)'
  );
  const [targetGoal, setTargetGoal] = useState(
    'Head of Growth / Kıdemli Veri Odaklı Dijital Pazarlama Lideri'
  );

  const [trainings, setTrainings] = useState<TrainingItem[]>([
    {
      id: '1',
      title: 'İleri Seviye Google Ads, GA4 & Performans Pazarlaması',
      institution: 'Google Digital Academy & BTK',
      syllabusOrContent:
        'GA4 Event-based veri modeli, GTM ile e-ticaret veri katmanı (dataLayer) kurulumu, Looker Studio dashboardları, Smart Bidding, Hedef Kitle segmentasyonu, LTV ve CAC optimizasyonu.',
      keySkills: 'GA4, Google Tag Manager, Google Ads, Looker Studio, ROAS Hesaplama, A/B Testi',
      projectsCompleted:
        'Bir e-ticaret sitesinin tüm dönüşüm hunisi etiketleme mimarisi ve %28 ROAS artışı sağlayan kampanya optimizasyonu.',
    },
    {
      id: '2',
      title: 'Growth Hacking & Müşteri Kazanımı Stratejileri',
      institution: 'Coursera / Reforge Modülü',
      syllabusOrContent:
        'Büyüme hunisi (AARRR), kullanıcı tutundurma (Retention) analizi, onboarding deneyleri, e-posta otomasyon tetikleyicileri, viral döngüler.',
      keySkills: 'Kullanıcı Tutundurma (Retention), Kohort Analizi, CRO, E-posta Otomasyonu, Büyüme Hunisi',
      projectsCompleted:
        'Kullanıcı aktivasyon oranını %35 artıran 4 adımlı onboarding stratejisi ve vaka analizi.',
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<TrainingAnalysisResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleApplyPreset = (presetId: string) => {
    const preset = TRAINING_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      setCurrentRoleOrLevel(preset.currentRoleOrLevel);
      setTargetGoal(preset.targetGoal);
      setTrainings(preset.trainings);
    }
  };

  const handleAddTraining = () => {
    const newItem: TrainingItem = {
      id: Date.now().toString(),
      title: '',
      institution: '',
      syllabusOrContent: '',
      keySkills: '',
      projectsCompleted: '',
    };
    setTrainings([...trainings, newItem]);
  };

  const handleRemoveTraining = (id: string) => {
    if (trainings.length === 1) {
      alert(
        isTr
          ? 'En az bir eğitim içeriği bulunmalıdır.'
          : 'At least one training item is required.'
      );
      return;
    }
    setTrainings(trainings.filter((t) => t.id !== id));
  };

  const handleUpdateTraining = (id: string, field: keyof TrainingItem, value: string) => {
    setTrainings(
      trainings.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validTrainings = trainings.filter(
      (t) => t.title.trim() !== '' || t.syllabusOrContent.trim() !== ''
    );

    if (validTrainings.length === 0) {
      setError(
        isTr
          ? 'Lütfen en az bir eğitimin başlığını veya içerik detayını girin.'
          : 'Please enter at least one training title or syllabus content.'
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/analyze-trainings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainings: validTrainings,
          currentRoleOrLevel,
          targetGoal,
          language,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        setError(errData.error || (isTr ? 'Eğitimler analiz edilirken bir aksaklık yaşandı. Lütfen tekrar deneyin.' : 'Error analyzing training contents. Please try again.'));
        setIsLoading(false);
        return;
      }

      const data: TrainingAnalysisResult = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(
        err?.message ||
          (isTr
            ? 'Bağlantı sırasında bir hata oluştu. Lütfen tekrar deneyin.'
            : 'Error analyzing training contents. Please try again.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>{isTr ? 'Kariyer Mimarı & Sonraki Adım' : 'Career Architect & Next Step'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isTr
                ? 'Eğitim Analizi ve "Bir Sonraki Adım" Yol Haritası'
                : 'Training Analysis & "Next Strategic Step" Roadmap'}
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              {isTr
                ? 'Katıldığınız eğitimlerin, bootcamp ve kursların müfredatını girin. Yapay zeka yetkinliklerinizi sentezlesin, pazar değerinizi ölçsün ve bir sonraki kariyer atılımınız için 3 aşamalı somut yol haritası çıkarsın.'
                : 'Enter your attended courses, bootcamps, and syllabi. The AI synthesizes your cumulative competencies, scores market readiness, and builds a 3-phase strategic roadmap for your next level.'}
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="shrink-0 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
            <span className="text-xs font-medium text-slate-400 block mb-2">
              {isTr ? '⚡ Hazır Eğitim Paketi Yükle:' : '⚡ Load Preset Package:'}
            </span>
            <div className="flex flex-col gap-1.5">
              {TRAINING_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleApplyPreset(p.id)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-700/70 hover:bg-purple-600/80 text-slate-200 hover:text-white transition-colors text-left"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Inputs Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleAnalyze} className="space-y-6">
          {/* Current State & Target Goal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {isTr ? 'Şu Anki Durumunuz / Seviyeniz' : 'Current Status / Seniority'}
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-indigo-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={currentRoleOrLevel}
                  onChange={(e) => setCurrentRoleOrLevel(e.target.value)}
                  placeholder={
                    isTr
                      ? 'Örn: Junior Frontend Geliştirici, Dijital Pazarlama Uzmanı'
                      : 'e.g. Mid Digital Marketer, Junior Dev'
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {isTr ? 'Hedeflenen Pozisyon / Bir Sonraki Büyük Hedef' : 'Target Position / Next Big Career Goal'}
              </label>
              <div className="relative">
                <TrendingUp className="w-4 h-4 text-purple-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  placeholder={
                    isTr
                      ? 'Örn: Head of Growth, Senior Full-Stack Mühendis, Global Remote İş'
                      : 'e.g. Lead Engineer, VP of Growth'
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* List of Trainings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>
                    {isTr
                      ? 'Katıldığınız Eğitimler & Müfredat İçerikleri'
                      : 'Attended Trainings & Syllabus Contents'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  {isTr
                    ? 'İçerik ve ders başlıklarını ne kadar detaylı yazarsanız, çıkarılacak yol haritası o kadar keskin olur.'
                    : 'The more detailed the modules and topics, the more strategic your roadmap will be.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddTraining}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-purple-400 hover:text-purple-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center space-x-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isTr ? 'Yeni Eğitim Ekle' : 'Add Another Course'}</span>
              </button>
            </div>

            {/* Individual Training Cards */}
            <div className="space-y-4">
              {trainings.map((training, index) => (
                <div
                  key={training.id}
                  className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-md border border-purple-500/20">
                      {isTr ? `Eğitim #${index + 1}` : `Course #${index + 1}`}
                    </span>
                    {trainings.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTraining(training.id)}
                        className="text-slate-400 hover:text-red-400 p-1 rounded-md transition-colors"
                        title={isTr ? 'Eğitimi Kaldır' : 'Remove course'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        {isTr ? 'Eğitim / Sertifika Başlığı *' : 'Course / Certification Title *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={training.title}
                        onChange={(e) =>
                          handleUpdateTraining(training.id, 'title', e.target.value)
                        }
                        placeholder={isTr ? 'Örn: GA4 & Performance Marketing Bootcamp' : 'e.g. Advanced React & Node Bootcamp'}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        {isTr ? 'Kurum / Eğitmen / Platform' : 'Institution / Instructor / Platform'}
                      </label>
                      <input
                        type="text"
                        value={training.institution}
                        onChange={(e) =>
                          handleUpdateTraining(training.id, 'institution', e.target.value)
                        }
                        placeholder={isTr ? 'Örn: BTK Akademi, Coursera, Patika, Google' : 'e.g. Google Academy, Coursera'}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Syllabus / Content */}
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      {isTr
                        ? 'İçerik / Müfredat Modülleri / İşlenen Konular *'
                        : 'Syllabus / Modules / Topics Covered *'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={training.syllabusOrContent}
                      onChange={(e) =>
                        handleUpdateTraining(training.id, 'syllabusOrContent', e.target.value)
                      }
                      placeholder={
                        isTr
                          ? 'Örn: Event tracking, Conversion Funnel, GTM DataLayer, E-ticaret entegrasyonu, Looker Studio görselleştirme, Smart Bidding stratejileri...'
                          : 'Topics, modules, core concepts learned in this course...'
                      }
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        {isTr ? 'Kazanılan Araçlar & Beceriler' : 'Tools & Competencies Gained'}
                      </label>
                      <input
                        type="text"
                        value={training.keySkills}
                        onChange={(e) =>
                          handleUpdateTraining(training.id, 'keySkills', e.target.value)
                        }
                        placeholder={isTr ? 'Örn: GA4, GTM, Meta Ads, SQL, Python' : 'e.g. React, Next.js, Docker, SQL'}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">
                        {isTr ? 'Yapılan Projeler / Bitirme Çalışması' : 'Projects Completed / Capstone'}
                      </label>
                      <input
                        type="text"
                        value={training.projectsCompleted}
                        onChange={(e) =>
                          handleUpdateTraining(training.id, 'projectsCompleted', e.target.value)
                        }
                        placeholder={isTr ? 'Örn: E-ticaret ROAS optimizasyon vaka çalışması' : 'e.g. Real-time chat app, E-commerce funnel'}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Analyze Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-purple-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>
                    {isTr
                      ? 'Eğitimler Analiz Ediliyor & Yol Haritası Çıkarılıyor...'
                      : 'Synthesizing Curricula & Generating Roadmap...'}
                  </span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isTr
                      ? 'Eğitimleri Analiz Et & "Bir Sonraki Adım"ı Üret'
                      : 'Analyze Trainings & Generate "Next Step" Roadmap'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results View */}
      {results && (
        <div className="space-y-8 animate-fadeIn">
          {/* Readiness Score & Synthesis Banner */}
          <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex-1">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
                  {isTr ? 'Eğitimlerin Kümülatif Değeri & Profil Sentezi' : 'Cumulative Training Synthesis'}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">
                  {results.readinessVerdict}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {results.profileSummary}
                </p>
              </div>

              {/* Score Meter */}
              <div className="shrink-0 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80 flex items-center space-x-4">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-slate-700"
                      fill="transparent"
                    />
                    <circle
                      cx="40"
                      cy="40"
                      r="32"
                      stroke="currentColor"
                      strokeWidth="6"
                      className="text-purple-500 transition-all duration-1000 ease-out"
                      fill="transparent"
                      strokeDasharray={200}
                      strokeDashoffset={200 - (200 * results.readinessScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-xl font-black text-white">
                      %{results.readinessScore}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 font-medium">
                    {isTr ? 'Hedef Role Hazırlık' : 'Target Readiness'}
                  </div>
                  <div className="text-sm font-bold text-purple-400">
                    {results.readinessScore >= 80
                      ? isTr
                        ? 'Yüksek Seviye'
                        : 'High Readiness'
                      : results.readinessScore >= 60
                        ? isTr
                          ? 'İyi Temel / Geçiş Aşamasında'
                          : 'Solid Transition'
                        : isTr
                          ? 'Geliştirilmeli'
                          : 'Needs Focus'}
                  </div>
                </div>
              </div>
            </div>

            {/* Competency Matrix (Mastered vs Gaps) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              {/* Mastered */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isTr ? 'Kazanılan Güçlü Yetkinlikler' : 'Mastered Competencies'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {results.competencyMatrix.masteredSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-lg text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Emerging */}
              <div className="bg-indigo-950/20 border border-indigo-900/40 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{isTr ? 'Gelişmekte Olan / İkincil Kaslar' : 'Emerging Skills'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {results.competencyMatrix.emergingSkills.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Gaps */}
              <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{isTr ? 'Hedefe Ulaşmak İçin Eksik Kalanlar' : 'Critical Missing Gaps'}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {results.competencyMatrix.missingSkillGaps.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-lg text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 🎯 "BİR SONRAKİ ADIM" 3 AŞAMALI YOL HARİTASI */}
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-1 border border-purple-500/20">
                <Award className="w-3.5 h-3.5" />
                <span>{isTr ? 'Stratejik Kariyer Eylem Planı' : 'Actionable Career Blueprint'}</span>
              </div>
              <h2 className="text-xl font-bold text-white">
                {isTr ? '🎯 "Bir Sonraki Adım" Yol Haritası' : '🎯 Next Strategic Steps Roadmap'}
              </h2>
              <p className="text-xs text-slate-400">
                {isTr
                  ? 'Aldığınız eğitimleri boşlukta bırakmayıp hedefinize dönüştüren 3 fazlı somut aksiyon planı'
                  : 'A 3-phase execution roadmap converting course theory into promotion or hiring results'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Phase 1: Immediate */}
              <div className="bg-slate-900 border border-indigo-500/40 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                      {isTr ? 'Aşama 1: İlk 30 Gün' : 'Phase 1: First 30 Days'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{results.nextStepsRoadmap.phase1_immediate.timeframe}</span>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {results.nextStepsRoadmap.phase1_immediate.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-4 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
                    {results.nextStepsRoadmap.phase1_immediate.focus}
                  </p>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      {isTr ? 'Uygulanacak Eylemler:' : 'Action Items:'}
                    </span>
                    {results.nextStepsRoadmap.phase1_immediate.actionItems.map((act, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase 2: Mid-term */}
              <div className="bg-slate-900 border border-purple-500/40 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20">
                      {isTr ? 'Aşama 2: 60 Gün (Orta Vade)' : 'Phase 2: 60 Days (Mid-Term)'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{results.nextStepsRoadmap.phase2_midterm.timeframe}</span>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {results.nextStepsRoadmap.phase2_midterm.title}
                  </h4>
                  <p className="text-xs text-slate-300 mb-4 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
                    {results.nextStepsRoadmap.phase2_midterm.focus}
                  </p>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      {isTr ? 'Uygulanacak Eylemler:' : 'Action Items:'}
                    </span>
                    {results.nextStepsRoadmap.phase2_midterm.actionItems.map((act, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase 3: Strategic Goal */}
              <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-lg relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                      {isTr ? 'Aşama 3: Hedef Pozisyona Atılım' : 'Phase 3: Target Role Leap'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium flex items-center space-x-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>{results.nextStepsRoadmap.phase3_strategicGoal.expectedReadinessTime}</span>
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white mb-2">
                    {results.nextStepsRoadmap.phase3_strategicGoal.targetTitle}
                  </h4>
                  <p className="text-xs text-slate-300 mb-4 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
                    {results.nextStepsRoadmap.phase3_strategicGoal.strategicImpact}
                  </p>

                  <div className="space-y-2 mb-4">
                    <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                      {isTr ? 'Kritik Kilometre Taşları:' : 'Key Milestones:'}
                    </span>
                    {results.nextStepsRoadmap.phase3_strategicGoal.milestones.map((m, idx) => (
                      <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                        <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Next Topics & Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommended Learning Topics */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {isTr
                      ? 'Önerilen Sonraki Eğitim & Konular (Yüksek ROI)'
                      : 'High-ROI Recommended Next Topics / Certs'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isTr
                      ? 'Gereksiz eğitim tekrarı yerine kariyerinizi zıplatacak nokta atışı içerikler'
                      : 'Targeted missing topics that yield the highest market return'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {results.recommendedLearningTopics.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-white">
                        {item.topic}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                          item.priority.toLowerCase().includes('yüksek') ||
                          item.priority.toLowerCase().includes('high')
                            ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                            : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </div>
                    <div className="text-xs text-purple-300 font-medium mb-1">
                      📍 {item.providerOrCert}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.whyCrucial}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Project Ideas */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    {isTr
                      ? 'CV / Portfolyoyu Parlatacak Somut Proje Fikirleri'
                      : 'High-Impact Portfolio Projects to Build'}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {isTr
                      ? 'Eğitimdeki teoriyi işverenin önünde kanıtlayacak pratik bitirme projeleri'
                      : 'Showcase-ready proof-of-work concepts that impress hiring leads'}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {results.portfolioProjectIdeas.map((proj, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-3.5"
                  >
                    <h5 className="text-sm font-semibold text-white mb-1.5">
                      {proj.projectTitle}
                    </h5>
                    <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                      {proj.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {proj.technologiesUsed.map((tech, tidx) => (
                        <span
                          key={tidx}
                          className="px-2 py-0.5 bg-slate-900 text-slate-300 rounded text-[11px] border border-slate-700"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/30">
                      <span className="font-bold">{isTr ? 'İşe Alımcıya Etkisi: ' : 'Recruiter Impact: '}</span>
                      {proj.recruiterImpact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Elevator Pitch & LinkedIn Headlines */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            {/* Pitch */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>
                    {isTr
                      ? 'Eğitimlerinizden Beslenen 60 Saniyelik Asansör Konuşması (Elevator Pitch)'
                      : 'Your 60-Second Training-Powered Elevator Pitch'}
                  </span>
                </h4>
                <button
                  type="button"
                  onClick={() => handleCopy(results.elevatorPitch, 'pitch')}
                  className="px-2.5 py-1 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center space-x-1 border border-slate-700 transition-colors"
                >
                  {copiedSection === 'pitch' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{isTr ? 'Kopyala' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 bg-slate-800/60 p-4 rounded-xl border border-slate-700 leading-relaxed italic">
                "{results.elevatorPitch}"
              </p>
            </div>

            {/* LinkedIn Headlines */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-indigo-400" />
                <span>
                  {isTr
                    ? 'LinkedIn Başlık & Konumlandırma Önerileri'
                    : 'Recommended LinkedIn Headline Formulas'}
                </span>
              </h4>
              <div className="space-y-2">
                {results.linkedinHeadlines.map((hl, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/60 text-xs text-slate-200"
                  >
                    <span>{hl}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(hl, `hl-${idx}`)}
                      className="text-slate-400 hover:text-white p-1"
                    >
                      {copiedSection === `hl-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Bridge to Interview Questions button */}
            {onSendToInterviewQuestions && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    const backgroundSummary = `${results.profileSummary} Kazanılan Beceriler: ${results.competencyMatrix.masteredSkills.join(', ')}.`;
                    onSendToInterviewQuestions(backgroundSummary);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {isTr
                      ? 'Bu Profil Bilgileriyle Mülakat Soruları Üret'
                      : 'Use this Profile to Generate Targeted Interview Questions'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
