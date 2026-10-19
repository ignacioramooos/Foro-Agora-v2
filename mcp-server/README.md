# Foro Ágora Math MCP Server

A Model Context Protocol (MCP) server providing access to the French preparatory class (CPGE MPSI / Math Sup) mathematics curriculum and exercise database hosted on **Foro Ágora** ([foroagora.org/maths](https://foroagora.org/maths)).

## Overview

This server allows AI assistants (Antigravity, Claude Desktop, Cursor, etc.) to query and interact with:
- **7 Mathematics Chapters**: Titles, course summaries, learning notes, and official Google Drive lecture polycopiés & TD sheets.
- **202+ Typed Exercises**: TD problem sheets, course application exercises, and homework (DM) questions with complete LaTeX statements (`$...$` and `$$...$$`), indexed by their frozen public number (`#001` through `#202+`).
- **Devoirs Maison (DM)**: Homework assignments, questions, due dates, problem sheets, and official correction documents.
- **Khôlle (Oral Exam) Syllabus**: Weekly oral interrogation scopes and mandatory theorems/demonstrations ("incontournables").
- **Google Drive Documents**: Direct view and preview links to official course PDFs and reference materials (Trigonometry formulary, Mathematical writing guide).
- **Daily Workout Generator**: Deterministic 5-exercise daily training pool matching the online site.

---

## Available Tools

| Tool | Parameters | Description |
| :--- | :--- | :--- |
| `list_chapters` | *none* | Lists all 7 chapters with summaries, exercise breakdown (Cours vs TD), and Drive PDF links. |
| `get_chapter` | `chapter` (number/string), `include_statements` (boolean) | Retrieves full chapter details, study notes, Drive links, and exercise inventory. |
| `get_exercise` | `identifier` (number/string) | Fetches complete LaTeX statement and metadata for an exercise by public UID (`14`, `"#014"`) or ID (`"ch1-ex14"`). |
| `search_exercises` | `query` (string), `chapter` (optional), `source` (optional), `limit` (optional) | Full-text search across all statements and chapter metadata with scoring. |
| `get_daily_workout` | `date` (YYYY-MM-DD, optional), `chapter` (optional) | Returns the 5 daily training exercises for a given date. |
| `list_dms` | *none* | Lists all homework assignments (due dates, chapters, Drive PDF links). |
| `get_dm` | `id` (e.g. `'dm-1'`, `'dm-2'`) | Retrieves a specific Devoir Maison with all multi-part questions in LaTeX. |
| `list_kholles` | *none* | Lists weekly oral examination programs with scopes and mandatory proofs. |
| `get_kholle` | `id_or_date` (e.g. `'2026-10-12'`, `'latest'`) | Retrieves a specific khôlle week with its core question bank and Drive link. |
| `list_documents` | `category` (`'all'`, `'cours'`, `'td'`, `'resources'`) | Lists all official Google Drive PDF documents with preview and view URLs. |
| `get_math_stats` | *none* | Returns overall database metrics and curriculum statistics. |

---

## MCP Resources

- `math://chapters`: JSON dump of all 7 chapters.
- `math://stats`: Overall curriculum and database metrics.
- `math://kholles/latest`: Latest oral exam preparation program.

---

## MCP Prompts

- `solve-exercise`: Pre-formatted prompt for an AI assistant to produce a rigorous, competition-grade French mathematical proof for a selected exercise.
- `kholle-session`: Simulates a 1-hour oral examination (khôlle) in MPSI for a specified week.

---

## Connection Modes

The server supports both **HTTP / SSE URL** and **Local stdio**.

### Mode A: HTTP / SSE URL (Remote tools, Web UIs, LibreChat, Open WebUI, Cursor SSE)

1. Start the HTTP server on port 3333:
   ```bash
   npm run mcp:sse
   # or: node mcp-server/dist/index.js --port 3333
   ```
2. Your connection URL is:
   ```
   http://localhost:3333/sse
   ```
   - SSE Endpoint: `http://localhost:3333/sse`
   - Health Check: `http://localhost:3333/health`
   - Messages: `http://localhost:3333/messages`

Configuration for tools that connect via SSE URL (e.g. Antigravity, Cursor, LibreChat):
```json
{
  "mcpServers": {
    "foroagora-math": {
      "serverUrl": "http://localhost:3333/sse"
    }
  }
}
```

---

### Mode B: Local stdio (Claude Desktop, Antigravity, Cursor)

For local desktop clients, you can connect directly via command line without running a background HTTP server:

#### 1. Google Antigravity
Add to `~/.gemini/config/mcp_config.json`:
```json
{
  "mcpServers": {
    "foroagora-math": {
      "command": "node",
      "args": ["/Users/ignac/Documents/GitHub/Foro-Agora-v2/mcp-server/dist/index.js"]
    }
  }
}
```

### 2. Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "foroagora-math": {
      "command": "node",
      "args": ["/Users/ignac/Documents/GitHub/Foro-Agora-v2/mcp-server/dist/index.js"]
    }
  }
}
```

### 3. Cursor

Add to your project's `.cursor/mcp.json` or through Cursor Settings > MCP:

```json
{
  "mcpServers": {
    "foroagora-math": {
      "command": "node",
      "args": ["/Users/ignac/Documents/GitHub/Foro-Agora-v2/mcp-server/dist/index.js"]
    }
  }
}
```

---

## Building and Rebuilding

The server is bundled into a single zero-dependency standalone Node.js script located at `mcp-server/dist/index.js`.

To rebuild after adding or updating exercises:

```bash
# From root repository
npm run build:mcp

# Or from mcp-server directory
cd mcp-server
npm run build
```
