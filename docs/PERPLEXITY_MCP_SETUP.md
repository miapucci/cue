# Hooking Up Perplexity MCP to Cursor

Use this so your research agent can use Perplexity from inside Cursor.

---

## 1. Get a Perplexity API key

1. Go to [Perplexity API / Sonar](https://docs.perplexity.ai/guides/getting-started) and sign up.
2. Create an API key in the dashboard.
3. Copy the key (you’ll add it in step 3 below).

---

## 2. Open Cursor’s MCP config

On macOS the file is:

```text
~/.cursor/mcp.json
```

Full path example: `/Users/YourUsername/.cursor/mcp.json`

- **Terminal:** `open ~/.cursor/mcp.json` (creates the file if needed, then open it).
- **Finder:** `Cmd+Shift+.` to show hidden files, then go to your home folder → `.cursor` → `mcp.json`. Create the file if it doesn’t exist.

---

## 3. Add the Perplexity server

If `mcp.json` is empty or missing, use this (replace `YOUR_PERPLEXITY_API_KEY` with your key):

```json
{
  "mcpServers": {
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY"
      }
    }
  }
}
```

Get your API key from [Perplexity API Portal](https://www.perplexity.ai/account/api/group). This server exposes tools like `perplexity_search`, `perplexity_ask`, and `perplexity_research`.

If you already have other servers, add the `"perplexity"` block inside `mcpServers`:

```json
{
  "mcpServers": {
    "existing-server": { ... },
    "perplexity": {
      "command": "npx",
      "args": ["-y", "@perplexity-ai/mcp-server"],
      "env": {
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY"
      }
    }
  }
}
```

**Alternative package** (if the above isn’t found): use `@zhangyu1818/server-perplexity-ask` in `args` instead.

Save the file.

---

## 4. Restart Cursor

Quit Cursor completely (Cmd+Q) and open it again. MCP changes only apply after a full restart.

---

## 5. Check that it’s connected

1. Open **Cursor Settings** (Cmd+,).
2. Go to **Tools & MCP** (or **Features** → **MCP**).
3. You should see **perplexity** (or whatever name you used) with a green/connected status.

If it’s red or “not available”, check:

- API key is correct and has no extra spaces.
- Node.js is installed (`node -v` in Terminal).
- You did a full restart of Cursor.

---

## 6. Use it in chat

MCP tools run in **Composer** and **Agent** mode. Start a new Composer/Agent chat and use the research agent prompt in `docs/RESEARCH_AGENT_PROMPT.md` so the agent knows to use Perplexity for research and to give you UI/design guidance.
