# Gemini CLI Project: daily-grind

## Project Overview

This project is a Gemini CLI extension named "daily-grind". Its purpose is to act as a personal "news barista," fetching, consolidating, and summarizing the latest updates from a user-defined list of tech news sources like RSS feeds and public datasets.

The extension is built using TypeScript and leverages the Model Context Protocol (MCP) to provide custom tools to the Gemini model. It starts as a local server and is designed to evolve into a remotely deployed, shareable service for teams.

Key technologies used:

- **TypeScript:** The primary language for the MCP server.
- **Node.js:** The runtime environment for the local MCP server.
- **@modelcontextprotocol/sdk:** The official SDK for creating MCP servers and tools.
- **Zod:** Used for defining the input and output schemas for the custom tools, ensuring type safety.

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

- **Tool Definition:** All custom tools are defined in the `daily-grind.ts` file (which will be expanded to house the `daily-grind` tools).
- **Schema Validation:** Tool inputs and outputs are strictly defined using the `zod` library to ensure data integrity and provide clear contracts for the model to follow.
- **MCP Server:** The project uses the `StdioServerTransport` for communication between the Gemini CLI and the local Node.js server process.
- **Configuration:** The core extension definition is in `gemini-extension.json`. This file tells the Gemini CLI how to start the local MCP server.

## Git Best Practices

To maintain a clean, collaborative, and efficient development workflow, please adhere to the following Git best practices:

- **Work in Small Batches:** Break down changes into the smallest logical units possible. This makes reviews easier, reduces merge conflicts, and simplifies debugging.
- **Commit Every Change Made by the AI:** Each modification, addition, or deletion performed by the AI should be captured in a distinct commit with a clear, descriptive message. This ensures a granular history and easy traceability.
- **New Features in New Branches:** All new features, bug fixes, or significant refactorings must be developed in dedicated feature branches (e.g., `feature/my-new-feature`, `bugfix/issue-123`). Avoid direct commits to `main`.
- **Practice Trunk-Based Development:** Aim to integrate changes into the `main` branch frequently. Keep feature branches short-lived and merge them back into `main` as soon as they are complete and reviewed. This minimizes divergence and simplifies merging.
- **Descriptive Commit Messages:** Write clear, concise, and informative commit messages that explain _what_ was changed and _why_. Follow a conventional commit style if applicable (e.g., `feat: add new feature`, `fix: resolve bug`).
- **Format Before Committing:** To avoid CI failures due to code style, always run `npm run format` before committing your changes. This will automatically fix any formatting issues.
- **Pull Request Reviews:** All changes should be submitted via Pull Requests (PRs) and reviewed by at least one other team member before merging into `main`. This ensures code quality and knowledge sharing.

- **Pre-Push Code Review:** This project includes a `pre-push` Git hook that serves as a reminder to review your changes before sharing them. When you attempt to `git push`, a message will appear prompting you to run the `/code-review` command in the Gemini CLI. This helps ensure that every push has been reviewed, improving code quality and catching potential issues early.
