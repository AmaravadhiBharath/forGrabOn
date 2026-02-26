# Project 06: Multi-Channel Deal Distribution
## GrabOn Vibe Coder Challenge 2024-2025

| Category | Information |
| :--- | :--- |
| **Candidate** | [PASTE YOUR NAME HERE] |
| **Email** | [PASTE YOUR EMAIL HERE] |
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
- **Future Improvements**: With more time, I would add a local SQLite database for persistent logging and expand localization to more regional languages.

---

### 🎥 Live Demo
Connect the MCP to Claude Desktop and ask: *"Distribute a Zomato deal: 50% off."*
The system will generate **54 localized variants** and show the simulated **Delivery Logs** and **Success Rates**.
