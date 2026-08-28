# AnyDoc Desktop — UX Design

Convert documents (docx, pdf, pptx, xlsx, epub, csv, rtf, odt) to Markdown, locally, via WASM.

## Layout

```
┌────────────────────────────────────────────────────────┐
│  [+ New] [ report.pdf ×] [ slides.pptx ×] [ notes ×]  │  ← tab bar
├────────────────────────────────────────────────────────┤
│                                                        │
│                    ┌──────────────┐                    │
│                    │   Drop file  │                    │
│                    │      or      │                    │
│                    │    browse    │                    │
│                    └──────────────┘                    │
│                                                        │
│                                                        │
├────────────────────────────────────────────────────────┤
│  ready · anydoc-wasm 0.2.4                             │  ← status bar
└────────────────────────────────────────────────────────┘
```

After conversion, the tab body switches to:

```
┌────────────────────────────────────────────────────────┐
│ [Preview] [Raw MD]              [⧉ Copy] [↓ Save .md] │  ← toolbar
├────────────────────────────────────────────────────────┤
│  # Rendered markdown / raw text                        │
│  ...                                                   │
└────────────────────────────────────────────────────────┘
```

## Core requirements (asked)

1. **Tabs** — each tab holds one document's state (`idle | converting | done | error`). New tab opens with the uploader. Closing the last tab reopens a fresh one.
2. **Uploader by default** — empty tab shows the drop zone centered. Drag anywhere on the tab body highlights the drop target.
3. **Copy icon** — top-right of the result view. Click → copies raw markdown to clipboard, icon flips to ✓ for 1.5s.

## Suggested extras (pick what earns its keep)

**Cheap & high-value**
- **Save as .md** — one button next to Copy. Uses Tauri's `save` dialog.
- **Preview / Raw toggle** — rendered HTML vs. raw markdown in a `<pre>`. Two tabs, one state, no new dep.
- **Recent files** — last 10, shown on the empty uploader. `localStorage` only, no re-conversion (files may have moved).
- **Drop multiple files** — each becomes its own tab, converted in parallel.
- **Keyboard shortcuts** — `Ctrl+T` new tab, `Ctrl+W` close, `Ctrl+C` when result focused, `Ctrl+S` save, `Ctrl+Tab` cycle.
- **Dark mode** — `prefers-color-scheme` + a manual toggle. CSS vars, no lib.

**Medium effort**
- **Word / char / line counts** — footer of result view. Three `useMemo`s.
- **Search within result** — `Ctrl+F` overlay, native `window.find` fallback or a small custom highlighter.
- **Drag tab to reorder** — HTML5 drag API, ~30 lines.
- **Split view** — side-by-side preview + raw. Toggle from toolbar.

**Higher effort — only if users ask**
- **Batch mode** — drop a folder, get a zip of `.md` files.
- **Frontmatter injector** — prepend YAML (title, date, source filename) before copy/save.
- **Export to HTML / PDF** — reuse `marked` output, print-to-PDF via Tauri window.
- **CLI parity** — expose the same WASM via a `anydoc` CLI shipped with the app.

## Non-goals

- Cloud sync, accounts, telemetry — this is a local converter.
- Editing the markdown — copy it into a real editor.
- Format detection heuristics — extension is enough; if it fails, the error message says so.

## State model (tab-scoped)

```ts
type Tab = {
  id: string;
  title: string;                    // filename or "New tab"
  state: "idle" | "converting" | "done" | "error";
  file?: { name: string; ext: string };
  md?: string;
  error?: string;
};

type AppState = {
  tabs: Tab[];
  activeId: string;
};
```

WASM `init()` runs once at app boot (already does), shared across tabs.

## Open questions

- Persist tabs across restarts? (Content only, since File handles don't survive.) — default **no**, YAGNI until asked.
- Max tabs? — soft cap none, WASM converts are fast and memory frees on close.
- What happens on drop into a tab that already has a result? — replace it (current tab is a workspace, not a history slot). Users who want history use recent files.
