"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const copyGenerator_1 = require("./copyGenerator");
const localization_1 = require("./localization");
const webhookSimulator_1 = require("./webhookSimulator");
const server = new mcp_js_1.McpServer({
    name: "grabon-distribution-mcp",
    version: "1.0.0",
});
const dealShape = {
    merchant_id: zod_1.z.string().describe("Brand or merchant name, e.g. Zomato, Myntra"),
    category: zod_1.z
        .string()
        .describe("Deal category, e.g. food, fashion, travel, electronics"),
    discount_value: zod_1.z.number().describe("Numeric discount value, e.g. 40, 50, 1500"),
    discount_type: zod_1.z
        .enum(["percentage", "flat"])
        .describe("Whether discount_value is percentage or flat rupee amount"),
    expiry_timestamp: zod_1.z
        .string()
        .describe("ISO timestamp for when the deal expires"),
    min_order_value: zod_1.z
        .number()
        .describe("Minimum order value required to apply the deal"),
    max_redemptions: zod_1.z
        .number()
        .describe("Maximum number of times this deal can be redeemed"),
    exclusive_flag: zod_1.z
        .boolean()
        .describe("True if the deal is exclusive to GrabOn"),
};
server.tool("distribute_deal", dealShape, async (args) => {
    const english = (0, copyGenerator_1.generateEnglishVariants)(args);
    const allLocalized = (0, localization_1.expandWithLocalizations)(english);
    if (allLocalized.length !== 54) {
        // 6 channels * 3 variants * 3 languages
        throw new Error(`Expected 54 variants but generated ${allLocalized.length}. Check generation logic.`);
    }
    const simulated = (0, webhookSimulator_1.simulateDelivery)(args, allLocalized);
    return {
        content: [
            {
                type: "text",
                text: JSON.stringify(simulated, null, 2),
            },
        ],
    };
});
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start GrabOn distribution MCP server", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map