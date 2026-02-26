"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const webhookSimulator_1 = require("./webhookSimulator");
dotenv_1.default.config();
const server = new mcp_js_1.McpServer({
    name: "grabon-distribution-mcp",
    version: "1.0.0",
});
// THE SAFETY GUARD: This Zod schema acts as our strict "Data Contract."
// It ensures every deal has valid data before reaching our distribution channels.
const dealShape = {
    merchant_id: zod_1.z.string().describe("Brand or merchant name, e.g. Zomato, Myntra"),
    category: zod_1.z
        .string()
        .default("general")
        .describe("Deal category, e.g. food, fashion, travel, electronics"),
    discount_value: zod_1.z.number().describe("Numeric discount value, e.g. 40, 50, 1500"),
    discount_type: zod_1.z
        .enum(["percentage", "flat"])
        .describe("Whether discount_value is percentage or flat rupee amount"),
    expiry_timestamp: zod_1.z
        .string()
        .default(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .describe("ISO timestamp for when the deal expires (default: 7 days from now)"),
    min_order_value: zod_1.z
        .number()
        .default(0)
        .describe("Minimum order value required to apply the deal (default: 0)"),
    max_redemptions: zod_1.z
        .number()
        .default(1000)
        .describe("Maximum number of times this deal can be redeemed (default: 1000)"),
    exclusive_flag: zod_1.z
        .boolean()
        .default(false)
        .describe("True if the deal is exclusive to GrabOn (default: false)"),
};
server.tool("distribute_deal", "Generates localized copy variants and simulates across all GrabOn channels.", dealShape, async (args) => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return {
            content: [{ type: "text", text: "❌ Setup Error: ANTHROPIC_API_KEY is missing." }],
        };
    }
    const anthropic = new sdk_1.default({ apiKey });
    const deal = args;
    async function generateVariants(lang, dealJson, baseVariants) {
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
            model: "claude-3-5-haiku-latest",
            max_tokens: 4000,
            temperature: 0,
            system: "You are a GrabOn marketing and localization expert. You only output valid JSON arrays. Never include preamble or conversational text.",
            messages: [{ role: "user", content: prompt }],
        });
        const text = response.content[0].text;
        try {
            const start = text.indexOf("[");
            const end = text.lastIndexOf("]");
            if (start === -1 || end === -1)
                throw new Error("No JSON array found in response");
            return JSON.parse(text.slice(start, end + 1));
        }
        catch (e) {
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
        const simulated = await (0, webhookSimulator_1.simulateDelivery)(deal, allVariants);
        return {
            content: [{ type: "text", text: JSON.stringify(simulated, null, 2) }],
        };
    }
    catch (error) {
        return {
            content: [{ type: "text", text: `❌ Distribution Error: ${error?.status || 'Unknown'} - ${error?.message || String(error)}` }],
        };
    }
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    console.error("Failed to start GrabOn distribution MCP server", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map