# PRD-002: Phase 2 - "The Coffee Chain" (Core MVP)

**Status:** Next Up
**Theme:** Deliver the primary "coffee reading" feature by fetching and summarizing remote release notes.
**Epic:** [Phase 2 - The Coffee Chain (v1.0 - Core MVP)](#epic-phase-2---the-coffee-chain-v10---core-mvp)

---

## User Stories

### S-201: Consolidated News Summary
As a developer, I want a single, simple command to get a summary of all the latest news from my favorite products so I don't have to check 10 different websites.

### S-202: Customizable Feed List
As a developer, I want to easily add or remove RSS/Atom feeds from a central list so I can customize what my "daily grind" summary contains.

---

## Functional Requirements

1.  **`fetch_daily_grind` Tool:**
    *   A new MCP tool, `fetch_daily_grind`, must be added to the local server.
    *   **Input:** `{ feedUrls: z.array(z.string()) }`
    *   **Output:** `{ releaseNotes: z.array(z.object({ title: string, link: string, content: string, source: string })) }`
    *   **Logic:** The tool will iterate through the `feedUrls`, fetch each one, and parse the XML. It will then aggregate the entries into a single JSON array.

2.  **`my_grind_list.json` Context File:**
    *   The extension must include a context file named `my_grind_list.json`.
    *   This file will contain a simple JSON object, e.g., `{ "feeds": ["url1", "url2", ...] }`.

3.  **`brew_me_a_summary` Custom Command:**
    *   The `gemini-extension.json` manifest must define a new `customCommands: brew_me_a_summary`.
    *   **name:** `brew_me_a_summary`
    *   **description:** "Brews a fresh summary of your favorite release notes."
    *   **context:** Must include `["${extensionPath}/my_grind_list.json"]`.
    *   **prompt:** The prompt must instruct Gemini to:
        *   Read the list of URLs from the `my_grind_list.json` context.
        *   Call the `fetch_daily_grind` tool with those URLs.
        *   Provide a single, high-level, bulleted summary of all the new items.
        *   Maintain the friendly "barista" persona.

---

## Technical Implementation Notes

*   The `fetch_daily_grind` tool will need the `fast-xml-parser` library, as shown in the blog.
*   This is the most critical feature. The prompt engineering for `brew_me_a_summary` is key to a good user experience.

---

## Success Metrics

*   A user can edit the `my_grind_list.json` file in their installed extension directory.
*   When the user runs `g! brew_me_a_summary`, Gemini calls the `fetch_daily_grind` tool and returns a coherent, multi-source summary.

---

## Epic: Phase 2 - The Coffee Chain (v1.0 - Core MVP)

**Goal:** Deliver the primary "coffee reading" feature. This involves fetching remote release notes from a user-defined list, parsing them, and providing a consolidated summary via a single, simple custom command.

### User Stories

#### Story 1: Create "Fetch Daily Grind" Tool
*   **As a:** Developer
*   **I want:** A new MCP tool that can fetch and parse multiple remote RSS/Atom feeds
*   **So that:** The Gemini CLI can retrieve the raw release note data from the internet for summarization.
*   **Acceptance Criteria:**
    *   The TypeScript MCP server (from Phase 1) is updated to register a new tool named `fetch_daily_grind`.
    *   The tool's input schema (using `zod`) accepts: `{ feedUrls: z.array(z.string()) }`.
    *   The tool's output schema (using `zod`) returns a structured array, e.g.: `{ releaseNotes: z.array(z.object({ title: z.string(), link: z.string(), content: z.string(), source: z.string() })) }`.
    *   The tool's logic iterates through each URL in the `feedUrls` input.
    *   It uses `fetch` to get the raw XML data for each feed.
    *   It uses a parsing library (like `fast-xml-parser`, as seen in the blog) to convert the XML from each feed into a JSON structure.
    *   It successfully aggregates all parsed entries from all feeds into the single `releaseNotes` array.
    *   The `source` field in the output object should be the feed URL (or a derivative) to help identify the post's origin.
    *   Basic error handling is included: If a feed fails to fetch or parse, the tool should log an error and continue to the next feed, not crash.

#### Story 2: Create "My Grind List" Context File
*   **As a:** User
*   **I want:** A simple, editable JSON file within the extension's directory
*   **So that:** I can easily add, remove, or update the list of RSS feeds I want to track.
*   **Acceptance Criteria:**
    *   A new file named `my_grind_list.json` is created in the root of the `daily-grind` extension directory.
    *   The file contains a valid JSON object with a single top-level key, `feeds`.
    *   The `feeds` key holds an array of strings, where each string is a valid RSS/Atom feed URL.
    *   **Example content:**
        ```json
        {
          "feeds": [
            "https://cloud.google.com/feeds/cloud-run.xml",
            "https://github.com/kubernetes/kubernetes/releases.atom"
          ]
        }
        ```

#### Story 3: Implement "Brew Me a Summary" Custom Command
*   **As a:** User
*   **I want:** A single, easy-to-remember custom command (`brew_me_a_summary`)
*   **So that:** I can get my consolidated news briefing without having to manually call tools or provide URLs.
*   **Acceptance Criteria:**
    *   The `gemini-extension.json` file is updated to include a `customCommands` array.
    *   A new command object is defined with:
        *   `"name": "brew_me_a_summary"`
        *   `"description": "Brews a fresh summary of your favorite release notes."`
        *   `"context": ["${extensionPath}/my_grind_list.json"]` (This injects the file content)
    *   The command's `prompt` field contains a clear, multi-step prompt for the model.
    *   The prompt must instruct Gemini to:
        *   "You are a friendly news barista."
        *   "Look at the `my_grind_list.json` file provided in the context."
        *   "Take the list of URLs from the `feeds` array."
        *   "Call the `fetch_daily_grind` tool with this list of URLs."
        *   "Once you have the JSON of all release notes, provide a high-level, bulleted summary of the most important updates for me."
        *   "Group the updates by their source to make it easy to read."
