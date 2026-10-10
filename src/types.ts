export type Language = 'tr' | 'en';

export interface InterviewerMindset {
  perspectiveSummary: string;
  keyPriorities: string[];
  redFlagsToAvoid: string[];
  whatWowsThem: string[];
}

export interface StarGuidance {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  interviewerObjective: string;
  starGuidance: StarGuidance;
  keyTalkingPoints: string[];
  commonTraps: string[];
  idealAnswerOutline: string;
}

export interface ReverseQuestion {
  question: string;
  strategicReason: string;
}

export interface InterviewQuestionsResult {
  interviewerMindset: InterviewerMindset;
  questions: InterviewQuestion[];
  reverseQuestions: ReverseQuestion[];
}

export interface TrainingItem {
  id: string;
  title: string;
  institution: string;
  syllabusOrContent: string;
  keySkills: string;
  projectsCompleted: string;
}

export interface CompetencyMatrix {
  masteredSkills: string[];
  emergingSkills: string[];
  missingSkillGaps: string[];
}

export interface RoadmapPhase {
  title: string;
  timeframe: string;
  focus: string;
  actionItems: string[];
}

export interface StrategicGoalPhase {
  targetTitle: string;
  expectedReadinessTime: string;
  strategicImpact: string;
  milestones: string[];
}

export interface NextStepsRoadmap {
  phase1_immediate: RoadmapPhase;
  phase2_midterm: RoadmapPhase;
  phase3_strategicGoal: StrategicGoalPhase;
}

export interface RecommendedLearningTopic {
  topic: string;
  providerOrCert: string;
  whyCrucial: string;
  priority: string;
}

export interface PortfolioProjectIdea {
  projectTitle: string;
  description: string;
  technologiesUsed: string[];
  recruiterImpact: string;
}

export interface TrainingAnalysisResult {
  profileSummary: string;
  readinessScore: number;
  readinessVerdict: string;
  competencyMatrix: CompetencyMatrix;
  nextStepsRoadmap: NextStepsRoadmap;
  recommendedLearningTopics: RecommendedLearningTopic[];
  portfolioProjectIdeas: PortfolioProjectIdea[];
  elevatorPitch: string;
  linkedinHeadlines: string[];
}

export interface EvaluationRubric {
  clarityAndTone: number;
  roleRelevance: number;
  starMethodology: number;
  impactAndMetrics: number;
}

export interface AnswerEvaluationResult {
  overallScore: number;
  feedbackVerdict: string;
  rubric: EvaluationRubric;
  strengths: string[];
  areasToImprove: string[];
  interviewerSpecificCritique: string;
  polishedModelAnswer: string;
}
