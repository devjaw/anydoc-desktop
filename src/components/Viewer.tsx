import { useMemo } from "react";
import { marked } from "marked";
import { Uploader } from "./Uploader";
import type { Recent } from "../utils/recentFiles";
import type { TabState } from "./TabBar";
import type { View } from "./Toolbar";

type Props = {
  state: TabState;
  view: View;
  isDragActive: boolean;
  onBrowse: () => void;
  onOpenRecent: (r: Recent) => void;
  recent: Recent[];
};

export function Viewer({ state, view, isDragActive, onBrowse, onOpenRecent, recent }: Props) {
  const html = useMemo(
    () => (state.kind === "done" ? (marked.parse(state.md) as string) : ""),
    [state]
  );

  if (state.kind === "idle") {
    return (
      <Uploader
        isDragActive={isDragActive}
        onBrowse={onBrowse}
        onOpenRecent={onOpenRecent}
        recent={recent}
      />
    );
  }
  if (state.kind === "converting") {
    return <p className="status">Converting {state.name}…</p>;
  }
  if (state.kind === "error") {
    return <p className="status err">{state.name}: {state.msg}</p>;
  }
  if (view === "raw") {
    return <pre className="raw">{state.md}</pre>;
  }
  return <article className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}
