# daily-grind Gemini CLI Extension

**Your daily briefing of tech news, brewed just for you, right in your terminal.**

`daily-grind` is a fun, coffee-themed Gemini CLI extension that acts as a personal "news barista." It provides a single, simple command to fetch, consolidate, and intelligently summarize the latest updates from a user-defined list of sources.

This extension starts as a simple local tool and is designed to evolve into a powerful, shareable service that can query central data sources for release notes, turning your CLI into a smart, conversational research assistant.

---

## Getting Started

Follow these steps to get the `daily-grind` extension up and running on your local machine.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or higher)
*   [Gemini CLI](https://github.com/google/gemini-cli)

### Step 1: Install Dependencies

First, navigate to the extension's directory and install the required npm packages.

```bash
# From within the daily-grind-extension directory
npm install
```

### Step 2: Compile Your TypeScript

Now that the dependencies are installed, you need to compile the TypeScript code into JavaScript. The project is already configured with a build script for this.

```bash
# This runs the TypeScript compiler (tsc)
npm run build
```

This command will create a new `dist` folder containing your compiled `daily-grind.js` file. The `gemini-extension.json` manifest is already set up to look in this `dist` folder.

### Step 3: "Install" Your Local Extension

You're ready to register your extension with the main Gemini CLI. Since you are already inside the `daily-grind-extension` folder, you can just use `.` to specify the current directory.

```bash
# While still inside the ./daily-grind-extension directory
gemini extensions install .
```

You'll see a confirmation that the extension was installed successfully.

### Step 4: Run and Test Your New Tool!

You're all set! Just start the Gemini CLI.

```bash
gemini
```

When it loads, you should see a new line like `[mcp-server-example] ... started`, letting you know your extension's local server is running.

Now, test your tool with a prompt. For example, to test the `brew_suggestion` tool from Phase 1:

```
g! "I'm feeling really tired, what do you suggest?" @brew_suggestion(mood: 'tired')
```

Gemini will ask for permission to run your new tool. Once you approve, it will execute your code and provide a coffee-themed response!

---

## Feature Roadmap

This extension is being developed in phases:

*   **Phase 1: The "Local Cafe" (v0.1)**
    *   **Goal:** Establish local functionality and a delightful user experience.
    *   **Features:** A fun "coffee suggestion" tool and a basic tool to read and summarize local text files.

*   **Phase 2: The "Coffee Chain" (v1.0 - Core MVP)**
    *   **Goal:** Deliver the core value by fetching and summarizing remote release notes from user-defined RSS/Atom feeds.
    *   **Features:** A `fetch_daily_grind` tool and a `brew_me_a_summary` custom command.

*   **Phase 3: The "Specialty Roaster" (v2.0 - Team & Power-User)**
    *   **Goal:** Scale the solution for teams with advanced, data-driven queries.
    *   **Features:** Integration with BigQuery for querying release notes by product name and deployment of the MCP server to a remote service like Google Cloud Run.
