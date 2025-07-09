# 🧠 JobCopilot: Event-Driven ATS-Based Job Matching Platform

## 📌 Overview

**JobCopilot** is a scalable, event-driven backend platform that analyzes CVs, extracts candidate preferences using LLMs, and matches jobs in real-time using intelligent filters. The architecture is modular, GCP-native, and built for extensibility with microservices.

---

## 🏗️ Architecture

This system is designed around the following microservices:

| Service           | Purpose                                                                 |
|------------------|-------------------------------------------------------------------------|
| **cv-parser**     | Parses uploaded resumes using OpenAI and extracts structured preferences |
| **profile-manager** | Stores and manages user job preferences                                |
| **job-fetcher**    | Scrapes or fetches jobs from external sources and scores them           |
| **job-matcher**    | Matches jobs to users using a smart algorithm                           |
| **job-notifier**    | Sends daily email summaries with cover letters |

All services communicate via **Google Cloud Pub/Sub**, enabling full decoupling, scalability, and asynchronous processing.

---

## 🔥 Tech Stack

- **Backend**: Node.js (TypeScript)
- **LLM Integration**: OpenAI via OpenRouter (Mixtral-8x7b-instruct)
- **Database**: PostgreSQL (via Prisma ORM)
- **Messaging**: Google Cloud Pub/Sub
- **Hosting**: Google Cloud Run
- **CI/CD**: GitHub Actions (planned)
- **Scraping**: Puppeteer / Playwright (optional)
- **Logging/Tracing**: GCP Logging (optional)

---

## ✨ Features

- Upload CVs → auto-analyze using AI → extract:
  - Job Titles
  - Job Types
  - Work Location Preferences
  - Keywords to include/exclude
- Publish structured preferences to Pub/Sub
- Store in `jobPreferences` table
- Scrape or import jobs
- Match jobs to users based on:
  - Title, Location, Keywords
  - Excluded companies or terms
- Score each job with a customizable algorithm
- Return ranked list of job matches

---

## 📂 Folder Structure

```bash
libs/
  domain-events/         # Shared event definitions (e.g. CvUploadedEvent)

services/
  cv-parser/             # Resume parsing and LLM analysis
  profile-manager/       # Job preference storage and management
  job-fetcher/           # Job ingestion/scraping logic
  job-matcher/           # (Planned) Matching engine based on preferences
  job-notifier/        # Sends daily job emails with cover letters

pubsub/
  publisher.ts           # Event publisher utility (e.g. publishCvUploaded)
```

---

## 🧪 Match Algorithm

```ts
score = 0
+30 if title matches
+20 if location matches
+10 * each keyword match
-100 if excluded company or term found
```

---

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/AhmadSaleh22/job-copilot.git
cd job-copilot
pnpm install
```

### 2. Setup Environment

Create `.env` file in each service:

```env
OPENAI_API_KEY=your-openrouter-key
DATABASE_URL=postgres://...
GCP_PROJECT_ID=your-project
GOOGLE_APPLICATION_CREDENTIALS=path-to-service-account.json
```

### 3. Migrate DB

```bash
pnpm prisma migrate dev --name init
```

### 4. Run Locally

```bash
pnpm dev
```

---

## 📡 Pub/Sub Events

| Event Name     | Payload                             | Triggered By |
|----------------|-------------------------------------|--------------|
| `cv-uploaded`  | `{ userId, cvText, timestamp }`     | `cv-parser`  |
| `jobs-fetched` | `{ jobList: Job[], source }`        | `job-fetcher` |
| `profile-updated` | `{ userId, preferences }`        | `profile-manager` |

---

## 📊 Example JobPreferences Schema

```prisma
model JobPreferences {
  id                String   @id @default(uuid())
  userId            String   @unique
  user              User     @relation(fields: [userId], references: [id])

  jobTitles         String[]
  jobTypes          String[]
  workLocation      String[]
  includeKeywords   String[]
  excludeKeywords   String[]
  excludeCompanies  String[]

  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}
```

---

## 🧠 AI Prompt Template

```txt
You are an expert ATS resume reviewer. Analyze this resume:

<INSERT_CV_TEXT_HERE>

Return a JSON object with:
{
  preferences: {
    jobTitles: string[],
    jobTypes: string[],
    workLocation: string[],
    includeKeywords: string[],
    excludeKeywords: string[],
    excludeCompanies: string[]
  },
  atsScore: number,
  strengths: string[],
  weaknesses: string[],
  keywordsPresent: string[],
  keywordsMissing: string[]
}
```

---

## 🛡 Security & Rate Limits

- API keys managed via `.env` and GCP Secret Manager
- Rate limiting (planned via middleware)
- Quota handling for OpenRouter API

---

## 📈 Planned Features

- ✅ Smart job match algorithm
- ✅ Pub/Sub eventing system
- ✅ AI-based preference extraction
- 🔜 Email/Telegram job alerts
- 🔜 Admin dashboard (Next.js or Vite)
- 🔜 GCP Logging/Tracing
- 🔜 Resume builder using AI

---

## 👨‍💻 Author

**Ahmad Saleh**  
[GitHub](https://github.com/AhmadSaleh22) • [LinkedIn](https://www.linkedin.com/in/ahmadnsaleh/)  
Senior Software Engineer | Event-Driven Architect | Cloud Native Backend Developer

---

## 📝 License

MIT © 2025 Ahmad Saleh
