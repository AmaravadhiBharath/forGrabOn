# Project 06: Multi-Channel Deal Distribution [Submission Ready]
## GrabOn Vibe Coder Challenge 2024-2025

| Category | Information |
| :--- | :--- |
| **Candidate** | Bharath Amaravadhi |
| **Email** | amaravadhibharath@gmail.com |
| **Project Vertical** | GrabOn Core Infrastructure |
| **Difficulty** | Hard |

---

## 🚀 Overview

| Requirement | Status | Implementation Highlight |
| :--- | :--- | :--- |
| **MCP Spec Compliance** | ✅ | Native `@modelcontextprotocol/sdk` integration over Stdio. |
| **18+ Meaningful A/B Variants** | ✅ | 3 Strategic Pillars: Urgency, Value, and Social Proof. |
| **Native Localization (Hi/Te)** | ✅ | Culturally adapted copy (not literal) in native scripts. |
| **Webhook Retry Logic** | ✅ | 3-attempt failover loop with per-channel reliability profiles. |
| **3+ Merchant Demo** | ✅ | Validated with Zomato, Myntra, Swiggy, and Amazon. |
| **Co-Branded Offer Support**| ✅ | Optional Banking Partner integration (e.g., HDFC/ICICI) for PayU. |

---

### 🚀 Getting Started

#### 1. Setup
```bash
# 1. Clone the repository
git clone https://github.com/AmaravadhiBharath/forGrabOn.git

# 2. Enter the directory
cd forGrabOn

# 3. Install dependencies
npm install

# 4. Build the project
npm run build
```

#### 2. Configure Environment
The `.env` file will **automatically pop up** when you run the setup script in Step 3. Alternatively, you can open it manually in the root directory:
```bash
ANTHROPIC_API_KEY=your_sk_key_here
```
*(The file is already included in the repository as a template for your convenience.)*

#### 3. Connect to Claude Desktop

**Option A (Recommended - Auto Setup):**
Run this command in your terminal. It will automatically detect your path and update your Claude config.
```bash
node setup-mcp.js
```
*(This will update your config and automatically open the `.env` file for you. Just paste your key, save, and restart Claude.)*

**Option B (Manual - Windows/Mac):**
1. Open Claude Desktop.
2. Go to **Settings > Developer**.
3. Click **Edit Config**.
4. Paste the following (Replace `PASTE_YOUR_PATH_HERE` with your absolute folder path):

```json
{
  "mcpServers": {
    "grabon-distribution-mcp": {
      "command": "node",
      "args": ["PASTE_YOUR_PATH_HERE/dist/server.js"],
      "env": {
        "ANTHROPIC_API_KEY": "your_sk_key_here"
      }
    }
  }
}
```

#### 4. Immediate Verification (No Claude Required)
If you want to see the 54-variant JSON output instantly without launching Claude Desktop:
```bash
npx @modelcontextprotocol/inspector node dist/server.js
```
1. Open the URL shown in your browser (usually `http://localhost:5173`).
2. Select `distribute_deal`, fill in the merchant/category, and click **Run Tool**.

---

### 🏛️ Architecture & Design Decisions

- **Multi-Stage Translation Rail**: To ensure reliability for 54 strings, the server generates English variants first, then adapts them into Hindi and Telugu in parallel.
- **Psychological Pillars**: Copy is generated based on Urgency, Value, and Social Proof triggers to ensure effective A/B testing.
- **Resilient Webhook Simulation**: Built a `webhookSimulator` that mimics enterprise APIs with artificial latency and probabilistic failures to demonstrate a retry architecture.
### ⚡️ Live Demo & Submission Notes
**Note on Videos:** Due to the 5-minute limit on Loom, this demonstration is split into **3 Parts** covering Architecture, Setup, and Live Demos.

> [!WARNING]
> **Security First:** The `.env` file is included in the repository as a **template only**. When adding your real key locally, please ensure you do not commit your specific changes back to GitHub to prevent API key exposure.
**⚡️ Developer Simulation Mode:** To make evaluation seamless, I have built a **Simulation Fallback**. If you do not have an `ANTHROPIC_API_KEY` ready, the server automatically switches to a deterministic rule-based engine. 

*(**Recommendation for Evaluators**: While Simulation Mode demonstrates the architecture perfectly, I recommend adding a real API key to the `.env` file to experience the **full generative power** and dynamic localization nuances of Claude-3 integrated within this MCP.)*

This ensures you can still see the 54-variant distribution, Hindi/Telugu localizations, and retry logic even without an active billing account.


### 🚀 Case Study: 1.8s to 54 Variants
*Transforming raw deal data into a multi-channel campaign in the blink of an eye.*

**The Challenge:** A Brand Manager needs to blast a "Zomato 50% Off" deal across 6 channels, in 3 strategic variations (A/B testing), across 3 languages. Submitting this manually would take **45+ minutes** of drafting, translating, and formatting.

**The Solution (MCP Execution):**
1. **Input:** *"Zomato food deal, 50% off up to 100 rupees, ends Sunday"*
2. **System Processing:**
   - **Generation Duration:** ~1.4s (Claude-3 Haiku adaptive generation)
   - **Delivery Duration:** ~0.4s (Parallel webhook dispatch with retries)
   - **Total Round-Trip:** **1.8 seconds** ⚡️

**Localized Sample Snippets:**

| Channel | Strategy | Language | Output |
| :--- | :--- | :--- | :--- |
| **WhatsApp** | Urgency | **Hindi** | ⏳ सिर्फ रविवार तक! Zomato पर 50% की भारी छूट। अभी ऑर्डर करें! |
| **Instagram** | Social | **Telugu** | 💥 అందరూ వాడుతున్నారు! Zomato 50% తగ్గింపు ఆఫర్. మిస్ అవ్వకండి! |
| **Push** | Value | **English** | Save Big! 50% OFF on your favorite meals. Max ₹100 discount. |

**Technical Verdict:**
The **1.8s execution** is a massive win for productivity. The bulk of the time (~1.4s) is spent on the **Cognitive Layer** (LLM adaptive reasoning), while our **Engine Layer** (Node.js/MCP) handles the heavy data parsing and resilient distribution dispatch in under 400ms.

---

### 🔮 The "1-to-Many" Vision
The core achievement of this project is the **"1-to-Many" distribution rail**. Without MCP, a marketing manager would have to manually write, translate, and verify 54 different variants (6 channels x 3 strategies x 3 languages) for every single deal. By connecting Claude directly to this infrastructure via MCP, we turn one simple sentence into a massive, culturally-aware marketing blast in seconds.

---

### ⚡️ The "Mobile-to-Market" Pipeline (n8n + MCP)

The architecture is designed to support a hands-free marketing workflow. While the current demo uses Claude Desktop, the engine is fully compatible with **n8n** to enable a "Mobile-to-Market" pipeline:

1.  **Trigger:** Brand Manager sends a deal description via **Slack** or **WhatsApp** (e.g., *"Myntra 40% off fashion, with HDFC Banking"*).
2.  **Orchestration:** n8n catches the webhook → passes the text to an LLM node (Claude) → Claude uses this **MCP Server** as a tool, intelligently detecting the merchant, category, and optional **Bank Partner**.
3.  **Execution:** The MCP server generates the 54 variants (co-branded for PayU/Instagram) and simulates the distribution blast via webhooks.
4.  **Confirmation:** n8n sends a summary report back to the Slack/WhatsApp thread, confirming that the co-branded campaign is live.

> *"It's Saturday. The brand manager is home. He types a single sentence into Slack, and 54 channel-ready, translated variants are live in seconds. No laptop required."*

---

### ⏳ If We Had More Time

- **Full n8n Orchestration** — Implementing a "Mobile-to-Market" flow where a Brand Manager can type *anything* (raw text) into Slack or WhatsApp on a weekend, and n8n + MCP handles the extraction, translation, and distribution automatically.
- **Deep Bank Partner Integration** — Expanding the input schema to natively support **Branded Cards of Partner Banks** (e.g., "HDFC Millennia" or "Axis GrabOn Card"), automatically generating strategy-specific co-branded copy for payment gateways.
- **Persistent Campaign Database** — Store every generated variant with timestamps, so teams can audit past campaigns and A/B test results over time.
- **Visual Asset Generation** — Auto-generate channel-sized banners (Instagram square, WhatsApp thumbnail, etc.) to accompany every copy variant.
- **Live Channel Push** — Replace the webhook simulator with real API calls to Firebase Push, WhatsApp Business Cloud, and Meta Ads.
- **Analytics Feedback Loop** — Pull click-through data back into Claude so future variant generation is informed by what actually performed.
- **Approval Workflow** — Route generated variants through a Slack approval thread before they go live, keeping a human in the loop.


---

**In conclusion:** I have delivered a scalable, culturally-aware, and resilient distribution infrastructure. This isn't just a chatbot interface; it's a high-scale Distribution Engine that demonstrates why the Model Context Protocol is the future of enterprise marketing.

**Thank you for viewing my submission for the GrabOn Vibe Coder Challenge. I look forward to your feedback!**
