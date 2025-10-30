import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { promises as fs } from 'node:fs';

// 1. Initialize your MCP Server
const server = new McpServer({
  name: 'daily-grind',
  version: '0.0.1',
});

// 2. Register your "brew_suggestion" tool
server.registerTool(
  'brew_suggestion', // The name Gemini will use (e.g., @brew_suggestion)
  {
    title: 'Brew Suggestion',
    description: "Suggests a coffee type based on the user's mood.",
    
    // Define what the tool accepts as input
    inputSchema: {
      mood: z.string().describe("The user's current mood"),
    },
    
    // Define what the tool will return as structured data
    outputSchema: {
      suggestion: z.string(),
    },
  },
  
  // 3. This is the code that runs when the tool is called
  async ({ mood }) => {
    let suggestionText = '';

    // Your fun switch logic from the user story
    switch (mood.toLowerCase()) {
      case 'tired':
        suggestionText = 'A bold espresso shot is in order!';
        break;
      case 'curious':
        suggestionText = 'A complex, single-origin pour-over sounds perfect.';
        break;
      case 'stressed':
        suggestionText = 'How about a calming, decaf latte?';
        break;
      case 'happy':
        suggestionText = 'A sweet and bright caramel macchiato would be lovely.';
        break;
      case 'adventurous':
        suggestionText = 'Why not try a spicy chai latte?';
        break;
      case 'zen':
        suggestionText = 'Sometimes, a simple cup of green tea is all you need.';
        break;
      default:
        suggestionText = 'A classic medium roast is always a good choice.';
    }

    // 4. Return the result in the format the MCP server expects
    return {
      // 'content' is the simple text passed back to the LLM
      content: [{ type: 'text', text: suggestionText }],
      
      // 'structuredContent' must match your outputSchema
      structuredContent: {
        suggestion: suggestionText,
      },
    };
  }
);

// Register the "read_local_grind" tool
server.registerTool(
  'read_local_grind',
  {
    title: 'Read Local Grind',
    description: 'Reads the content of a local text or markdown file.',
    inputSchema: {
      filePath: z.string().describe('The path to the local file to read'),
    },
    outputSchema: {
      fileContent: z.string(),
    },
  },
  async ({ filePath }) => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return {
        content: [{ type: 'text', text: content }],
        structuredContent: {
          fileContent: content,
        },
      };
    } catch (error) {
      const errorMessage = `Error reading file ${filePath}: ${error instanceof Error ? error.message : String(error)}`;
      return {
        content: [{ type: 'text', text: errorMessage }],
        structuredContent: {
          fileContent: errorMessage,
        },
      };
    }
  }
);

// 5. Start the server and listen for commands from Gemini CLI
const transport = new StdioServerTransport();
await server.connect(transport);
console.log(`Daily Grind MCP Server started`);