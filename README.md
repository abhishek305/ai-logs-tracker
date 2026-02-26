# AI Logs Tracker

An AI-powered work journal system that transforms raw daily notes into structured, promotion-ready engineering artifacts. Built with [Mastra](https://mastra.ai) workflows, TypeScript, and Zod schema enforcement.

Write a single sentence about what you did today. The system classifies it, generates measurable impact statements, maps it to a skill taxonomy, and persists everything to Excel -- ready for performance reviews, LinkedIn posts, or personal growth tracking.

## How It Works

```
Raw text input
     |
     v
+--------------------+     +---------------------+     +------------------+
|  1. Classify Entry |---->|  2. Expand Impact   |---->|  3. Map Skill    |
|                    |     |                     |     |                  |
|  Category          |     |  What I Did         |     |  Skill from      |
|  Area of Work      |     |  (2-4 sentences)    |     |  predefined      |
|  AI Tool Used      |     |                     |     |  taxonomy         |
|  Task Topic        |     |  Outcome / Impact   |     |                  |
+--------------------+     +---------------------+     +------------------+
                                                              |
                                                              v
                                                     +------------------+
                                                     |  Excel Output    |
                                                     |  journal.xlsx    |
                                                     +------------------+
```

Every step enforces strict JSON output through Zod schemas. No free text, no hallucinated fields -- just validated structured data at every stage.

## Quick Start

### Prerequisites

- **Node.js** 18+
- **OpenAI API key** or **Ollama** running locally

### Setup

```bash
git clone https://github.com/abhishek305/ai-logs-tracker.git
cd ai-logs-tracker
npm install
```

Create a `.env` file in the project root:

```env
# Provider: "openai" or "ollama"
MODEL_PROVIDER=openai

# Model name (provider-specific)
MODEL_NAME=gpt-4o-mini

# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Ollama (only if using non-default URL)
# OLLAMA_BASE_URL=http://localhost:11434/api
```

### Usage

```bash
# Log an entry (uses provider from .env)
npm run dev -- log "Built a Mastra workflow to classify journal entries with Zod schema validation"

# Specify a date
npm run dev -- log -d 2026-02-25 "Explored prompt engineering patterns for structured output"

# Use Ollama with a local model
npm run dev -- log -p ollama -m llama3.2 "Evaluated local LLMs for structured data extraction"

# Use a specific OpenAI model
npm run dev -- log -p openai -m gpt-4o "Designed agent architecture for multi-step workflows"
```

### Example Output

```
 Processing journal entry with openai/gpt-4o-mini...

 Classification
   Category:       Productivity
   Area of Work:   Workflow Automation
   AI Tool Used:   Mastra, Cursor
   Task Topic:     Built AI workflow for journal entry classification

 Impact
   What I Did:     Designed and implemented a three-step Mastra workflow pipeline
                   that processes raw journal text through classification, impact
                   expansion, and skill mapping stages. Integrated Zod schemas at
                   each step boundary to enforce structured JSON output.
   Impact:         Reduced manual journal formatting time from ~15 minutes to
                   under 10 seconds per entry. Eliminated inconsistency in
                   categorization across entries.

 Skill
   Upskilled:      Workflow Engineering

 Saved to: /path/to/output/journal.xlsx
```

## Model Providers

### OpenAI (Cloud)

Set `MODEL_PROVIDER=openai` in `.env` and provide your `OPENAI_API_KEY`.

| Model | Best For |
|-------|----------|
| `gpt-4o-mini` | Fast, cost-effective daily use (default) |
| `gpt-4o` | Higher accuracy classification |
| `gpt-4-turbo` | Complex entries with nuanced context |

### Ollama (Local / Open Source)

Set `MODEL_PROVIDER=ollama` in `.env`. Make sure Ollama is running:

```bash
# Install Ollama: https://ollama.com
ollama serve

# Pull a model
ollama pull llama3.2
```

| Model | Best For |
|-------|----------|
| `llama3.2` | General-purpose, good structured output (default) |
| `mistral` | Fast inference, solid classification |
| `deepseek-coder` | Technical/code-heavy journal entries |
| `codellama` | Engineering-focused entries |

You can also override per-command without changing `.env`:

```bash
npm run dev -- log -p ollama -m mistral "Your entry here"
```

## Project Structure

```
ai-logs-tracker/
  .cursorrules              # Cursor AI rules for consistent agent behavior
  .env                      # API keys and model config (git-ignored)
  package.json
  tsconfig.json
  src/
    cli/
      index.ts              # Thin CLI -- collects input, calls workflow
    config/
      index.ts              # Centralized paths and constants
      model.ts              # Model factory (OpenAI / Ollama resolution)
    mastra/
      index.ts              # Mastra instance with agent + workflow registration
      agents/
        journal-agent.ts    # LLM agent with JSON-only system prompt
    types/
      journal.ts            # All Zod schemas and TypeScript types
    workflows/
      journal-workflow.ts   # Workflow composition (3 steps chained)
      steps/
        classify.step.ts    # Step 1: Category, area, tool, topic
        expand-impact.step.ts  # Step 2: Promotion-ready impact statements
        map-skill.step.ts   # Step 3: Controlled vocabulary skill mapping
    writers/
      excel-writer.ts       # Safe Excel append with auto-create
  output/
    journal.xlsx            # Generated output (git-ignored)
```

## Architecture Decisions

**Why Mastra?** Mastra provides typed workflow composition with `createStep()` and `createWorkflow()`, enforcing input/output schemas at every boundary. Steps are independently testable and refactorable.

**Why Zod at every step?** Each LLM call uses `output: ZodSchema` to guarantee structured JSON. The model cannot return free text -- if the output doesn't match the schema, the step fails rather than producing garbage data.

**Why a thin CLI?** The CLI is a ~50-line shell that collects input and delegates to the workflow. All intelligence lives in the steps. This makes the system easy to expose through other interfaces (API, web UI, Slack bot) later.

**Why Excel?** Spreadsheets are universally accessible, easy to share with managers, and can be immediately used in performance review discussions. The `exceljs` writer safely appends rows and auto-creates the workbook on first run.

## The Workflow Pipeline

### Step 1: Classify Entry

Categorizes raw text into structured fields:

- **category**: `Learning` | `Productivity` | `Discovery`
- **areaOfWork**: Short phrase (max 4 words) like "Workflow Automation" or "Agent Architecture"
- **aiToolUsed**: Extracted from text or responsibly inferred
- **taskTopic**: One-line task summary

### Step 2: Expand Impact

Generates promotion-ready language:

- **whatIDid**: 2-4 sentences of clear technical explanation with concrete actions
- **outcomeImpact**: Measurable business/engineering impact (time saved, complexity reduced, scalability improved)

### Step 3: Map Skill

Maps to exactly one skill from a controlled taxonomy:

| Skill |
|-------|
| Agentic System Design |
| Workflow Engineering |
| Prompt Engineering |
| AI Tool Evaluation |
| Knowledge Management |
| Productivity Optimization |
| Frontend Architecture |
| Backend Architecture |
| Testing Automation |
| Developer Experience |

No invented categories. The enum is enforced by Zod at the schema level.

## Excel Output

Each entry appends a row with these columns:

| Date | Category | Area of Work | AI Tool Used | Task Topic | What I Did | Outcome / Impact | Skill Upskilled |
|------|----------|-------------|-------------|-----------|-----------|-----------------|----------------|
| 2026-02-26 | Productivity | Workflow Automation | Mastra, Cursor | Built AI journal workflow | Designed and implemented... | Reduced manual formatting... | Workflow Engineering |

The file is created automatically at `output/journal.xlsx` on the first run.

## Who Is This For?

- **Engineers** who want to track daily work and build a promotion case with structured evidence
- **Engineering Managers** who want their team to produce consistent, measurable impact summaries
- **AI practitioners** exploring Mastra workflows, structured LLM output, and agentic pipelines
- **Anyone** who journals their work and wants AI to do the heavy lifting of classification and impact framing

## Contributing

Contributions are welcome. Here's how to get started:

### Development Setup

```bash
git clone https://github.com/abhishek305/ai-logs-tracker.git
cd ai-logs-tracker
npm install
cp .env.example .env  # Add your API key
```

### Guidelines

- **Types first**: Define Zod schemas before implementing any step
- **One step at a time**: Never modify multiple workflow steps in a single PR
- **JSON only**: All LLM outputs must be schema-validated, no free text
- **Thin CLI**: Business logic belongs in workflow steps, not the CLI layer
- **Controlled vocabulary**: The skill taxonomy is fixed -- propose changes via issue first

### Areas for Contribution

- **New model providers**: Add support for Anthropic, Google Gemini, Groq, etc.
- **Weekly summary workflow**: Aggregate last 7 entries into a weekly impact report
- **Confidence scoring**: Add a `confidence: number` field to classification output
- **Skill scoring engine**: Track skill frequency over time for growth visualization
- **Streak tracking**: Consecutive usage days and weekly rates
- **Web UI**: Build a frontend for entry submission and journal browsing
- **API layer**: Expose the workflow as an HTTP endpoint
- **Additional output formats**: JSON export, Markdown, Notion integration

### Submitting Changes

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Make changes following the guidelines above
4. Ensure `npx tsc --noEmit` passes with zero errors
5. Commit with a descriptive message
6. Open a pull request

## Roadmap

### v1 (Current)
- Three-step classification pipeline
- OpenAI and Ollama support
- Excel output
- CLI interface

### v2 (Planned)
- Weekly summary workflow with LinkedIn draft generation
- Confidence score on classification output
- Skill frequency tracking and growth graphs
- Streak tracking (consecutive AI usage days)

### v3 (Future)
- Web dashboard with entry history and skill charts
- Team mode with shared journal aggregation
- API endpoint for integration with Slack, Notion, etc.
- Custom taxonomy support per user/team

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Workflow Engine | [Mastra](https://mastra.ai) |
| Language | TypeScript (ES2022) |
| Schema Validation | [Zod](https://zod.dev) |
| Cloud LLM | [OpenAI](https://openai.com) via `@ai-sdk/openai` |
| Local LLM | [Ollama](https://ollama.com) via `ollama-ai-provider` |
| CLI Framework | [Commander.js](https://github.com/tj/commander.js) |
| Excel Output | [ExcelJS](https://github.com/exceljs/exceljs) |
| Runtime | Node.js 18+ |

## License

MIT
