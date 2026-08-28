import { Upload } from "lucide-react";
import type { Recent } from "../utils/recentFiles";

const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.userAgent);
const modLabel = isMac ? "⌘" : "Ctrl+";

function relTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(diff / 86400000);
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  if (h < 24) return `${h} hr ago`;
  if (d === 1) return "Yesterday";
  return `${d} days ago`;
}

type Props = {
  isDragActive: boolean;
  onBrowse: () => void;
  onOpenRecent: (r: Recent) => void;
  recent: Recent[];
};

export function Uploader({ isDragActive, onBrowse, onOpenRecent, recent }: Props) {
  return (
    <div className="uploader">
      <div className={`drop ${isDragActive ? "hot" : ""}`}>
        <Upload size={20} strokeWidth={1.5} className="drop-icon" />
        <h2 className="drop-title">Drop a document here</h2>
        <p className="drop-hint">...or browse. Supports docx, pdf, pptx, xlsx, epub, csv, rtf, odt.</p>
        <button className="btn primary" onClick={onBrowse}>Browse files</button>
      </div>

      {recent.length > 0 && (
        <div className="recent">
          <div className="recent-head">
            <span className="recent-label">RECENT FILES</span>
            <span className="recent-hint">{modLabel}O to open</span>
          </div>
          <ul className="recent-list">
            {recent.map((r, i) => (
              <li key={r.path}>
                <button
                  type="button"
                  className={`recent-item ${i === 0 ? "hi" : ""}`}
                  onClick={() => onOpenRecent(r)}
                  title={r.path}
                >
                  <span className="recent-name">{r.name}</span>
                  <span className="recent-time">{relTime(r.ts)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
