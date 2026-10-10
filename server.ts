import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Available models in order of priority for text tasks
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

// Helper to execute generation with automatic model fallback
async function generateWithFallback(params: {
  contents: any;
  config?: any;
}) {
  let lastError: any = null;
  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });
      if (response && response.text) {
        return response;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, attempting next model... Error:`, err?.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error("Modeller şu an yoğunluk yaşıyor. Lütfen birkaç saniye sonra tekrar deneyiniz.");
}

function cleanErrorMessage(err: any): string {
  if (!err) return "Bir hata oluştu.";
  const raw = err.message || String(err);
  try {
    const parsed = JSON.parse(raw);
    if (parsed.error?.message) {
      return parsed.error.message;
    }
  } catch {}
  return raw;
}

// 1. Generate Interview Questions tailored to Interviewer Title
app.post("/api/interview/generate-questions", async (req, res) => {
  try {
    const {
      interviewerTitle,
      targetRole,
      companyType,
      interviewStage,
      candidateBackground,
      language = "tr",
    } = req.body;

    if (!interviewerTitle) {
      return res.status(400).json({ error: "Interviewer title is required." });
    }

    const systemInstruction = `You are an elite Executive Interview Coach and Hiring Intelligence Agent.
The user wants to prepare for an interview where the interviewer has the title: "${interviewerTitle}".
Candidate's Target Role: "${targetRole || "Belirtilmedi"}".
Company Industry/Type: "${companyType || "Teknoloji / Kurumsal"}".
Interview Stage: "${interviewStage || "Teknik & Yetkinlik Mülakatı"}".
Candidate's background context/courses: "${candidateBackground || "Genel"}".
Language of output: "${language === "en" ? "English" : "Turkish"}".

Your goal:
1. Decode the Interviewer Persona: Why does a "${interviewerTitle}" think differently? What are their KPIs, anxieties, red flags, and what wows them?
2. Generate 6 to 8 highly realistic, incisive, and title-specific questions that this specific person will realistically ask. (e.g. an Engineering Manager tests architectural choices and team conflict; a CFO tests cost-awareness and ROI; an HR Director tests cultural alignment, resilience, and career trajectory; a CMO tests growth loops, brand integrity, and cross-channel impact).
3. For each question, provide:
   - Category
   - What the interviewer is secretly evaluating (their hidden agenda)
   - STAR (Situation, Task, Action, Result) response strategy
   - Common traps / Red flags to avoid
   - Suggested high-impact talking points
   - An example ideal outline
4. Generate 3 high-leverage "reverse questions" that the candidate should ask THIS specific interviewer to demonstrate profound domain insight.

Return valid JSON adhering to the specified schema.`;

    const response = await generateWithFallback({
      contents: "Generate the customized interview guide and questions for this interviewer persona.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interviewerMindset: {
              type: Type.OBJECT,
              properties: {
                perspectiveSummary: { type: Type.STRING },
                keyPriorities: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                redFlagsToAvoid: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                whatWowsThem: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["perspectiveSummary", "keyPriorities", "redFlagsToAvoid", "whatWowsThem"],
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  question: { type: Type.STRING },
                  interviewerObjective: { type: Type.STRING },
                  starGuidance: {
                    type: Type.OBJECT,
                    properties: {
                      situation: { type: Type.STRING },
                      task: { type: Type.STRING },
                      action: { type: Type.STRING },
                      result: { type: Type.STRING },
                    },
                    required: ["situation", "task", "action", "result"],
                  },
                  keyTalkingPoints: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  commonTraps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  idealAnswerOutline: { type: Type.STRING },
                },
                required: [
                  "id",
                  "category",
                  "question",
                  "interviewerObjective",
                  "starGuidance",
                  "keyTalkingPoints",
                  "commonTraps",
                  "idealAnswerOutline",
                ],
              },
            },
            reverseQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  strategicReason: { type: Type.STRING },
                },
                required: ["question", "strategicReason"],
              },
            },
          },
          required: ["interviewerMindset", "questions", "reverseQuestions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error generating interview questions:", error);
    res.status(500).json({ error: cleanErrorMessage(error) });
  }
});

// 2. Analyze Training / Course contents & Generate Next Strategic Career Step
app.post("/api/career/analyze-trainings", async (req, res) => {
  try {
    const {
      trainings = [],
      currentRoleOrLevel = "",
      targetGoal = "",
      language = "tr",
    } = req.body;

    if (!Array.isArray(trainings) || trainings.length === 0) {
      return res.status(400).json({ error: "At least one training content or course is required." });
    }

    const trainingsText = trainings
      .map(
        (t, idx) =>
          `[Eğitim #${idx + 1}] Unvan: ${t.title || "Eğitim"}\nKurum/Platform: ${t.institution || "Belirtilmedi"}\nİçerik/Müfredat: ${t.syllabusOrContent || ""}\nKazanılan Beceriler: ${t.keySkills || ""}\nTamamlanan Projeler: ${t.projectsCompleted || ""}`
      )
      .join("\n\n");

    const systemInstruction = `You are a Principal Career Architect and Executive Tech Mentor.
The user provides the comprehensive list and contents of the courses/trainings they have completed.
User's Current Level/Role: "${currentRoleOrLevel || "Belirtilmedi"}".
Target Ambition/Goal: "${targetGoal || "Bir sonraki seviyeye geçiş / Kariyer atılımı"}".
Output language: "${language === "en" ? "English" : "Turkish"}".

Your task is to analyze these training contents deeply and provide a pragmatic, inspiring "Next Step" (Bir Sonraki Adım) Career Blueprint:
1. Synthesize their cumulative competencies, strengths, and market readiness.
2. Identify critical skill gaps required to reach their target goal.
3. Formulate an actionable 3-phase strategic roadmap (Immediate 30-Day, Mid-term 60-Day, and Long-Term Horizon).
4. Provide tangible high-ROI recommended next certifications/courses or specialized topics.
5. Provide 2-3 innovative portfolio project ideas that bridge theory into production-grade proof of work.
6. Provide an impactful 60-second Elevator Pitch and LinkedIn headline formulas capitalizing on their specific training background.

Return strictly valid JSON adhering to the schema.`;

    const response = await generateWithFallback({
      contents: `Here are the completed trainings and contents:\n\n${trainingsText}\n\nPlease generate the in-depth career analysis and next steps roadmap.`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profileSummary: { type: Type.STRING },
            readinessScore: { type: Type.NUMBER }, // 1-100
            readinessVerdict: { type: Type.STRING },
            competencyMatrix: {
              type: Type.OBJECT,
              properties: {
                masteredSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                emergingSkills: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                missingSkillGaps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["masteredSkills", "emergingSkills", "missingSkillGaps"],
            },
            nextStepsRoadmap: {
              type: Type.OBJECT,
              properties: {
                phase1_immediate: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    focus: { type: Type.STRING },
                    actionItems: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["title", "timeframe", "focus", "actionItems"],
                },
                phase2_midterm: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    timeframe: { type: Type.STRING },
                    focus: { type: Type.STRING },
                    actionItems: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["title", "timeframe", "focus", "actionItems"],
                },
                phase3_strategicGoal: {
                  type: Type.OBJECT,
                  properties: {
                    targetTitle: { type: Type.STRING },
                    expectedReadinessTime: { type: Type.STRING },
                    strategicImpact: { type: Type.STRING },
                    milestones: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ["targetTitle", "expectedReadinessTime", "strategicImpact", "milestones"],
                },
              },
              required: ["phase1_immediate", "phase2_midterm", "phase3_strategicGoal"],
            },
            recommendedLearningTopics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  providerOrCert: { type: Type.STRING },
                  whyCrucial: { type: Type.STRING },
                  priority: { type: Type.STRING }, // 'Yüksek' | 'Orta'
                },
                required: ["topic", "providerOrCert", "whyCrucial", "priority"],
              },
            },
            portfolioProjectIdeas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  projectTitle: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologiesUsed: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  recruiterImpact: { type: Type.STRING },
                },
                required: ["projectTitle", "description", "technologiesUsed", "recruiterImpact"],
              },
            },
            elevatorPitch: { type: Type.STRING },
            linkedinHeadlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: [
            "profileSummary",
            "readinessScore",
            "readinessVerdict",
            "competencyMatrix",
            "nextStepsRoadmap",
            "recommendedLearningTopics",
            "portfolioProjectIdeas",
            "elevatorPitch",
            "linkedinHeadlines",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error analyzing trainings:", error);
    res.status(500).json({ error: cleanErrorMessage(error) });
  }
});

// 3. Evaluate User's Answer in Mock Interview
app.post("/api/interview/evaluate-answer", async (req, res) => {
  try {
    const {
      interviewerTitle,
      question,
      userAnswer,
      targetRole,
      language = "tr",
    } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: "Question and user answer are required." });
    }

    const systemInstruction = `You are the simulated interviewer holding the title: "${interviewerTitle || "Hiring Manager"}" hiring for "${targetRole || "Candidate"}".
Evaluate the candidate's answer through the exact perspective of this role.
Candidate answered: "${userAnswer}".
Question asked: "${question}".
Language of output: "${language === "en" ? "English" : "Turkish"}".

Provide rigorous, constructive, and realistic feedback:
- Overall score out of 10.
- Category breakdowns (Clarity, Relevance to Interviewer's concerns, STAR structure, Quantifiable impact).
- Strengths demonstrated.
- Weaknesses or missed opportunities.
- Personalized coaching advice on how to win over someone with your specific title.
- A rewritten, polished "Model Answer" that transforms their experience into an irresistible executive response.

Return JSON adhering to schema.`;

    const response = await generateWithFallback({
      contents: "Evaluate this candidate's interview answer.",
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            feedbackVerdict: { type: Type.STRING },
            rubric: {
              type: Type.OBJECT,
              properties: {
                clarityAndTone: { type: Type.NUMBER }, // 1-10
                roleRelevance: { type: Type.NUMBER }, // 1-10
                starMethodology: { type: Type.NUMBER }, // 1-10
                impactAndMetrics: { type: Type.NUMBER }, // 1-10
              },
              required: ["clarityAndTone", "roleRelevance", "starMethodology", "impactAndMetrics"],
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            areasToImprove: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            interviewerSpecificCritique: { type: Type.STRING },
            polishedModelAnswer: { type: Type.STRING },
          },
          required: [
            "overallScore",
            "feedbackVerdict",
            "rubric",
            "strengths",
            "areasToImprove",
            "interviewerSpecificCritique",
            "polishedModelAnswer",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Error evaluating interview answer:", error);
    res.status(500).json({ error: cleanErrorMessage(error) });
  }
});

// 4. Quick Coach Chat for ad-hoc advice
app.post("/api/career/coach-chat", async (req, res) => {
  try {
    const { message, context = "", language = "tr" } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const systemInstruction = `You are an executive Career & Interview Coach.
Context provided by candidate: ${context}
Output language: ${language === "en" ? "English" : "Turkish"}
Give concise, sharp, high-value advice, actionable tips, or interview formulation.`;

    const response = await generateWithFallback({
      contents: message,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("Error in coach chat:", error);
    res.status(500).json({ error: cleanErrorMessage(error) });
  }
});

// Start server with Vite middleware in development or static serve in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== "production";

  if (isDev) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: {
        middlewareMode: true,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT} (dev: ${isDev})`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
