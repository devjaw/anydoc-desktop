import { useEffect, useMemo, useRef, useState } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import init, { toMarkdownBytes } from "@firecrawl/anydoc-wasm";
import wasmUrl from "@firecrawl/anydoc-wasm/anydoc_wasm_bg.wasm?url";
import { TabBar } from "./components/TabBar";
import { Toolbar, type View } from "./components/Toolbar";
import { StatusBar } from "./components/StatusBar";
import { Viewer } from "./components/Viewer";
import { useTabs } from "./hooks/useTabs";
import { saveMarkdown, readDocument } from "./file/fileOps";
import { pickOpenPath } from "./file/fileIO";
import { loadRecent, pushRecent, type Recent } from "./utils/recentFiles";
import "./App.css";

export default function App() {
  const { tabs, activeId, active, setActiveId, updateTab, addTab, closeTab } = useTabs();
  const [ready, setReady] = useState(false);
  const [recent, setRecent] = useState<Recent[]>([]);
  const [view, setView] = useState<View>("preview");
  const [dragActive, setDragActive] = useState(false);

  const activeIdRef = useRef(activeId);
  useEffect(() => { activeIdRef.current = activeId; }, [activeId]);

  useEffect(() => { init({ module_or_path: wasmUrl }).then(() => setReady(true)); }, []);
  useEffect(() => { loadRecent().then(setRecent); }, []);

  async function convertPath(path: string, tabId: string) {
    let name = path;
    try {
      const doc = await readDocument(path);
      name = doc.name;
      updateTab(tabId, { title: name, state: { kind: "converting", name } });
      const md = toMarkdownBytes(doc.bytes, doc.ext === "csv" ? "csv" : undefined);
      updateTab(tabId, { state: { kind: "done", name, md } });
      await pushRecent(name, path);
      setRecent(await loadRecent());
    } catch (e: any) {
      updateTab(tabId, {
        state: { kind: "error", name, msg: e?.code ? `${e.code}: ${e.message}` : String(e) },
      });
    }
  }

  async function browse() {
    const path = await pickOpenPath();
    if (path) convertPath(path, activeIdRef.current);
  }

  function openRecent(r: Recent) {
    convertPath(r.path, activeIdRef.current);
  }

  useEffect(() => {
    const unlisten = getCurrentWebview().onDragDropEvent((event) => {
      if (event.payload.type === "over") setDragActive(true);
      else if (event.payload.type === "leave") setDragActive(false);
      else if (event.payload.type === "drop") {
        setDragActive(false);
        const path = event.payload.paths[0];
        if (path) convertPath(path, activeIdRef.current);
      }
    });
    return () => { unlisten.then((fn) => fn()); };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod) return;
      const k = e.key.toLowerCase();
      if (k === "o") { e.preventDefault(); browse(); }
      else if (k === "t") { e.preventDefault(); addTab(); }
      else if (k === "w") { e.preventDefault(); closeTab(activeId); }
      else if (k === "s" && active.state.kind === "done") {
        e.preventDefault();
        saveMarkdown(active.state.name, active.state.md);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeId, active]);

  const counts = useMemo(() => {
    if (active.state.kind !== "done") return null;
    const md = active.state.md;
    return {
      words: (md.trim().match(/\S+/g) || []).length,
      chars: md.length,
      lines: md.split("\n").length,
    };
  }, [active]);

  if (!ready) return <div className="app"><p className="loading">Loading…</p></div>;

  const done = active.state.kind === "done" ? active.state : null;

  return (
    <div className="app">
      <TabBar
        tabs={tabs}
        activeId={activeId}
        onSelect={setActiveId}
        onClose={closeTab}
        onAdd={addTab}
      />

      {done && (
        <Toolbar
          view={view}
          onViewChange={setView}
          name={done.name}
          md={done.md}
        />
      )}

      <div className="content">
        <Viewer
          state={active.state}
          view={view}
          isDragActive={dragActive}
          onBrowse={browse}
          onOpenRecent={openRecent}
          recent={recent}
        />
      </div>

      {counts && <StatusBar counts={counts} />}
    </div>
  );
}
