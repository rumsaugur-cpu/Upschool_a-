import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Send,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Briefcase,
  Layers,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import { AnswerEvaluationResult, Language } from '../types';

interface MockInterviewPracticeProps {
  initialQuestion?: string;
  initialInterviewerTitle?: string;
  initialTargetRole?: string;
  language: Language;
}

export const MockInterviewPractice: React.FC<MockInterviewPracticeProps> = ({
  initialQuestion = 'Bize geçmişte yönettiğiniz ve ölçülebilir başarı sağladığınız en karmaşık projeden bahseder misiniz?',
  initialInterviewerTitle = 'Chief Marketing Officer (CMO)',
  initialTargetRole = 'Kıdemli Dijital Pazarlama Uzmanı',
  language,
}) => {
  const isTr = language === 'tr';

  const [question, setQuestion] = useState(initialQuestion);
  const [interviewerTitle, setInterviewerTitle] = useState(initialInterviewerTitle);
  const [targetRole, setTargetRole] = useState(initialTargetRole);
  const [userAnswer, setUserAnswer] = useState('');

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<AnswerEvaluationResult | null>(null);
  const [copiedPolished, setCopiedPolished] = useState(false);

  // Update if props change
  useEffect(() => {
    if (initialQuestion) setQuestion(initialQuestion);
    if (initialInterviewerTitle) setInterviewerTitle(initialInterviewerTitle);
    if (initialTargetRole) setTargetRole(initialTargetRole);
  }, [initialQuestion, initialInterviewerTitle, initialTargetRole]);

  // Timer ticker
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Setup Web Speech API if available
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = isTr ? 'tr-TR' : 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setUserAnswer((prev) => (prev ? prev + ' ' : '') + currentTranscript);
    };

    recognition.onerror = (e: any) => {
      console.warn('Speech recognition error:', e);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, [isTr]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsTimerRunning(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setIsTimerRunning(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEvaluate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userAnswer.trim()) {
      setError(
        isTr
          ? 'Lütfen mülakat sorusuna verdiğiniz yanıtı yazın veya ses kaydı ile söyleyin.'
          : 'Please enter or record your answer before submitting.'
      );
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsTimerRunning(false);

    try {
      const response = await fetch('/api/interview/evaluate-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerTitle,
          question,
          userAnswer,
          targetRole,
          language,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Evaluation failed');
      }

      const data: AnswerEvaluationResult = await response.json();
      setEvaluation(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          (isTr
            ? 'Cevabınız değerlendirilirken hata oluştu.'
            : 'Error evaluating answer.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAnswer = () => {
    setUserAnswer('');
    setEvaluation(null);
    setTimerSeconds(0);
    setIsTimerRunning(false);
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPolished = () => {
    if (evaluation?.polishedModelAnswer) {
      navigator.clipboard.writeText(evaluation.polishedModelAnswer);
      setCopiedPolished(true);
      setTimeout(() => setCopiedPolished(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-2 border border-emerald-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>{isTr ? 'Canlı Mülakat Simülatörü' : 'Interactive Mock Simulator'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isTr
                ? 'Mülakatçı Gözüyle Cevap Değerlendirmesi & Puanlama'
                : 'AI Interviewer Scoring & Answer Refinement'}
            </h1>
            <p className="text-slate-300 text-sm mt-1.5 max-w-2xl">
              {isTr
                ? 'Sorulan soruya kendi cümlenizle yanıt verin (ister yazın, ister mikrofonla konuşun). Seçilen mülakatçı unvanı cevabınızı STAR, açıklık ve etki kriterleriyle puanlasın, size mükemmel bir yönetici yanıtı hazırlasın.'
                : 'Answer the question in your own words via text or voice. The simulated interviewer evaluates clarity, role relevance, and metrics, then writes a polished executive version.'}
            </p>
          </div>

          {/* Timer Display */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-center space-x-3 shrink-0">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {isTr ? 'Yanıt Süresi (Önerilen 2-3 dk)' : 'Answer Duration'}
              </span>
              <span className="text-xl font-mono font-bold text-emerald-400">
                {formatTimer(timerSeconds)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
            >
              {isTimerRunning ? (isTr ? 'Durdur' : 'Pause') : isTr ? 'Başlat' : 'Start'}
            </button>
          </div>
        </div>
      </div>

      {/* Simulator Interface */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Setup Context: Interviewer, Role & Question */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {isTr ? 'Simüle Edilen Mülakatçı Unvanı' : 'Simulated Interviewer Title'}
            </label>
            <div className="relative">
              <Briefcase className="w-4 h-4 text-emerald-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={interviewerTitle}
                onChange={(e) => setInterviewerTitle(e.target.value)}
                placeholder="Örn: Chief Marketing Officer (CMO), CTO"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              {isTr ? 'Hedef Pozisyon' : 'Target Role'}
            </label>
            <div className="relative">
              <Layers className="w-4 h-4 text-purple-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Örn: Kıdemli Dijital Pazarlama Uzmanı"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>
        </div>

        {/* The Question Prompt */}
        <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4">
          <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>{isTr ? 'Mülakat Sorusu:' : 'Interview Question:'}</span>
          </label>
          <textarea
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-snug"
          />
        </div>

        {/* User Answer Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              {isTr ? 'Sizin Yanıtınız (Metin veya Ses):' : 'Your Answer (Text or Voice):'}
            </label>

            {/* Voice Recording Control */}
            {speechSupported && (
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isRecording
                    ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>{isTr ? 'Kaydı Durdur' : 'Stop Recording'}</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isTr ? 'Mikrofonla Cevapla' : 'Record Answer'}</span>
                  </>
                )}
              </button>
            )}
          </div>

          <textarea
            rows={6}
            value={userAnswer}
            onChange={(e) => {
              setUserAnswer(e.target.value);
              if (!isTimerRunning && e.target.value.length > 5) {
                setIsTimerRunning(true);
              }
            }}
            placeholder={
              isTr
                ? 'Cevabınızı buraya yazın veya mikrofon butonuna basarak konuşun. (İpucu: Durumu belirtin, görevinizi tanımlayın, aldığınız spesifik aksiyonları ve elde ettiğiniz sayısal sonuçları ekleyin)...'
                : 'Type your answer or speak with the microphone. Include the situation, task, action, and measurable result...'
            }
            className="w-full p-4 bg-slate-800/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 leading-relaxed font-normal"
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handleResetAnswer}
            className="px-3 py-2 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isTr ? 'Sıfırla' : 'Reset'}</span>
          </button>

          <button
            type="button"
            disabled={isLoading || !userAnswer.trim()}
            onClick={handleEvaluate}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>
                  {isTr
                    ? `${interviewerTitle} Gözüyle Değerlendiriliyor...`
                    : `Evaluating as ${interviewerTitle}...`}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {isTr ? 'Cevabımı Değerlendir & Puanla' : 'Evaluate & Score My Answer'}
                </span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Evaluation Results Card */}
      {evaluation && (
        <div className="space-y-6 animate-fadeIn">
          {/* Score Header */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                  {isTr ? 'Mülakatçı Kararı & Genel Skor' : 'Interviewer Verdict & Score'}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">
                  {evaluation.feedbackVerdict}
                </h3>
                <p className="text-xs text-slate-400">
                  {isTr
                    ? `${interviewerTitle} pozisyonunun beklentilerine göre puanlandı.`
                    : `Scored against the specific expectations of a ${interviewerTitle}.`}
                </p>
              </div>

              {/* Big Score Box */}
              <div className="flex items-center space-x-3 bg-slate-800/80 px-5 py-3.5 rounded-2xl border border-slate-700/80 self-start sm:self-auto">
                <Award className="w-7 h-7 text-emerald-400" />
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {isTr ? 'Mülakat Puanı' : 'Score'}
                  </div>
                  <div className="text-2xl font-black text-white">
                    {evaluation.overallScore} <span className="text-sm font-normal text-slate-400">/ 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rubric Breakdown (4 criteria) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6">
              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {isTr ? 'Açıklık ve Ton' : 'Clarity & Tone'}
                </span>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-slate-700 h-2 rounded-full mr-2 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${(evaluation.rubric.clarityAndTone / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {evaluation.rubric.clarityAndTone}/10
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {isTr ? 'Rol ve Unvan Uyumu' : 'Role Relevance'}
                </span>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-slate-700 h-2 rounded-full mr-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{ width: `${(evaluation.rubric.roleRelevance / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {evaluation.rubric.roleRelevance}/10
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {isTr ? 'STAR Metodu Yapısı' : 'STAR Methodology'}
                </span>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-slate-700 h-2 rounded-full mr-2 overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-full"
                      style={{ width: `${(evaluation.rubric.starMethodology / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {evaluation.rubric.starMethodology}/10
                  </span>
                </div>
              </div>

              <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                  {isTr ? 'Etki & Metrikler' : 'Impact & Metrics'}
                </span>
                <div className="flex items-center justify-between">
                  <div className="w-full bg-slate-700 h-2 rounded-full mr-2 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full"
                      style={{ width: `${(evaluation.rubric.impactAndMetrics / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">
                    {evaluation.rubric.impactAndMetrics}/10
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback: Strengths, Areas to improve & Critique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{isTr ? 'Cevabınızdaki Güçlü Yönler' : 'Demonstrated Strengths'}</span>
              </div>
              <ul className="space-y-1.5">
                {evaluation.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to improve */}
            <div className="bg-red-950/20 border border-red-900/40 rounded-xl p-4">
              <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{isTr ? 'Geliştirilmesi Gereken Noktalar' : 'Areas to Improve'}</span>
              </div>
              <ul className="space-y-1.5">
                {evaluation.areasToImprove.map((area, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                    <span className="text-red-400 font-bold">•</span>
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Role specific critique */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1 flex items-center space-x-1.5">
              <Briefcase className="w-4 h-4" />
              <span>
                {isTr
                  ? `${interviewerTitle} Gözüyle Özel Eleştiri & Tavsiye`
                  : `Direct Critique from ${interviewerTitle}:`}
              </span>
            </span>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              {evaluation.interviewerSpecificCritique}
            </p>
          </div>

          {/* Polished Model Answer */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/40 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-indigo-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>
                  {isTr
                    ? '✨ Güçlendirilmiş Model Yanıt (Executive Answer)'
                    : '✨ Polished Model Answer (Executive Level)'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyPolished}
                className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center space-x-1 border border-slate-700 transition-colors"
              >
                {copiedPolished ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{isTr ? 'Cevabı Kopyala' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed bg-slate-800/70 p-4 rounded-xl border border-slate-700 font-normal">
              "{evaluation.polishedModelAnswer}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
