# Proofly 🛡️

**Truth has a new guardian.**

Proofly is India's AI-powered fact-checking platform — built to detect, analyze, and debunk misinformation across text, URLs, images, audio, video, and documents. It supports all 23 official Indian languages, understands regional cultural context, and delivers structured verdicts in seconds.

---

## Features

### Multimodal Input Support
- **Text** — Paste any claim, message, or social media excerpt directly
- **URLs** — Submit any public URL; Proofly extracts article content using semantic HTML parsing and intercepts YouTube URLs to pull full transcripts via the TimedText API
- **Media** — Upload images, audio, video, or PDFs; analyzed natively via Gemini's multimodal API without external OCR or transcription services

### Multilingual Intelligence
Proofly automatically detects and analyzes content in all **23 officially recognized Indian languages** (8th Schedule of the Constitution), including Hindi, English, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Malayalam, Odia, Punjabi, Assamese, Maithili, Sanskrit, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, and Santali. Code-mixed formats like Hinglish and Tanglish are fully supported.

### Analysis Pipeline
1. Input collection and type detection
2. Language and modality identification
3. Factual claim extraction (opinion vs. verifiable assertion)
4. Cross-referencing against trusted sources (Alt News, BOOM Live, Reuters, WHO)
5. Manipulation detection (deepfake indicators, audio splicing)
6. Virality risk scoring and spread prediction
7. Regional and cultural contextualization
8. Trust Score generation (0–100 confidence index)
9. Plain-language explanation and shareable counter-message

### Trust Score & Verdict
Every analysis produces a **Trust Score** (0–100) with a breakdown across four dimensions:
- **Source Reliability** — credibility of implied or cited sources
- **Factual Accuracy** — correctness of the specific claim
- **Context Integrity** — accuracy of framing, omissions, or distortion
- **Emotional Language** — detection of manipulative or fear-driven language

### Counter-Message Generation
Proofly generates a factual, polite counter-message ready to copy and share — formatted for social media and messaging platforms to address misinformation at the source.

### User Accounts & History
- Sign up with email/password (OTP-verified) or Google
- Full login history tracked with timestamps
- All analyses saved per user — accessible from the profile dashboard
- Edit profile: display name, bio, and avatar photo

---

## Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) with React Server Components |
| **Styling** | Tailwind CSS + Framer Motion + Lucide React |
| **Authentication** | NextAuth.js — Google OAuth2 + Credentials Provider (bcryptjs, cost factor 12) |
| **Database** | Neon Serverless PostgreSQL |
| **ORM** | Prisma (type-safe queries, schema management) |
| **AI Engine** | Google Gemini 2.5 Flash (multimodal — text, image, audio, video, PDF) |
| **Email** | Resend (OTP delivery for email verification) |
| **Web Scraping** | Cheerio + Fetch API — 15+ semantic HTML fallback selectors |
| **Deployment** | Netlify Edge + Serverless Functions |

### Database Schema
| Table | Purpose |
|---|---|
| `User` | Name, email, bcrypt password hash, bio, avatar, email verified status |
| `OtpCode` | 6-digit verification codes with expiry for signup |
| `LoginEvent` | Timestamped login history per user (provider: Google or email) |
| `Analysis` | Full log of every analysis run — input, type, trust score, language, claim count |

---

## Getting Started

### Prerequisites
- Node.js v18.17.0+
- Neon Postgres connection string (or any PostgreSQL URL)
- Google AI Studio API key (Gemini)
- Google Cloud OAuth2 credentials (for Google Sign-In)
- Resend API key (for OTP emails — optional in development)

### Setup

**1. Clone and install**
```bash
git clone https://github.com/Aayush1803/Proofly.git
cd Proofly
npm install
```

**2. Configure environment variables**

Create a `.env` file in the project root:
```env
# Database
DATABASE_URL="postgresql://user:password@ep-your-neon-db.neon.tech/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generate-a-secure-random-string"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Email — OTP verification (optional in dev; codes are logged to console if not set)
RESEND_API_KEY="re_your-resend-api-key"
```

**3. Push database schema**
```bash
npx prisma db push
```

**4. Run locally**
```bash
npm run dev
```

Open [https://proof-ly.netlify.app/](https://proof-ly.netlify.app/) — or run locally at `http://localhost:3000`.

> **Development note:** If `RESEND_API_KEY` is not set, OTP codes for signup are printed to the server console so you can still test the full auth flow locally.

---

## Built by

**Aayush Joshi** — Founder & Solo Engineer

Full-stack engineering, AI integration, system design, UI/UX, and DevOps.

---

## Notes

Proofly uses Google Gemini for AI-powered analysis. While the system is carefully prompted for factual accuracy, generative AI models can occasionally produce incorrect outputs. Always cross-reference critical claims with credentialed fact-checking organizations.

*Built to bring truth back to India's information landscape.*
