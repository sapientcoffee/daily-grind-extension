# PRD-001: Phase 1 - "The Local Cafe"

**Status:** To Do
**Theme:** Establish local functionality, confirm the extension works, and provide initial user delight.
**Epic:** [Phase 1 - The Local Cafe (v0.1)](#epic-phase-1---the-local-cafe-v01)

---

## User Stories

### S-101: Fun "Hello World" Command
As a new user, I want a fun, simple "hello world" command so I can confirm the extension is installed correctly and get a feel for its personality.

### S-102: Local File Summarization
As a developer, I want to be able to point the extension at a local markdown file I've saved (e.g., notes.md) and get a summary, so I can test the core summarization logic.

---

## Functional Requirements

1.  **Project Scaffolding:**
    *   The project must be scaffolded using `gemini extensions new daily-grind mcp-server`.

2.  **`brew_suggestion` Tool:**
    *   The local TypeScript MCP server must register a tool named `brew_suggestion`.
    *   **Input:** `{ mood: string }`
    *   **Output:** `{ suggestion: string }`
    *   **Logic:** A simple, hard-coded switch statement (e.g., 'tired' -> 'Espresso shot', 'curious' -> 'Single-origin pour-over').

3.  **`read_local_grind` Tool:**
    *   The local server must register a second tool named `read_local_grind`.
    *   **Input:** `{ filePath: string }`
    *   **Output:** `{ fileContent: string }`
    *   **Logic:** Uses Node.js `fs.readFile` to read the text content of the file at the provided path.

---

## Technical Implementation Notes

*   The MCP server will use the `StdioServerTransport` as demonstrated in the `rss-feed-mcp-server` example.
*   Tools will be defined using the `@modelcontextprotocol/sdk/server` and `zod` libraries.

---

## Success Metrics

*   User can successfully run `gemini extensions install ./daily-grind`.
*   User can get a response from `g! "What coffee do I need?" @brew_suggestion(mood: 'tired')`.
*   User can get a summary from `g! "Summarize this for me" @read_local_grind(filePath: './release.md')`.

---

## Epic: Phase 1 - The Local Cafe (v0.1)

**Goal:** Establish the basic daily-grind extension, confirm it installs, and prove the local MCP server can run and respond to basic tool calls.

### User Stories

#### Story 1: Extension Scaffolding
*   **As a:** Developer
*   **I want:** To generate the standard file structure for a new Gemini CLI extension with an MCP server
*   **So that:** I have the correct `gemini-extension.json`, `package.json`, and an example TypeScript server file to begin development.
*   **Acceptance Criteria:**
    *   The command `gemini extensions new daily-grind mcp-server` is run successfully.
    *   A new directory named `daily-grind` is created.
    *   The directory contains the basic scaffold, including `gemini-extension.json` and a TypeScript file for the MCP server.

#### Story 2: Implement "Brew Suggestion" Tool
*   **As a:** New user
*   **I want:** A fun, coffee-themed "hello world" command
*   **So that:** I can confirm the daily-grind extension is installed and its MCP server is responding correctly, and also get a feel for its personality.
*   **Acceptance Criteria:**
    *   The TypeScript MCP server registers a new tool named `brew_suggestion`.
    *   The tool defines its input schema using `zod` to accept: `{ mood: z.string() }`.
    *   The tool defines its output schema using `zod` to return: `{ suggestion: z.string() }`.
    *   The tool's logic includes a simple, hard-coded switch or if statement (e.g., `mood: 'tired'` returns `suggestion: 'A bold espresso shot is in order!'`).
    *   After installing the local extension, I can run `g! "I'm feeling curious" @brew_suggestion(mood: 'curious')` and receive a coffee-themed string response.

#### Story 3: Implement "Read Local Grind" Tool
*   **As a:** Developer
*   **I want:** To be able to read the contents of a local text or markdown file
*   **So that:** I can pass local file content into Gemini CLI's context to test its core summarization and chat capabilities.
*   **Acceptance Criteria:**
    *   The TypeScript MCP server registers a new tool named `read_local_grind`.
    *   The tool defines its input schema using `zod` to accept: `{ filePath: z.string() }`.
    *   The tool defines its output schema using `zod` to return: `{ fileContent: z.string() }`.
    *   The tool's logic uses Node.js's `fs` module (e.g., `fs.readFile`) to read the file from the provided `filePath`.
    *   Error handling is in place in case the file doesn't exist.
    *   After installing, I can run `g! "Summarize this for me" @read_local_grind(filePath: './my_notes.md')` and Gemini will receive the content of `my_notes.md` and provide a summary.
