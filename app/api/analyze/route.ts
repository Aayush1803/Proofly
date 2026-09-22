import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { AnalyzeRequest, AnalysisResult, Claim, TrustedSource, TrustBreakdown } from '@/lib/types';

// ─── Gemini prompt ─────────────────────────────────────────────────────────────
const PROMPT = `You are a STRICT factual verification AI system for India.

RULES:
1. Analyze ONLY what is explicitly in the input. Do NOT add claims that aren't there.
2. For simple 1-sentence inputs → extract ONLY 1 claim.
3. Scientifically wrong claims (e.g. "sugar cures cancer") → classify as "False" with confidence 92-98.
4. Auto-detect the language of the input. You MUST support all 23 official Indian languages:
   Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam,
   Odia, Punjabi, Assamese, Maithili, Sanskrit, Kashmiri, Nepali, Sindhi, Konkani,
   Dogri, Manipuri (Meitei), Bodo, and Santali.
   Analyze internally in English. Respond in the SAME language as the user's input.
5. Output ONLY valid JSON — no markdown, no code fences, no extra text.

CLASSIFICATION:
- "True"       → verified by scientific/official consensus
- "False"      → contradicts scientific/official consensus  
- "Misleading" → partially true but missing critical context
- "Opinion"    → clearly subjective, not verifiable

SOURCES GUIDANCE (CRITICAL — read carefully):
- You MUST provide 3-4 REAL, SPECIFIC sources that are directly relevant to the TOPIC of the claim.
- Each source must have a real URL pointing to a relevant page (not just the homepage).
- Choose sources based on the TOPIC of the claim:
  * Health/Medical claims → WHO, NIH, PubMed, ICMR, MoHFW (India), WebMD, Mayo Clinic
  * Government/Policy claims → PIB India, Press Information Bureau, official ministry websites, PRS Legislative Research
  * Economic/Finance claims → RBI, SEBI, Ministry of Finance, Economic Survey, World Bank, IMF
  * Science/Technology claims → Nature, Science journal, IEEE, ISRO, CSIR India
  * Fact-check needs → Alt News, BOOM Live, India Today Fact Check, Snopes, FactCheck.org
  * Legal/Judicial claims → Supreme Court of India (sci.gov.in), Law Commission of India
  * Environment claims → MoEFCC India, IPCC, NASA, UNEP
  * Agriculture claims → Ministry of Agriculture India, ICAR, FAO
  * Sports claims → BCCI, IOC, relevant sports federation websites
  * Political/Electoral claims → Election Commission of India, ADR India, Lok Sabha/Rajya Sabha
- NEVER default to generic sources when specific ones apply.
- ALWAYS use real, working URLs from official/authoritative domains.

OUTPUT FORMAT (strict JSON, every field required):
{
  "language_detected": "<detected language name>",
  "claims": [
    { "text": "<exact claim from input>", "classification": "<True|False|Misleading|Opinion>", "confidence": <0-100 integer> }
  ],
  "trust_score": <integer 0-100: 0-34=misinformation, 35-64=misleading, 65-100=credible>,
  "trust_breakdown": {
    "source_reliability": <integer 0-100: how credible and verifiable are the implied or cited sources?>,
    "factual_accuracy": <integer 0-100: how factually correct is the specific claim based on evidence?>,
    "context_integrity": <integer 0-100: does the claim present context accurately without omission or distortion?>,
    "emotional_language": <integer 0-100: how emotionally charged or manipulative is the language? HIGH = manipulative, LOW = neutral>
  },
  "fact_verification": {
    "correct_info": "<detailed correction or confirmation explaining what the evidence actually says>",
    "sources": [
      { "name": "<SPECIFIC source name relevant to THIS topic>", "url": "<https://real-relevant-url.com/specific-page>" }
    ]
  },
  "explanation": {
    "detailed": "<2-3 sentence expert explanation of why this is false/true/misleading>",
    "eli10": "<Simple explanation for a 10-year-old child>"
  },
  "virality_risk": {
    "score": <integer 0-100: how likely is this to spread virally? Consider emotional appeal and shareability>,
    "level": "<Low|Medium|High>",
    "reason": "<one sentence why this would or would not spread virally>"
  },
  "context_analysis": {
    "regional": "<India-specific regional context for this claim>",
    "cultural": "<Cultural framing or sensitivity context>",
    "sensitivity": "<HIGH|MEDIUM|LOW> — <reason for sensitivity rating>"
  },
  "counter_message": "<A factual, polite counter-message someone can share to debunk this claim>"
}

TRUST SCORE GUIDANCE:
- Claim is definitively TRUE (e.g. basic math, established science): trust_score = 80-100
- Claim is mostly true but lacks context: trust_score = 60-79
- Claim is misleading or mixed: trust_score = 35-59
- Claim is false or misinformation: trust_score = 0-34

TRUST BREAKDOWN GUIDANCE:
- source_reliability: 0 = no credible sources exist; 100 = backed by peer-reviewed/official sources
- factual_accuracy: 0 = completely false; 100 = precisely correct
- context_integrity: 0 = severely misleading by omission; 100 = full context provided
- emotional_language: 0 = calm/neutral; 100 = fear-mongering/panic-inducing

INPUT TO ANALYZE:
`;


// ─── Topic-aware fallback sources ─────────────────────────────────────────────
type TopicCategory =
  | 'health' | 'government' | 'economy' | 'science' | 'environment'
  | 'agriculture' | 'sports' | 'legal' | 'election' | 'default';

const TOPIC_SOURCE_MAP: Record<TopicCategory, TrustedSource[]> = {
  health: [
    { name: 'WHO',                    url: 'https://www.who.int/news-room/fact-sheets',               logo: 'W' },
    { name: 'ICMR India',             url: 'https://www.icmr.gov.in/',                                 logo: 'I' },
    { name: 'MoHFW India',            url: 'https://www.mohfw.gov.in/',                                logo: 'M' },
    { name: 'NIH PubMed',             url: 'https://pubmed.ncbi.nlm.nih.gov/',                         logo: 'N' },
  ],
  government: [
    { name: 'PIB India',              url: 'https://pib.gov.in/FactCheck.aspx',                        logo: 'P' },
    { name: 'India.gov.in',           url: 'https://www.india.gov.in/',                                logo: 'I' },
    { name: 'PRS Legislative',        url: 'https://prsindia.org/',                                    logo: 'L' },
    { name: 'BOOM Live',              url: 'https://www.boomlive.in/',                                 logo: 'B' },
  ],
  economy: [
    { name: 'Reserve Bank of India',  url: 'https://www.rbi.org.in/',                                  logo: 'R' },
    { name: 'Ministry of Finance',    url: 'https://www.finmin.nic.in/',                               logo: 'M' },
    { name: 'World Bank India',       url: 'https://www.worldbank.org/en/country/india',               logo: 'W' },
    { name: 'SEBI',                   url: 'https://www.sebi.gov.in/',                                 logo: 'S' },
  ],
  science: [
    { name: 'ISRO',                   url: 'https://www.isro.gov.in/',                                 logo: 'I' },
    { name: 'CSIR India',             url: 'https://www.csir.res.in/',                                 logo: 'C' },
    { name: 'Nature',                 url: 'https://www.nature.com/',                                  logo: 'N' },
    { name: 'IEEE Spectrum',          url: 'https://spectrum.ieee.org/',                               logo: 'S' },
  ],
  environment: [
    { name: 'MoEFCC India',           url: 'https://moef.gov.in/',                                     logo: 'M' },
    { name: 'IPCC',                   url: 'https://www.ipcc.ch/',                                     logo: 'I' },
    { name: 'NASA Climate',           url: 'https://climate.nasa.gov/',                                logo: 'N' },
    { name: 'UNEP',                   url: 'https://www.unep.org/',                                    logo: 'U' },
  ],
  agriculture: [
    { name: 'Ministry of Agriculture',url: 'https://agricoop.nic.in/',                                 logo: 'M' },
    { name: 'ICAR',                   url: 'https://icar.org.in/',                                     logo: 'I' },
    { name: 'FAO',                    url: 'https://www.fao.org/',                                     logo: 'F' },
    { name: 'PIB India',              url: 'https://pib.gov.in/',                                      logo: 'P' },
  ],
  sports: [
    { name: 'BCCI',                   url: 'https://www.bcci.tv/',                                     logo: 'B' },
    { name: 'Sports Authority India', url: 'https://sai.gov.in/',                                      logo: 'S' },
    { name: 'Olympic Committee India',url: 'https://www.olympic.ind.in/',                              logo: 'O' },
    { name: 'ESPN India',             url: 'https://www.espncricinfo.com/',                            logo: 'E' },
  ],
  legal: [
    { name: 'Supreme Court of India', url: 'https://www.sci.gov.in/',                                  logo: 'S' },
    { name: 'Law Commission India',   url: 'https://lawcommissionofindia.nic.in/',                     logo: 'L' },
    { name: 'India Code',             url: 'https://www.indiacode.nic.in/',                            logo: 'I' },
    { name: 'Bar & Bench',            url: 'https://www.barandbench.com/',                             logo: 'B' },
  ],
  election: [
    { name: 'Election Commission',    url: 'https://eci.gov.in/',                                      logo: 'E' },
    { name: 'ADR India',              url: 'https://adrindia.org/',                                    logo: 'A' },
    { name: 'Lok Sabha',              url: 'https://loksabha.nic.in/',                                 logo: 'L' },
    { name: 'BOOM Live',              url: 'https://www.boomlive.in/',                                 logo: 'B' },
  ],
  default: [
    { name: 'Alt News',               url: 'https://www.altnews.in/',                                 logo: 'A' },
    { name: 'BOOM Live',              url: 'https://www.boomlive.in/',                                 logo: 'B' },
    { name: 'India Today Fact Check', url: 'https://www.indiatoday.in/fact-check',                    logo: 'I' },
    { name: 'Reuters Fact-Check',     url: 'https://www.reuters.com/fact-check/',                     logo: 'R' },
  ],
};

/** Detect topic category from the user's input text */
function detectTopicCategory(input: string): TopicCategory {
  const text = input.toLowerCase();
  if (/\b(health|hospital|disease|virus|vaccine|medicine|doctor|cancer|covid|dengue|medical|cure|diet|nutrition|drug|treatment|symptom|illness|surgery|therapy|who|icmr|aiims)\b/.test(text)) return 'health';
  if (/\b(government|minister|ministry|pm|prime minister|cabinet|bjp|congress|parliament|policy|scheme|yojana|budget|pib|niti aayog|modi|rahul|manmohan|cm|chief minister)\b/.test(text)) return 'government';
  if (/\b(economy|gdp|inflation|rbi|bank|stock|sensex|nifty|rupee|tax|gst|finance|budget|trade|export|import|sebi|ipo|market|recession|unemployment|fiscal)\b/.test(text)) return 'economy';
  if (/\b(science|technology|space|isro|nasa|ai|artificial intelligence|robot|satellite|moon|mars|physics|chemistry|biology|research|climate change|global warming|pollution|energy|nuclear|electric|ev|chip|semiconductor)\b/.test(text)) {
    if (/\b(climate|pollution|environment|forest|deforestation|glacier|emission|carbon|green|biodiversity|species|wildlife|ozone)\b/.test(text)) return 'environment';
    return 'science';
  }
  if (/\b(farm|farmer|crop|agriculture|harvest|kisan|msp|irrigation|soil|seed|fertilizer|wheat|rice|sugarcane|pulses|drought|flood)\b/.test(text)) return 'agriculture';
  if (/\b(cricket|football|ipl|bcci|match|player|tournament|olympic|sport|stadium|team|coach|medal|champion|fifa|cwg|commonwealth)\b/.test(text)) return 'sports';
  if (/\b(court|law|legal|judge|justice|verdict|bail|arrest|fir|ipc|crpc|constitution|article|section|act|supreme court|high court|advocate|lawyer|judgment)\b/.test(text)) return 'legal';
  if (/\b(election|vote|voting|candidate|constituency|mla|mp|lok sabha|rajya sabha|assembly|ballot|eci|aadhaar|voter|bjp|congress|aap|nda|upa|exit poll|result)\b/.test(text)) return 'election';
  return 'default';
}

/** Get topic-relevant fallback sources when Gemini doesn't return enough */
function getFallbackSources(input: string): TrustedSource[] {
  const category = detectTopicCategory(input);
  return TOPIC_SOURCE_MAP[category];
}

// ─── JSON parser (3-tier) ──────────────────────────────────────────────────────
function parseGeminiJSON(raw: string): Record<string, unknown> {
  let text = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/m, '')
    .trim();

  // Tier 1: direct
  try { return JSON.parse(text) as Record<string, unknown>; } catch { /* continue */ }

  // Tier 2: extract { ... }
  const s = text.indexOf('{'), e = text.lastIndexOf('}');
  if (s !== -1 && e > s) {
    try { return JSON.parse(text.slice(s, e + 1)) as Record<string, unknown>; } catch { /* continue */ }
  }

  // Tier 3: fix trailing commas
  const fixed = text.replace(/,\s*([}\]])/g, '$1');
  try { return JSON.parse(fixed) as Record<string, unknown>; } catch { /* continue */ }

  throw new Error(`Cannot parse JSON from Gemini. Raw: ${text.slice(0, 300)}`);
}

// ─── Map raw Gemini output → AnalysisResult ───────────────────────────────────
function mapResult(
  g: Record<string, unknown>,
  originalInput: string,
  processingTime: number,
): AnalysisResult {
  // Claims
  const rawClaims = (g.claims as Array<Record<string, unknown>>) ?? [];
  const VALID_STATUS = ['True', 'False', 'Misleading', 'Opinion'] as const;

  const claims: Claim[] = rawClaims.slice(0, 5).map((c, i) => ({
    id:         i + 1,
    text:       String(c.text ?? ''),
    status:     (VALID_STATUS.includes(String(c.classification) as typeof VALID_STATUS[number])
                  ? String(c.classification)
                  : 'Opinion') as Claim['status'],
    confidence: Math.max(0, Math.min(100, Number(c.confidence ?? 70))),
  }));

  // Trust score
  const trustScore = Math.max(0, Math.min(100, Number(g.trust_score ?? 50)));

  // Trust breakdown — use Gemini's values with safe fallback derived from trustScore
  const tb = (g.trust_breakdown as Record<string, unknown>) ?? {};
  const clamp = (v: unknown, fallback: number) =>
    Math.round(Math.max(0, Math.min(100, Number(v ?? fallback))));
  const trustBreakdown: TrustBreakdown = {
    sourceReliability: clamp(tb.source_reliability, trustScore < 50 ? trustScore * 0.9 : 50 + (trustScore - 50) * 1.1),
    factualAccuracy:   clamp(tb.factual_accuracy,   trustScore * 0.95 + 3),
    contextIntegrity:  clamp(tb.context_integrity,  trustScore * 0.85 + 8),
    emotionalLanguage: clamp(tb.emotional_language, 100 - trustScore * 0.88 - 3),
  };

  // Fact verification
  const fv = (g.fact_verification as Record<string, unknown>) ?? {};
  const rawSrc = (fv.sources as Array<Record<string, unknown>>) ?? [];
  // Use Gemini sources if we got valid ones, otherwise use topic-aware fallbacks
  const validSrc = rawSrc.filter(s => {
    const url = String(s.url ?? '');
    return url.startsWith('http') && url.length > 10 && String(s.name ?? '').length > 1;
  });
  const sources: TrustedSource[] = validSrc.length >= 2
    ? validSrc.slice(0, 4).map(s => ({
        name: String(s.name ?? ''),
        url:  String(s.url  ?? '#'),
        logo: (String(s.name ?? 'X')[0] ?? 'X').toUpperCase(),
      }))
    : getFallbackSources(originalInput);

  // Explanation
  const exp = (g.explanation as Record<string, unknown>) ?? {};

  // Virality
  const vr = (g.virality_risk as Record<string, unknown>) ?? {};
  const viralScore = Math.max(0, Math.min(100, Number(vr.score ?? 50)));
  const viralLevel = (['Low', 'Medium', 'High'].includes(String(vr.level))
    ? String(vr.level) : 'Medium') as 'Low' | 'Medium' | 'High';

  // Context — Gemini returns context_analysis as OBJECT (we now ask for it that way)
  const ctx = (g.context_analysis as Record<string, unknown>) ?? {};
  const regional    = String(ctx.regional    ?? g.context_analysis ?? '');
  const cultural    = String(ctx.cultural    ?? `Language: ${String(g.language_detected ?? 'English')}`);
  const sensitivity = String(ctx.sensitivity ?? (viralLevel === 'High' ? 'HIGH' : viralLevel === 'Medium' ? 'MEDIUM' : 'LOW'));

  // Counter message
  const counterText  = String(g.counter_message ?? '');
  const statusTag    = trustScore < 35 ? 'FALSE' : trustScore < 65 ? 'MISLEADING' : 'TRUE';
  const statusLine   = trustScore < 65
    ? '❌ This message contains false or misleading information.'
    : '✅ This message has been independently verified as accurate.';

  return {
    id:            `proofly-${Date.now()}`,
    timestamp:     new Date().toISOString(),
    inputType:     'text',
    language:      'en',
    originalInput,
    claims,
    trustScore,
    trustBreakdown,
    factVerification: {
      correctedFact: String(fv.correct_info ?? fv.correctedFact ?? ''),
      sources,
    },
    explanation: {
      detailed: String(exp.detailed ?? ''),
      eli10:    String(exp.eli10    ?? ''),
    },
    viralityRisk: {
      score:  viralScore,
      level:  viralLevel,
      reason: String(vr.reason ?? ''),
    },
    contextAnalysis: { regional, cultural, sensitivity },
    counterMessage: {
      text:          counterText,
      whatsappText:  `*🔍 PROOFLY FACT CHECK*\n\nVerdict: *${statusTag}*\n\n${statusLine}\n\n${counterText}\n\n🔗 Verified by PROOFLY\n\n_#FactCheck #StopMisinformation #Proofly_`,
    },
    processingTime,
    modelVersion: 'gemini-3.6-flash',
  };
}

// ─── API Route ────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const start = Date.now();

  try {
    const body = await req.json() as AnalyzeRequest;
    const userInput = (body.input ?? '').trim();

    if (!userInput || userInput.length < 3) {
      return NextResponse.json({ error: 'Input too short' }, { status: 400 });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`[Proofly] Analyzing: "${userInput.slice(0, 100)}"`);

    // ── Check API key ──────────────────────────────────────────────────────────
    const apiKey = (process.env.GEMINI_API_KEY ?? '').trim();
    if (!apiKey) {
      console.error('[Proofly] GEMINI_API_KEY is not set in .env.local');
      return NextResponse.json(
        { error: 'AI service not configured. Set GEMINI_API_KEY in .env.local' },
        { status: 503 },
      );
    }

    // ── Build full prompt ──────────────────────────────────────────────────────
    const fullPrompt = PROMPT + userInput;

    const MODELS = [
      'gemini-3.6-flash',
      'gemini-2.5-flash',
      'gemini-2.5-pro',
    ];
    let geminiResponse: Response | null = null;
    let lastError = '';
    // Status codes that mean "try next model" vs "fatal error"
    const RETRY_STATUSES = new Set([400, 404, 429, 503]);

    for (const model of MODELS) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30_000);

      try {
        console.log(`[Proofly] Calling ${model}...`);
        const res = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature:      0.1,
              topP:             0.8,
              topK:             40,
              maxOutputTokens:  2048,
              candidateCount:   1,
            },
          }),
          signal: controller.signal,
        });

        if (RETRY_STATUSES.has(res.status)) {
          const errText = await res.text();
          lastError = `HTTP ${res.status} on ${model}: ${errText.slice(0, 200)}`;
          console.warn(`[Proofly] ${res.status} hit on ${model}, trying next model... Body: ${errText.slice(0, 200)}`);
          continue; // try next model
        }

        geminiResponse = res;
        console.log(`[Proofly] ✅ Got response from ${model} (status ${res.status})`);
        break; // got a usable response
      } catch (e) {
        lastError = (e as Error).message;
        console.warn(`[Proofly] ${model} failed:`, lastError);
      } finally {
        clearTimeout(timeout);
      }
    }

    if (!geminiResponse) {
      console.error('[Proofly] All models failed:', lastError);
      return NextResponse.json(
        { error: `Gemini API unavailable: ${lastError}. This is usually a rate limit — wait 60s and try again.` },
        { status: 429 },
      );
    }

    // ── Check non-ok after model loop ──────────────────────────────────────────
    if (!geminiResponse.ok) {
      const errBody = await geminiResponse.text();
      console.error('[Proofly] Gemini error:', geminiResponse.status, errBody.slice(0, 300));
      if (geminiResponse.status === 503) {
        return NextResponse.json({ error: "Google's AI service is currently overloaded. Please try again in a few moments." }, { status: 503 });
      }
      return NextResponse.json(
        { error: `Google AI error (${geminiResponse.status}). Please try again.` },
        { status: 502 },
      );
    }

    // ── Extract raw text ───────────────────────────────────────────────────────
    const geminiData = await geminiResponse.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
      error?: { message: string };
    };

    if (geminiData.error) {
      console.error('[Proofly] Gemini API error:', geminiData.error.message);
      return NextResponse.json({ error: `Gemini: ${geminiData.error.message}` }, { status: 502 });
    }

    const rawText = (
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
    ).trim();

    console.log(`[Proofly] Gemini raw output (${rawText.length} chars):`);
    console.log(rawText.slice(0, 500));

    if (!rawText) {
      return NextResponse.json({ error: 'Gemini returned empty response' }, { status: 502 });
    }

    // ── Parse JSON ─────────────────────────────────────────────────────────────
    let parsed: Record<string, unknown>;
    try {
      parsed = parseGeminiJSON(rawText);
    } catch (e) {
      console.error('[Proofly] JSON parse failed:', (e as Error).message);
      return NextResponse.json(
        { error: 'AI returned invalid JSON. Try again.', raw: rawText.slice(0, 500) },
        { status: 502 },
      );
    }

    // ── Map and return ─────────────────────────────────────────────────────────
    const result = mapResult(parsed, userInput, Date.now() - start);
    console.log(`[Proofly] ✅ Success — trust_score=${result.trustScore}, claims=${result.claims.length}`);
    console.log('='.repeat(60));

    // ── Persist analysis to DB (non-blocking) ──────────────────────────────────
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id ?? null;
    const langRaw = (parsed.language_detected as string | undefined) ?? 'Unknown';
    const claimsArr = (parsed.claims as unknown[]) ?? [];

    prisma.analysis.create({
      data: {
        userId,
        inputSnippet: userInput.slice(0, 200),
        inputType:    body.type ?? 'text',
        trustScore:   result.trustScore,
        language:     langRaw,
        claimsCount:  claimsArr.length,
      },
    }).catch(err => console.error('[Proofly] DB analysis save failed (non-fatal):', err));

    return NextResponse.json(result);

  } catch (err) {
    console.error('[Proofly] Unexpected error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
