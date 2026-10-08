import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

async function generateWithFallback(prompt: string, responseSchema?: any) {
  const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          ...(responseSchema ? { responseSchema } : {}),
        },
      });

      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`Model ${model} failed, trying next fallback:`, err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('All Gemini models unavailable.');
}

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

app.post('/api/analyze', async (req, res) => {
  try {
    const {
      decision,
      options,
      context,
      priorities,
      riskTolerance = 'moderate',
      timeHorizon = 'medium',
    } = req.body;

    if (!decision || typeof decision !== 'string' || !decision.trim()) {
      return res.status(400).json({ error: 'Please provide a decision to analyze.' });
    }

    const cleanOptions: string[] = Array.isArray(options) && options.length >= 2
      ? options.map((opt: any) => String(opt).trim()).filter(Boolean)
      : ['Option A', 'Option B'];

    const prompt = `
You are "The Tiebreaker", an elite decision strategist and analytical advisor.
Analyze this high-stakes decision dilemma and provide a rigorous, objective, multi-framework breakdown.

Dilemma:
"${decision}"

Options to evaluate:
${cleanOptions.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}

Additional Context / Constraints:
"${context || 'No specific constraints provided.'}"

Key User Priorities:
${Array.isArray(priorities) && priorities.length > 0 ? priorities.join(', ') : 'Balanced practical priorities'}

Risk Tolerance: ${riskTolerance}
Time Horizon: ${timeHorizon}

You MUST return a valid JSON object strictly matching this format without any surrounding commentary:
{
  "summary": "Concise 2-3 sentence overview of the dilemma and the core tension between choices.",
  "options": [
    {
      "id": "opt-1",
      "name": "Exact name of option",
      "summary": "1-sentence essence of this path",
      "pros": [
        {
          "id": "pro-1",
          "text": "Clear concise positive factor",
          "category": "Financial" | "Career" | "Lifestyle" | "Psychological" | "Strategic",
          "impact": 1 to 5 (integer, 5 being highest positive impact),
          "explanation": "1-2 sentences on why this matters in practice"
        }
      ],
      "cons": [
        {
          "id": "con-1",
          "text": "Clear concise downside or risk factor",
          "category": "Financial" | "Career" | "Lifestyle" | "Psychological" | "Strategic",
          "impact": 1 to 5 (integer, 5 being highest downside severity),
          "explanation": "1-2 sentences on the practical drawback or risk"
        }
      ],
      "swot": {
        "strengths": ["Clear internal strength of this choice", "..."],
        "weaknesses": ["Internal vulnerability or compromise", "..."],
        "opportunities": ["External upside or serendipity unlocked", "..."],
        "threats": ["External risks or potential regret triggers", "..."]
      }
    }
  ],
  "comparisonMatrix": {
    "criteria": [
      {
        "id": "crit-1",
        "name": "Criterion name (e.g., Financial Upside, Peace of Mind, Flexibility, Long-Term Growth, Effort/Stress)",
        "weight": 1 to 5 (suggested importance integer based on user profile),
        "description": "Why this criterion is critical to evaluating this specific decision"
      }
    ],
    "scores": {
      "crit-1": {
        "opt-1": {
          "score": 1 to 10 (integer rating),
          "rationale": "Brief specific reason for this score"
        }
      }
    }
  },
  "swotCrossAnalysis": {
    "soStrategies": ["Strategic synergy between option strengths and market/life opportunities"],
    "woStrategies": ["Tactics to overcome weaknesses by seizing opportunities"],
    "stStrategies": ["How to leverage strengths to protect against external threats"],
    "wtStrategies": ["Defensive precautions to mitigate weaknesses and threats"]
  },
  "tiebreakerVerdict": {
    "recommendedOptionId": "opt-1",
    "confidencePercent": 75,
    "headline": "Decisive, memorable punchline verdict",
    "coreReasoning": "Deep, clear synthesis of why this path edges out the competition given the context.",
    "conditionalRules": [
      {
        "condition": "If your primary driver is X...",
        "chooseOption": "Option name",
        "rationale": "Reason"
      },
      {
        "condition": "If you cannot tolerate Y...",
        "chooseOption": "Option name",
        "rationale": "Reason"
      }
    ],
    "devilsAdvocate": "The sharpest blind spot or hidden assumption the user might be unconsciously ignoring.",
    "tenTenTen": {
      "tenMinutes": "Immediate emotional feeling right after choosing",
      "tenMonths": "Realistic day-to-day reality 10 months down the line",
      "tenYears": "Long-term cumulative trajectory 10 years later"
    },
    "deRiskingSteps": [
      "Concrete reversible experiment or step 1 to take this week",
      "Concrete step 2 before locking in final commitment",
      "Specific clarifying question to ask stakeholders"
    ]
  }
}

Ensure every option in the options list gets its matching id in comparisonMatrix.scores. Generate between 3 to 5 criteria, 3 to 5 pros, 3 to 4 cons, and 3 items per SWOT quadrant.
`;

    const text = await generateWithFallback(prompt);

    let parsedData;
    try {
      parsedData = JSON.parse(text);
    } catch {
      // In case there are markdown ticks
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Decision analysis error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze decision. Please try again.',
    });
  }
});

app.post('/api/deep-dive', async (req, res) => {
  try {
    const { decision, question, optionName, currentAnalysis } = req.body;

    if (!question || !decision) {
      return res.status(400).json({ error: 'Question and decision are required.' });
    }

    const prompt = `
You are "The Tiebreaker" decision advisor.
The user is deliberating: "${decision}".
${optionName ? `Focused specifically on: "${optionName}"` : ''}

User's follow-up inquiry / deep dive question:
"${question}"

Provide a crisp, tactical, highly practical response.
You MUST return a JSON object strictly matching this format:
{
  "insight": "Direct analytical answer addressing the query in 2-3 insightful paragraphs.",
  "riskMitigation": ["Actionable step to prevent worst-case scenario", "Safety net suggestion"],
  "tacticalMoves": ["Actionable maneuver or negotiation counter-offer", "Experiment to run"],
  "verdictImpact": "Does this tilt the balance towards or away from this option? 1-2 sentence conclusion."
}
`;

    const text = await generateWithFallback(prompt);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const cleaned = text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
      parsed = JSON.parse(cleaned);
    }

    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Deep dive error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to complete deep dive inquiry.',
    });
  }
});

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Tiebreaker server running on http://localhost:${PORT}`);
  });
}

startServer();
