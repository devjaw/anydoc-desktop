import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { saveMarkdown } from "../file/fileOps";

export type View = "preview" | "raw";

type Props = {
  view: View;
  onViewChange: (v: View) => void;
  name: string;
  md: string;
};

export function Toolbar({ view, onViewChange, name, md }: Props) {
  const [copied, setCopied] = useState(false);

  function doCopy() {
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="toolbar">
      <div className="segmented" role="tablist">
        <button
          className={`seg-btn ${view === "preview" ? "active" : ""}`}
          onClick={() => onViewChange("preview")}
        >Preview</button>
        <button
          className={`seg-btn ${view === "raw" ? "active" : ""}`}
          onClick={() => onViewChange("raw")}
        >Raw</button>
      </div>
      <div className="toolbar-actions">
        <button className="btn" onClick={doCopy}>
          {copied ? <Check size={14} strokeWidth={1.5} /> : <Copy size={14} strokeWidth={1.5} />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button className="btn primary" onClick={() => saveMarkdown(name, md)}>
          <Download size={14} strokeWidth={1.5} />
          Save .md
        </button>
      </div>
    </div>
  );
}
