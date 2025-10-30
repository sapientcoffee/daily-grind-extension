# Gemini CLI Project: daily-grind

## Project Overview

This project is a Gemini CLI extension named "daily-grind". Its purpose is to act as a personal "news barista," fetching, consolidating, and summarizing the latest updates from a user-defined list of tech news sources like RSS feeds and public datasets.

The extension is built using TypeScript and leverages the Model Context Protocol (MCP) to provide custom tools to the Gemini model. It starts as a local server and is designed to evolve into a remotely deployed, shareable service for teams.

Key technologies used:
*   **TypeScript:** The primary language for the MCP server.
*   **Node.js:** The runtime environment for the local MCP server.
*   **@modelcontextprotocol/sdk:** The official SDK for creating MCP servers and tools.
*   **Zod:** Used for defining the input and output schemas for the custom tools, ensuring type safety.

## Building and Running

### Building the Project

To compile the TypeScript source code into JavaScript, run the following command. The output will be placed in the `dist` directory as configured in `tsconfig.json`.

```sh
npm run build
```

### Running the Extension

1.  **Install Dependencies:**
    ```sh
    npm install
    ```

2.  **Build the TypeScript code:**
    ```sh
    npm run build
    ```

3.  **Install the Extension Locally:**
    To use the extension with the Gemini CLI, you need to install it from this directory.

    ```sh
    gemini extensions install .
    ```

Once installed, the Gemini CLI will automatically start the MCP server (as defined in `gemini-extension.json`) when a prompt requires one of its tools.

## Development Conventions

*   **Tool Definition:** All custom tools are defined in the `daily-grind.ts` file (which will be expanded to house the `daily-grind` tools).
*   **Schema Validation:** Tool inputs and outputs are strictly defined using the `zod` library to ensure data integrity and provide clear contracts for the model to follow.
*   **MCP Server:** The project uses the `StdioServerTransport` for communication between the Gemini CLI and the local Node.js server process.
*   **Configuration:** The core extension definition is in `gemini-extension.json`. This file tells the Gemini CLI how to start the local MCP server.
