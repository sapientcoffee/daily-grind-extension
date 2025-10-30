/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// This is the full content for your .ts file
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

// 1. Initialize your MCP Server
const server = new McpServer({
  name: 'daily-grind-mcp-server',
  version: '1.0.0',
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

// 5. Start the server and listen for commands from Gemini CLI
const transport = new StdioServerTransport();
await server.connect(transport);
console.log(`Daily Grind MCP Server started`);