const fs = require('fs');
const path = require('path');
const os = require('os');
try { require('dotenv').config(); } catch (e) { }

function getClaudeConfigPath() {
    const platform = os.platform();
    if (platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    } else if (platform === 'win32') {
        return path.join(process.env.APPDATA || '', 'Claude', 'claude_desktop_config.json');
    }
    return null;
}

function setup() {
    console.log('🚀 Starting GrabOn MCP Auto-Setup...');

    const configPath = getClaudeConfigPath();
    if (!configPath) {
        console.error('❌ Unsupported platform. Please follow manual setup in README.');
        return;
    }

    const distPath = path.resolve(__dirname, 'dist', 'server.js');
    if (!fs.existsSync(distPath)) {
        console.error('❌ Build not found! Please run "npm run build" first.');
        return;
    }

    // Prepare the server entry
    const serverEntry = {
        command: 'node',
        args: [distPath],
        env: {
            ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || 'your_sk_key_here'
        }
    };

    try {
        let config = { mcpServers: {} };

        // Ensure directory exists
        const configDir = path.dirname(configPath);
        if (!fs.existsSync(configDir)) {
            fs.mkdirSync(configDir, { recursive: true });
        }

        // Read existing config if it exists
        if (fs.existsSync(configPath)) {
            const rawContent = fs.readFileSync(configPath, 'utf-8');
            try {
                if (rawContent.trim()) {
                    config = JSON.parse(rawContent);
                }
                if (!config.mcpServers) config.mcpServers = {};
            } catch (e) {
                console.warn('⚠️ Existing config was corrupt, creating new one.');
            }
        }

        // Add/Update entry
        config.mcpServers['grabon-distribution-mcp'] = serverEntry;

        // Write back
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        console.log('\x1b[32m%s\x1b[0m', '✅ Configuration successful!');
        console.log(`📍 Updated: ${configPath}`);
        console.log('\x1b[33m%s\x1b[0m', '\n🔄 Please RESTART Claude Desktop to activate the tool.');

        // Final Touch: Open .env automatically for the user
        const { exec } = require('child_process');
        const envPath = path.resolve(__dirname, '.env');
        const openCmd = platform === 'win32' ? `start "" "${envPath}"` : `open "${envPath}"`;

        console.log('\x1b[36m%s\x1b[0m', '\n📂 Opening .env file for you to paste your key...');
        exec(openCmd);

    } catch (err) {
        console.error('\x1b[31m%s\x1b[0m', '❌ Error writing configuration:', err.message);
    }
}

setup();
