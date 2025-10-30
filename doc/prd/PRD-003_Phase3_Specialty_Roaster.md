# PRD-003: Phase 3 - "The Specialty Roaster"

**Status:** Future
**Theme:** Evolve from a local tool to a powerful, shared, data-driven service.
**Epic:** [Phase 3 - The Specialty Roaster (v2.0)](#epic-phase-3---the-specialty-roaster-v20)

---

## User Stories

### S-301 (Power User): Query by Product Name

As a tech lead, I want to ask for updates by product name (e.g., "What's new with Cloud Run?") without needing to know or find the specific RSS feed URL.

### S-302 (Team): Shared Configuration

As a team lead, I want my entire team to use the daily-grind extension with a shared configuration and (where needed) shared credentials, without each member running their own local server.

---

## Functional Requirements

1.  **New Data-Driven Tool:**
    - Implement the MCP toolbox for databases as described in the blog.
    - Define a `tools.yaml` file that connects to the `bigquery-public-data.google_cloud_release_notes` public dataset.
    - Create a tool: `find_notes_for_product`.
    - **Input:** `{ productName: string, limit: number }`
    - **Logic:** Runs a SQL query (as shown in the blog) `WHERE LOWER(product_name) LIKE LOWER(CONCAT('%', @product_name, '%'))`.

2.  **Remote MCP Server Deployment:**
    - The MCP server (either the Toolbox or the TS server, or both) must be containerized in a `Dockerfile`.
    - This container must be deployed to a persistent, public-facing URL (e.g., using Google Cloud Run).

3.  **Extension Manifest Update:**
    - The `gemini-extension.json` file's `mcpServers` definition must be updated.
    - The `command` and `args` (for local execution) must be replaced with a `uri` key pointing to the deployed Cloud Run service's URL. This will make Gemini CLI communicate with the remote server.

---

## Technical Implementation Notes

- This phase directly follows the second half of the blog post, using the MCP Toolbox and `tool.yaml`.
- The deployment to Cloud Run will require a new `Dockerfile` and a simple CI/CD pipeline (e.g., GitHub Actions) to build and deploy the container.

---

## Success Metrics

- A user with the v2.0 extension can run `g! "What were the last 5 updates for 'Cloud Run'?"` and receive a BigQuery-backed response.
- The extension works for all users without a local `node` server running.
- The MCP server logs can be viewed centrally in Cloud Run.

---

## Epic: Phase 3 - The Specialty Roaster (v2.0)

**Goal:** Evolve daily-grind from a local tool into a powerful, shared service. This phase introduces advanced, data-driven queries (using the MCP Toolbox) and transitions the MCP server to a remote, cloud-hosted service for team use.

### User Stories

#### Story 1: Implement "Find Notes" Tool with MCP Toolbox

- **As a:** Tech Lead
- **I want:** To ask for release notes using just a product name (e.g., "Cloud Run")
- **So that:** I can get updates quickly without needing to know or find the specific RSS feed URL for that product.
- **Acceptance Criteria:**
  - The daily-grind extension's `gemini-extension.json` is updated to include a second MCP server definition, this one for the MCP Toolbox.
  - A new `tools.yaml` file is created within the extension directory, as shown in the blog post.
  - This `tools.yaml` defines a `bigquery` source pointing to the `bigquery-public-data.google_cloud_release_notes.release_notes` public dataset.
  - The `tools.yaml` defines a tool named `find_notes_for_product_name`.
  - This tool's statement must be a SQL query that searches the `product_name` column (e.g., `WHERE LOWER(product_name) LIKE LOWER(CONCAT('%', @product_name, '%'))`).
  - The tool must accept `@product_name` (string) and `@limit` (integer) as parameters.
  - The `gemini-extension.json` definition for this new MCP server must use the `${extensionPath}${/}toolbox` binary (which must be bundled with the extension) and point to the new `${extensionPath}${/}tools.yaml` file.
  - After installing, a user can successfully run a prompt like: `g! "What were the last 3 updates for 'Cloud Run'?"` and Gemini will use the new `find_notes_for_product_name` tool.

#### Story 2: Containerize the MCP Server(s)

- **As a:** Platform Engineer (SRE/DevOps)
- **I want:** To package the daily-grind MCP server logic (both the TS server from Phase 2 and the MCP Toolbox from Story 1) into a standard Docker container
- **So that:** It can be deployed, managed, and scaled as a consistent, remote service, independent of any user's local machine.
- **Acceptance Criteria:**
  - A `Dockerfile` is created in the root of the `daily-grind` repository.
  - The `Dockerfile` must be multi-stage to keep the final image clean.
  - **Stage 1 (TS Server):** Use a Node.js base image, copy `package.json`, run `npm install`, copy the TypeScript source, and run the `npm run build` (or `tsc`) command.
  - **Stage 2 (Toolbox):** Download the `toolbox` binary for Linux.
  - **Final Stage:** Use a minimal base image (e.g., `gcr.io/distroless/nodejs`).
  - Copy the compiled JavaScript and `node_modules` from Stage 1.
  - Copy the `toolbox` binary from Stage 2.
  - Copy the `tools.yaml` file.
  - **Note:** A single "entrypoint" script will be needed to launch both servers (e.g., using `supervisor` or a simple bash script) or you must create two separate containers/services. (A single service for the Toolbox is a simpler initial step).
  - The container must expose a port (e.g., 8080) for communication.

#### Story 3: Deploy MCP Server to Google Cloud Run

- **As a:** Platform Engineer
- **I want:** To deploy the containerized MCP server to a secure, managed, and serverless environment
- **So that:** It is highly available for my entire team without me managing any VMs.
- **Acceptance Criteria:**
  - A new Google Cloud Run service is created.
  - The container from Story 2 is successfully built and pushed to a registry (e.g., Google Artifact Registry).
  - The Cloud Run service is deployed using this container image.
  - The service is configured to be private (invocations require authentication).
  - A service account is created and granted the necessary roles (e.g., BigQuery Data Viewer) for the Toolbox to query the BigQuery dataset.
  - The Cloud Run service is configured to run as this new service account.
  - (If bundling the `tools.yaml` is a security risk, it must be stored in Google Secret Manager and mounted as a secret volume in the Cloud Run service).

#### Story 4: Update Extension to Use Remote Server

- **As a:** Developer on a team
- **I want:** My daily-grind extension to automatically connect to my team's shared, remote MCP server
- **So that:** I get all the powerful features (like BigQuery queries) without running any local servers or managing my own credentials.
- **Acceptance Criteria:**
  - The `gemini-extension.json` file is modified.
  - The `mcpServers` definitions (for both the TS server and the Toolbox server) are updated.
  - The local `command` and `args` keys are removed.
  - A new `httpUrl` (or `uri`) key is added, pointing to the public URL of the deployed Cloud Run service from Story 3.
  - A new `README.md` instruction is added for team members, explaining that to use the v2.0 extension, they must:
    - Install the `gcloud` CLI.
    - Run `gcloud auth login`.
    - Have an IAM policy granting them the `Cloud Run Invoker` role for the new service. This configuration assumes Gemini CLI (or the underlying `gcloud` proxy) will handle the OIDC authentication against the private Cloud Run service.
