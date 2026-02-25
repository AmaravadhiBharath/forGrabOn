## GrabOn Deal Distribution MCP Server

This project implements a fully spec-compliant Model Context Protocol (MCP) server that Claude Desktop can connect to as a local tool. It exposes a single primary tool, `distribute_deal`, which:

- **Generates 18 English copy variants** (6 channels × 3 variants).
- **Localizes to English, Hindi, and Telugu** (54 strings total).
- **Simulates webhook delivery with retries** and channel-wise success rates.

### Architecture Overview

- **MCP Server**: TypeScript server using `@modelcontextprotocol/sdk` over stdio.
- **Primary tool**: `distribute_deal(merchant_id, category, discount_value, discount_type, expiry_timestamp, min_order_value, max_redemptions, exclusive_flag)`.
- **Copy engine**:
  - 6 channels: email, WhatsApp, push, Glance lock screen, PayU checkout banner, Instagram caption.
  - 3 variants per channel:
    - Urgency (time pressure / FOMO)
    - Value (specific savings)
    - Social proof (others using it / ratings).
- **Localization layer**:
  - Starts from the 18 English variants.
  - Adapts intent into Hindi and Telugu, not literal translations.
  - Ensures urgency/value/social-proof tone is preserved per language.
- **Webhook simulation**:
  - Simulated endpoints per channel.
  - Each (channel, language, variant) is “sent” with a probabilistic success rate.
  - Retries failed sends up to 2 additional times.
  - Computes per-channel delivery success rates.

The tool response acts as a **dashboard**: Claude will render a JSON structure containing all 54 strings plus detailed delivery logs and summaries.

### Installation

From the project root:

```bash
npm install
npm run build
```

### Running the MCP Server

You can run the server in either dev or production mode:

```bash
# Dev (TypeScript directly)
npm run dev

# Production (compiled JS)
npm run build
npm start
```

The server communicates via **stdio**, as required by Claude Desktop MCP, so there is no separate HTTP port to open for the MCP itself.

### Claude Desktop Configuration

To connect this server to Claude Desktop as a local MCP:

1. Find or create the Claude Desktop MCP config file (on macOS it is typically at a path like):
   - `~/Library/Application Support/Claude/claude_desktop_config.json`
2. Add an entry for this server. Example configuration:

```json
{
  "mcpServers": {
    "grabon-distribution-mcp": {
      "command": "node",
      "args": [
        "/Users/USERNAME/Desktop/project 6/dist/server.js"
      ]
    }
  }
}
```

Replace `USERNAME` and the path with your actual local path to this project. If you prefer dev mode, you can point to:

```json
{
  "mcpServers": {
    "grabon-distribution-mcp": {
      "command": "npm",
      "args": [
        "run",
        "dev"
      ],
      "workingDirectory": "/Users/USERNAME/Desktop/project 6"
    }
  }
}
```

After saving the config, restart Claude Desktop. You should see **“grabon-distribution-mcp”** appear as a connected tool in the MCP/tools section.

### Using the `distribute_deal` Tool in Claude

Once connected, you can use natural language in Claude Desktop, for example:

- **Example 1 (food)**:
  - “Distribute a new GrabOn-exclusive Zomato deal: 40% off food orders above ₹300, valid till 2026-12-31T23:59:59+05:30, max 5000 redemptions.”
- **Example 2 (fashion)**:
  - “Distribute a Myntra deal with flat ₹500 off fashion orders above ₹1999, valid for the next 3 days, not exclusive to GrabOn, with up to 2000 redemptions.”
- **Example 3 (travel)**:
  - “Distribute a MakeMyTrip travel deal: 20% off flights up to ₹1500, minimum booking ₹4000, valid for 10 days, exclusive to GrabOn, max 3000 redemptions.”

Claude will map this to the `distribute_deal` tool by filling:

- `merchant_id`
- `category`
- `discount_value`
- `discount_type` (`percentage` or `flat`)
- `expiry_timestamp` (ISO string)
- `min_order_value`
- `max_redemptions`
- `exclusive_flag`

### Tool Output Shape

The tool returns a single JSON object with:

- **`deal`**: Echo of the input deal.
- **`variants`**: Array of 54 copy variants:
  - Fields: `channel`, `variant` (urgency/value/social_proof), `language` (`en`/`hi`/`te`), `text`.
- **`deliveryLogs`**: Detailed webhook simulation logs:
  - Fields: `id`, `channel`, `language`, `variant`, `attempt`, `status`, `timestamp`, optional `error`.
- **`channelSummary`**: Per-channel success metrics:
  - Fields: `channel`, `successRate`, `delivered`, `failed`, `total`.

You can ask Claude to **pretty-print** or **group by channel/language** to turn this into a human-friendly dashboard view.

### Webhook Retry Behaviour

- Every (channel, language, variant) message:
  - Gets an initial send attempt.
  - If it fails, is retried up to **2 additional times**.
- Base (simulated) success probabilities:
  - Email, WhatsApp: high (near 100%).
  - Push, Glance, PayU, Instagram: slightly lower to demonstrate failures.
- The final status for success-rate calculation is based on whether **any attempt** for that variant eventually succeeded.

### Edge Cases

- **Invalid or non-ISO `expiry_timestamp`**:
  - Falls back to generic phrases like “before the deal expires”.
- **Zero or missing `min_order_value`**:
  - Copy omits the minimum order restriction.
- **Unexpected variant count**:
  - There is an internal assertion that we get exactly 54 variants; if not, the tool throws with a clear error.

### What You’d Demo Live

In a live evaluation:

1. Open Claude Desktop and confirm `grabon-distribution-mcp` shows as a connected MCP server.
2. Ask Claude in natural language to “distribute this deal” for at least **three different merchants** (e.g. Zomato, Myntra, MakeMyTrip).
3. For each:
   - Let Claude call `distribute_deal`.
   - Inspect all **54 strings** (English, Hindi, Telugu for all 6 channels × 3 variants).
   - Review the **webhook `deliveryLogs`** and **`channelSummary`** to see retry behaviour and success rates.
4. Optionally ask Claude to:
   - “Show me only the WhatsApp Telugu urgency variants.”
   - “Summarize delivery success rates by channel.”

This demonstrates technical correctness, product thinking around channels and variants, localization quality, and resilience of the webhook layer.

