import { X, Plus } from "lucide-react";

export type TabState =
  | { kind: "idle" }
  | { kind: "converting"; name: string }
  | { kind: "done"; name: string; md: string }
  | { kind: "error"; name: string; msg: string };

export type Tab = { id: string; title: string; state: TabState };

export function newTab(): Tab {
  return { id: crypto.randomUUID(), title: "New tab", state: { kind: "idle" } };
}

function truncateMiddle(s: string, max = 20): string {
  if (s.length <= max) return s;
  const keep = Math.floor((max - 3) / 2);
  return s.slice(0, keep) + "..." + s.slice(-keep);
}

type Props = {
  tabs: Tab[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
  onAdd: () => void;
};

export function TabBar({ tabs, activeId, onSelect, onClose, onAdd }: Props) {
  return (
    <div className="tabbar">
      {tabs.map((t) => (
        <div
          key={t.id}
          className={`tab ${t.id === activeId ? "active" : ""}`}
          onClick={() => onSelect(t.id)}
        >
          <span className="tab-title">{truncateMiddle(t.title)}</span>
          <button
            className="tab-close"
            onClick={(e) => { e.stopPropagation(); onClose(t.id); }}
            aria-label="Close tab"
          >
            <X size={12} strokeWidth={1.5} />
          </button>
        </div>
      ))}
      <button className="tab-add" onClick={onAdd} aria-label="New tab">
        <Plus size={14} strokeWidth={1.5} />
      </button>
    </div>
  );
}
