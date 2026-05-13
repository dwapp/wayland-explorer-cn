# AI Agent Collaboration Guide (AGENTS.md)

Welcome, AI Agent! This document provides essential context and technical guidelines for collaborating on the **Wayland Explorer (Chinese/Multilingual Edition)**.

## Project Overview
This project is a web-based browser for Wayland protocols, parsed from XML to JSON and rendered via React. It features a custom localization system that allows for Chinese translations while maintaining 100% compatibility with upstream protocol updates.

## Technical Architecture

### 1. Localization Strategy: Translation Overlay
We use a **non-destructive overlay strategy** to support multiple languages (primarily Chinese).
- **Upstream Data**: Located in `src/data/protocols/*.json`. These files are auto-generated from XML and should **never** be manually edited.
- **Translation Patches**: Located in `src/data/translations/zh-CN/protocols/*.json`. These files contain only the translated fields (e.g., `summary`, `text`).
- **Merging Logic**: The `src/lib/i18n.ts` utility contains the `applyTranslation` function. It performs a deep merge of the translation patch onto the upstream JSON at runtime.

### 2. How to Add a New Translation
1. Identify the protocol ID (e.g., `xdg-shell`).
2. Create a translation file: `src/data/translations/zh-CN/protocols/xdg-shell.json`.
3. Follow the schema defined in `TranslationData` (`src/lib/i18n.ts`). Example:
   ```json
   {
     "interfaces": {
       "xdg_wm_base": {
         "description": { "summary": "窗口管理器基础接口", "text": "..." }
       }
     }
   }
   ```
4. Register the translation in `src/data/protocol-registry.ts`:
   ```typescript
   {
     id: 'xdg-shell',
     // ...
     translations: {
       'zh-CN': require('./translations/zh-CN/protocols/xdg-shell.json'),
     }
   }
   ```

### 3. UI Internationalization
- **Labels**: Static UI strings are managed in `src/lib/i18n-labels.ts`.
- **Context**: Language state is managed via `LanguageProvider` in `src/lib/LanguageContext.tsx`. Use the `useLanguage()` hook to access the current language (`en` or `zh`) and the `i18n` labels.

## Development Workflow
- **Package Manager**: Use `Bun`.
- **Build Command**: `bun run build`. This runs pre-build scripts to parse XMLs and post-build scripts for static HTML rendering.
- **Upstream Sync**: If you add new protocols to the `protocols/` directory, run `bun run build` to generate the base JSONs in `src/data/protocols/`.

## Key Files & Directories
- `src/lib/i18n.ts`: Core merging logic.
- `src/lib/LanguageContext.tsx`: React Context for language switching.
- `src/lib/i18n-labels.ts`: UI text dictionary.
- `src/data/protocol-registry.ts`: The central registry mapping protocol IDs to their data and translations.

## Translation Guidelines (zh-CN)

### Terminology Preservation
When translating into Chinese, use a **technical/code context** — preserve domain-specific terms that developers already know:
- **Protocol names**: Wayland, wlroots, XDG, KDE, GNOME, Mir, etc.
- **Technical concepts**: compositor, surface, buffer, seat, output, registry, etc.
- **Protocol identifiers**: `wl_display`, `wl_surface`, `xdg_toplevel`, etc. (these are code references, never translate)
- **Version status labels**: Stable, Staging, Unstable, Experimental, Core, External — these are protocol classification categories and should remain in English
- **Code-level keywords**: request, event, enum, entry, argument, new_id, opcode, etc.

### Translation Targets
Only translate **natural language descriptions** — prose that explains what something does:
- `summary` fields (short interface/protocol descriptions)
- `text` fields (longer descriptions, copyright blocks, explanations)
- Generic UI labels where a Chinese equivalent is unambiguous (e.g., "版本" for "version", "描述" for "description")

### Style Rules
- Use `\n` for line breaks in JSON strings, not literal newlines
- Escape double quotes: `\"` not `"`
- Avoid curly quotes `"..."` — use standard `""` only
- Keep parenthesized English terms sparingly — only when the Chinese term alone might be ambiguous. For protocol status labels (Stable, Staging, etc.), use the English term directly without a Chinese wrapper (e.g., prefer `"Stable"` over `"稳定 (Stable)"`)

## Rules for AI Agents
1. **Never edit `src/data/protocols/*.json`**. These are upstream mirrors.
2. Always prefer the **Translation Overlay** pattern for any content modification.
3. When adding new labels, update both `zh` and `en` sections in `src/lib/i18n-labels.ts`.
4. Use **Bun** for all shell commands where possible.
5. **JSON Formatting**: Translation JSON files must be strictly valid JSON:
   - Use `\n` for line breaks, not literal newlines
   - Escape double quotes inside strings: `\"` not `"`
   - Avoid using curly quotes `"..."` inside strings
   - Always validate JSON syntax before committing
6. **Translation Structure**: Follow the `TranslationData` interface in `src/lib/i18n.ts` exactly. Only translate `summary` and `text` fields within `description` objects.
7. **Build Verification**: After creating or modifying translation files, run `bun run build` to verify the project compiles correctly.
8. **Terminology**: Never translate protocol names (Wayland, wlroots), technical concepts (compositor, surface, buffer), code identifiers (`wl_display`), or protocol status labels (Stable, Staging, Unstable, Experimental, Core, External). Translate only natural language descriptions and unambiguous UI labels.

## Large File Translation Workflow

For large protocol files (>700 lines) or batch translation tasks, use the **parallel subagent workflow** to ensure quality and avoid context window limits.

### Workflow Steps

1. **Analyze**: Use Python to extract all translatable fields from the source protocol and identify missing translations.

2. **Batch**: Group interfaces into batches of ~60-150 fields each. Balance batch sizes for parallel execution.

3. **Extract**: Write each batch to a temporary file in `.tmp/` directory:
   ```bash
   mkdir -p .tmp
   # Write batch files: .tmp/wayland_batch{N}.json
   ```

4. **Dispatch**: Launch parallel subagents (one per batch) using the Task tool:
   - Each subagent reads its batch file
   - Translates all `summary` and `text` fields
   - Writes result to `.tmp/wayland_batch{N}_zh.json`
   - Validates JSON syntax

5. **Merge**: After all subagents complete, merge all patches into the target translation file using Python.

6. **Verify**: Run `bun run build` to ensure the merged translation compiles correctly.

7. **Cleanup**: Remove temporary files in `.tmp/` after successful merge.

### Example Dispatch Pattern

```
# Parallel dispatch (6 subagents)
task(category="deep", prompt="Read .tmp/wayland_batch1.json, translate, write to .tmp/wayland_batch1_zh.json")
task(category="deep", prompt="Read .tmp/wayland_batch2.json, translate, write to .tmp/wayland_batch2_zh.json")
# ... etc

# After all complete, merge with Python
python3 merge_translations.py
```

### Temporary File Location

- Use `.tmp/` directory in the project root for all temporary files
- Never use `/tmp/` as it may require elevated permissions
- Clean up `.tmp/` files after successful merge
