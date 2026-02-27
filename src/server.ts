import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { simulateDelivery } from "./webhookSimulator";
import { generateEnglishVariants } from "./copyGenerator";
import { expandWithLocalizations } from "./localization";
import type { CopyVariant, DealInput, DistributeDealResult } from "./types";

import path from "path";

dotenv.config({ path: path.join(__dirname, '../.env') });

const server = new McpServer({
  name: "grabon-distribution-mcp",
  version: "1.0.1",
});

const dealShape = {
  merchant_id: z.string().describe("Merchant name (REQUIRED). e.g. Zomato"),
  category: z.string().describe("Market category (REQUIRED). e.g. food"),
  discount_type: z
    .enum(["percentage", "flat"])
    .describe("Is this a 'percentage' (%) OR 'flat' (₹) discount?"),
  discount_value: z.number().describe("The numeric value of the discount."),
  expiry_timestamp: z
    .string()
    .optional()
    .default(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .describe("Expiry date. Default: 7 days."),
  min_order_value: z
    .number()
    .optional()
    .default(0)
    .describe("Minimum order value. Default: 0."),
  max_redemptions: z
    .number()
    .optional()
    .default(1000)
    .describe("Redemptions limit. Default: 1000."),
  exclusive_flag: z
    .boolean()
    .optional()
    .default(false)
    .describe("Is this GrabOn exclusive? Default: false."),
  bank_partner: z
    .string()
    .optional()
    .describe("OPTIONAL: Banking/Payment partner (e.g. HDFC, ICICI, Cred)."),
};

server.tool(
  "distribute_deal",
  "Enterprise Deal Distribution Rail. Generates 54 variants across multiple channels and languages.",
  dealShape,
  async (args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    const isMockMode = !apiKey || apiKey.includes("your_sk_key_here") || apiKey === "MOCK";

    const deal: DealInput = args as DealInput;

    async function generateVariants(lang: "en" | "hi" | "te", dealJson: string, baseVariants?: CopyVariant[]): Promise<CopyVariant[]> {
      const dealData: DealInput = JSON.parse(dealJson);
      const partnerContext = dealData.bank_partner ? ` (Partnered with ${dealData.bank_partner})` : "";

      // AI Path: Real generation via Claude
      if (!isMockMode) {
        const anthropic = new Anthropic({ apiKey });
        const prompt = lang === "en"
          ? `Generate 18 GrabOn marketing variants (6 channels x 3 types: urgency, value, social_proof) for this deal: ${dealJson}${partnerContext}. 
             If a bank_partner is mentioned, ensure PayU and WhatsApp variants highlight the bank offer.
             Output ONLY a JSON array.`
          : `Translate/Adapt these 18 variants into ${lang === 'hi' ? 'Hindi' : 'Telugu'}. Source: ${JSON.stringify(baseVariants)}. 
             Ensure regional script for bank names if appropriate. Output ONLY a JSON array.`;

        const response = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 4000,
          temperature: 0,
          system: "You are a GrabOn marketing expert. Output valid JSON arrays only.",
          messages: [{ role: "user", content: prompt }],
        });

        const text = (response.content[0] as any).text;
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        return JSON.parse(text.slice(start, end + 1));
      }

      // Simulation Path: Native rule-based engine
      // This allows the demo to work flawlessly even without an API key
      if (lang === "en") {
        return generateEnglishVariants(deal);
      }

      // For hi/te, we use our local localization engine
      const all = expandWithLocalizations(baseVariants || []);
      return all.filter(v => v.language === lang);
    }

    try {
      const dealJson = JSON.stringify(deal);
      const totalStartTime = Date.now();

      // Step 1: English (18)
      const genStartTime = Date.now();
      const enVariants = await generateVariants("en", dealJson);

      // Step 2 & 3: Localization (Combined 36)
      const [hiVariants, teVariants] = await Promise.all([
        generateVariants("hi", dealJson, enVariants),
        generateVariants("te", dealJson, enVariants)
      ]);
      const generationMs = Date.now() - genStartTime;

      const allVariants = [...enVariants, ...hiVariants, ...teVariants];
      const method = isMockMode ? "Native Engine (Deterministic Simulation)" : "Claude AI (Dynamic)";
      const simulated: DistributeDealResult = await simulateDelivery(deal, allVariants, method);

      const totalMs = Date.now() - totalStartTime;

      // Add timing breakdown to the result
      simulated.generationDuration = `${(generationMs / 1000).toFixed(2)} sec`;
      simulated.totalDuration = `${(totalMs / 1000).toFixed(2)} sec`;

      if (isMockMode) {
        (simulated as any)._system_note = "⚡️ RUNNING IN SIMULATION MODE: No valid ANTHROPIC_API_KEY detected. To unlock the full Generative AI path (dynamic translation/adaptation via Claude-3), please add your sk- key to the .env file.";
      }

      return {
        content: [{ type: "text", text: JSON.stringify(simulated, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `❌ Distribution Error: ${error?.message || String(error)}` }],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Failed to start GrabOn distribution MCP server", err);
  process.exit(1);
});
