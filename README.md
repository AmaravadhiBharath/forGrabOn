# Project 06: Multi-Channel Deal Distribution
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
Create a `.env` file in the root directory:
```bash
ANTHROPIC_API_KEY=your_sk_key_here
```

#### 3. Connect to Claude Desktop
Paste the following into your `claude_desktop_config.json`:
*(Run `pwd` in the project folder to get your absolute path)*

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

---

### 🏛️ Architecture & Design Decisions

- **Multi-Stage Translation Rail**: To ensure reliability for 54 strings, the server generates English variants first, then adapts them into Hindi and Telugu in parallel.
- **Psychological Pillars**: Copy is generated based on Urgency, Value, and Social Proof triggers to ensure effective A/B testing.
- **Resilient Webhook Simulation**: Built a `webhookSimulator` that mimics enterprise APIs with artificial latency and probabilistic failures to demonstrate a retry architecture.
### �️ Live Demo & Submission Notes
**Note on Videos:** Due to the 5-minute limit on Loom, this demonstration is split into **3 Parts** covering Architecture, Setup, and Live Demos.

**Security First:** The `.env` file is included in `.gitignore` to prevent API key exposure. To run this project, simply add your own `ANTHROPIC_API_KEY` to the local `.env` file or directly in the Claude Desktop configuration as shown above.

---

### �🔮 The "1-to-Many" Vision
The core achievement of this project is the **"1-to-Many" distribution rail**. Without MCP, a marketing manager would have to manually write, translate, and verify 54 different variants (6 channels x 3 strategies x 3 languages) for every single deal. By connecting Claude directly to this infrastructure via MCP, we turn one simple sentence into a massive, culturally-aware marketing blast in seconds.

**In conclusion:** I have delivered a scalable, culturally-aware, and resilient distribution infrastructure. This isn't just a chatbot interface; it’s a high-scale Distribution Engine that demonstrates why the Model Context Protocol is the future of enterprise marketing. 

*With more time, I would expand this into a persistent kampaign database and integrated visual asset generation for all channels.*

**Thank you for viewing my submission for the GrabOn Vibe Coder Challenge. I look forward to your feedback!**
