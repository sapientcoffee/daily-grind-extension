# PRD-004: Phase 3 - Observability & Production Readiness

**Status:** To Do
**Theme:** Ensure the daily-grind remote MCP server (from Phase 3) is reliable, debuggable, and performant by implementing comprehensive observability using OpenTelemetry and the Google Cloud operations suite (Logging, Metrics, and Trace).

## 1. User Stories

-   **As an SRE/Admin,** I want all server logs (startup, errors, tool calls) automatically structured and ingested into Google Cloud Logging so I can debug issues without accessing the container.
-   **As an SRE/Admin,** I want to see a pre-built dashboard in Google Cloud Monitoring showing key service metrics, such as tool call latency, error rates, and total calls per tool, so I can identify performance bottlenecks (e.g., a specific RSS feed is slow) and set up alerts.
-   **As an SRE/Admin,** I want to use Google Cloud Trace to see a full waterfall diagram of a single complex request (e.g., a `fetch_daily_grind` call) so I can pinpoint exactly which part of the operation is failing or is slow (e.g., one of the 5 fetch calls).
-   **As a Developer,** I want to use a single library (OpenTelemetry) for all instrumentation so that my code works for both local debugging (printing to console) and remote production (exporting to GCP) without any changes.

## 2. Functional Requirements

### A. OpenTelemetry SDK Integration

-   **Core SDK:** The TypeScript MCP server must be instrumented with the OpenTelemetry SDK for Node.js (`@opentelemetry/sdk-node`).
-   **Exporters:** The configuration must include the Google Cloud exporters:
    -   `@opentelemetry/exporter-trace-google-cloud` for traces.
    -   `@opentelemetry/exporter-metrics-google-cloud` for metrics.
-   **Auto-Instrumentation:** The SDK should be configured to automatically instrument key libraries, especially `http/https` (to trace the `fetch_daily_grind` calls) and `@grpc/grpc-js` (if any gRPC calls are made).

### B. Structured Logging (to Google Cloud Logging)

-   **JSON Format:** All logs (even standard `console.log`) must be formatted as a single-line JSON string. This allows Google Cloud Logging to parse them automatically. (A library like `pino` is recommended).
-   **Log Correlation:** All log entries must be enriched with the active `trace_id` and `span_id` from OpenTelemetry. This is the critical link that lets you jump from a log line directly to the trace.
-   **Key Log Events:** The following events must be logged at a minimum:
    -   `INFO`: Server startup, server shutdown.
    -   `INFO`: Tool call received (include `tool_name` and input args, scrubbing any secrets).
    -   `INFO`: Tool call completed (include `tool_name` and `duration_ms`).
    -   `ERROR`: Any unhandled exception or failed tool call (include `tool_name` and full `error_stack`).

### C. Custom Metrics (to Google Cloud Monitoring)

-   **OTel Metrics API:** Use the OTel Metrics API to define and record the following custom metrics.
-   **Key Metrics (Counters):**
    -   `mcp/tool/calls_total`: A counter that increments on every tool call.
        -   **Labels:** `tool_name`, `status_code` (e.g., "OK", "ERROR").
    -   `mcp/tool/errors_total`: A counter that increments only on failed tool calls.
        -   **Labels:** `tool_name`, `error_type`.
-   **Key Metrics (Histogram):**
    -   `mcp/tool/execution_duration_seconds`: A histogram that records the execution time for every tool call. This is the most important metric for performance.
        -   **Labels:** `tool_name`.

### D. Distributed Tracing (to Google Cloud Trace)

-   **Trace Creation:** A new trace must be created for every incoming MCP request to the server.
-   **Custom Spans:** A new child span must be created for the execution of each tool (e.g., `run:fetch_daily_grind`).
    -   This span must include attributes for the `tool_name` and input args (again, scrubbed of secrets).
    -   If the tool fails, the span's status must be set to `ERROR`.
-   **Auto-Traced Child Spans:** The OTel HTTP auto-instrumentation should automatically create child spans for every external `fetch` call made by the `fetch_daily_grind` tool, nested under the main tool span.

### E. Local Development Mode

-   The OTel SDK must be configured to check for an environment variable (e.g., `NODE_ENV=development`).
-   If in "development" mode, the SDK must not use the Google Cloud exporters. Instead, it must use the `ConsoleSpanExporter` and `ConsoleMetricExporter` to print all telemetry data directly to the terminal.

## 3. Success Metrics (Acceptance Criteria)

You know you are done when:

-   ✅ In Cloud Logging: You can see JSON-formatted logs from the Cloud Run service, and they contain a `trace_id`.
-   ✅ In Cloud Trace: You can click that `trace_id` and see a full waterfall diagram of the request.
-   ✅ In Cloud Trace: The waterfall diagram for `fetch_daily_grind` correctly shows one parent span and multiple child spans (one for each RSS feed being fetched).
-   ✅ In Cloud Monitoring: You can create a new dashboard and add a chart using the custom metric `mcp/tool/execution_duration_seconds` (grouped by `tool_name`).
-   ✅ Locally: When you run the server locally with `NODE_ENV=development`, you see trace and metric data printed to your console.
