import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { generateEnglishVariants } from "./copyGenerator";
import { expandWithLocalizations } from "./localization";
import { simulateDelivery } from "./webhookSimulator";

const server = new McpServer({
  name: "grabon-distribution-mcp",
  version: "1.0.0",
});

const dealShape = {
  merchant_id: z.string().describe("Brand or merchant name, e.g. Zomato, Myntra"),
  category: z
    .string()
    .describe("Deal category, e.g. food, fashion, travel, electronics"),
  discount_value: z.number().describe("Numeric discount value, e.g. 40, 50, 1500"),
  discount_type: z
    .enum(["percentage", "flat"])
    .describe("Whether discount_value is percentage or flat rupee amount"),
  expiry_timestamp: z
    .string()
    .describe("ISO timestamp for when the deal expires"),
  min_order_value: z
    .number()
    .describe("Minimum order value required to apply the deal"),
  max_redemptions: z
    .number()
    .describe("Maximum number of times this deal can be redeemed"),
  exclusive_flag: z
    .boolean()
    .describe("True if the deal is exclusive to GrabOn"),
};

server.tool(
  "distribute_deal",
  dealShape,
  async (args) => {
    const english = generateEnglishVariants(args);
    const allLocalized = expandWithLocalizations(english);

    if (allLocalized.length !== 54) {
      // 6 channels * 3 variants * 3 languages
      throw new Error(
        `Expected 54 variants but generated ${allLocalized.length}. Check generation logic.`
      );
    }

    const simulated = simulateDelivery(args as any, allLocalized);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(simulated, null, 2),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start GrabOn distribution MCP server", err);
  process.exit(1);
});

