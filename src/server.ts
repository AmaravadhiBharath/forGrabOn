import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { simulateDelivery } from "./webhookSimulator";
import type { CopyVariant, DealInput, DistributeDealResult } from "./types";

dotenv.config();

const server = new McpServer({
  name: "grabon-distribution-mcp",
  version: "1.0.0",
});

// THE SAFETY GUARD: This Zod schema acts as our strict "Data Contract."
// It ensures every deal has valid data before reaching our distribution channels.
const dealShape = {
  merchant_id: z.string().describe("Merchant name (REQUIRED). e.g. Zomato"),
  category: z.string().describe("Market category (REQUIRED). e.g. food"),
  discount_value: z.number().describe("Numeric value only (REQUIRED). e.g. 40 or 500"),
  discount_type: z
    .enum(["percentage", "flat"])
    .describe("Type: 'percentage' for % or 'flat' for ₹. (REQUIRED)"),
  expiry_timestamp: z
    .string()
    .optional()
    .default(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
    .describe("Expiration date. OPTIONAL: Use default if missing."),
  min_order_value: z
    .number()
    .optional()
    .default(0)
    .describe("Minimum order. OPTIONAL: Use 0 if missing."),
  max_redemptions: z
    .number()
    .optional()
    .default(1000)
    .describe("Total uses. OPTIONAL: Use 1000 if missing."),
  exclusive_flag: z
    .boolean()
    .optional()
    .default(false)
    .describe("GrabOn Exclusive? OPTIONAL: Use false if missing."),
};

server.tool(
  "distribute_deal",
  "Enterprise Deal Distribution Rail. IMPORTANT: If any REQUIRED field is missing, ask the user. For all OPTIONAL fields, use defaults silently. NEVER ask for optional fields unless the user brings them up.",
  dealShape,
  async (args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return {
        content: [{ type: "text", text: "❌ Setup Error: ANTHROPIC_API_KEY is missing." }],
      };
    }

    const anthropic = new Anthropic({ apiKey });
    const deal: DealInput = args as DealInput;

    async function generateVariants(lang: "en" | "hi" | "te", dealJson: string, baseVariants?: CopyVariant[]): Promise<CopyVariant[]> {
      const isEnglish = lang === "en";
      const prompt = isEnglish
        ? `Generate 18 GrabOn marketing variants (6 channels x 3 types: urgency, value, social_proof) for this deal: ${dealJson}. 
           
           CRITICAL CONSTRAINTS:
           - email: subject + headline + CTA
           - whatsapp: max 160 chars
           - push: 50 char title + 100 char body
           - glance: 160 chars, MUST work without context
           - payu: 40 chars, action-oriented banner
           - instagram: caption + relevant hashtags
           
           Output ONLY a JSON array: [{"channel": "...", "variant": "...", "language": "en", "text": "..."}]`
        : `Translate and culturally adapt these 18 GrabOn marketing variants into ${lang === 'hi' ? 'Hindi' : 'Telugu'}. 
           
           CRITICAL: 
           - Do not use literal word-for-word translation. 
           - Use regional idioms for urgency and social proof.
           - Ensure scripts are ${lang === 'hi' ? 'Devanagari' : 'Telugu'}. 
           - Glance cards must be self-explanatory.
           
           Source: ${JSON.stringify(baseVariants)}.
           Output ONLY a JSON array with language "${lang}".`;

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4000,
        temperature: 0,
        system: "You are a GrabOn marketing and localization expert. Output valid JSON arrays only.",
        messages: [{ role: "user", content: prompt }],
      });

      const text = (response.content[0] as any).text;
      try {
        const start = text.indexOf("[");
        const end = text.lastIndexOf("]");
        if (start === -1 || end === -1) throw new Error("No JSON array found in response");
        return JSON.parse(text.slice(start, end + 1));
      } catch (e) {
        throw new Error(`Failed to parse ${lang} variants. Text begins with: ${text.substring(0, 50)}... Error: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    try {
      const dealJson = JSON.stringify(deal);

      // Step 1: English (18)
      const enVariants = await generateVariants("en", dealJson);

      // Step 2 & 3: Hindi and Telugu (Parallel for speed - 18 each)
      const [hiVariants, teVariants] = await Promise.all([
        generateVariants("hi", dealJson, enVariants),
        generateVariants("te", dealJson, enVariants)
      ]);

      const allVariants = [...enVariants, ...hiVariants, ...teVariants];
      const simulated: DistributeDealResult = await simulateDelivery(deal, allVariants);

      return {
        content: [{ type: "text", text: JSON.stringify(simulated, null, 2) }],
      };
    } catch (error: any) {
      return {
        content: [{ type: "text", text: `❌ Distribution Error: ${error?.status || 'Unknown'} - ${error?.message || String(error)}` }],
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
