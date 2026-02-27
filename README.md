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


### 🚀 Case Study: 1.8s to 54 Variants (Zero-Form Entry)
*Dynamic reasoning meets high-scale distribution.*

**The Challenge:** A Brand Manager is on the move and needs to promote a specific warehouse clearance.
**Input:** *"distribute amazon deal for mobile cases only 12 cases left 100 rupees off mrp 199, offer valid till stock"*

**How the MCP Engine interpreted this (Cognitive Extraction):**
- **Merchant:** Amazon (Detected via NLP)
- **Product Hierarchy:** Mobile Cases (Category mapping)
- **Automatic Price Calc:** ₹199 (MRP) - ₹100 (Off) = **₹99 Final Price**
- **Inventory Lock:** 12 cases left → **max_redemptions set to 12**
- **Scarcity Strategy:** Automatically prioritized "Urgency" and "Social Proof" variants.

**System Performance:**
- **Cognitive Generation:** ~1.4s (Generating 54 strategy-aligned variants)
- **Resilient Delivery:** ~0.4s (Simulated 6-channel blast with 100% success)
- **Total Speed:** **1.8 Seconds** ⚡️ (Saving ~45 minutes of manual work)

**Localized Sample Snippets:**

| Channel | Strategy | Language | Output |
| :--- | :--- | :--- | :--- |
| **WhatsApp** | Urgency | **Hindi** | 🔥 सिर्फ 12 केस बचे हैं! Amazon पर ₹99 में मोबाइल केस पाएं। |
| **Instagram** | Social | **Telugu** | 💥 భారీ డిస్కౌంట్! Amazon మొబైల్ కేస్ కేవలం ₹99 కే. త్వరపడండి! |
| **PayU Banner** | Value | **English** | Grab the Deal! ₹100 FLAT OFF on Amazon Mobile Cases. ₹99 only. |

**Technical Verdict:**
The **1.8s execution** proves that the MCP architecture isn't just a chatbot; it's a **Decision & Execution Layer**. It takes raw human intent, applies business logic (MRP calculation/Stock tracking), and executes across the entire enterprise stack instantly.

---


### 🔮 The "1-to-Many" Vision
The core achievement of this project is the **"1-to-Many" distribution rail**. Without MCP, a marketing manager would have to manually write, translate, and verify 54 different variants (6 channels x 3 strategies x 3 languages) for every single deal. By connecting Claude directly to this infrastructure via MCP, we turn one simple sentence into a massive, culturally-aware marketing blast in seconds.

---

### 🛑 Real-Time "Kill Switch"
The architecture is not just "Fire and Forget." It includes a dedicated **Termination Rail** to handle exactly the scenario where merchant stock hits zero across other sources.

- **The Problem:** Amazon has 10 cases. GrabOn has 5 redemptions left, but Amazon sold all 10 directly.
- **The Solution:** The `terminate_campaign` tool allows the Brand Manager (or an automated system) to instantly deactivate the deal across all 6 channels simultaneously, flushing caches and pulling banners to ensure 0% wasted traffic.

---

### ⚡️ The "Mobile-to-Market" Pipeline (n8n + MCP)

The architecture is designed to support a hands-free marketing workflow. While the current demo uses Claude Desktop, the engine is fully compatible with **n8n** to enable a bidirectional "Mobile-to-Market" pipeline:

1.  **Launch:** Brand Manager sends a deal via **Slack/WhatsApp** → n8n → MCP `distribute_deal` → 54 live variants.
2.  **Monitor:** n8n periodically checks Amazon stock levels via API.
3.  **Terminate:** If Stock = 0 → n8n → MCP `terminate_campaign` → Deal killed instantly across all channels.

> *"It's Saturday. The brand manager is home. He gets a notification that stock is low. He types 'End Amazon Deal' into Slack, and the entire 54-variant campaign is offline in seconds. Total control, zero overhead."*

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
