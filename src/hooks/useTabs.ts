import { useState } from "react";
import { newTab, type Tab } from "../components/TabBar";

export function useTabs() {
  const [tabs, setTabs] = useState<Tab[]>(() => [newTab()]);
  const [activeId, setActiveId] = useState<string>(() => tabs[0].id);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  function updateTab(id: string, patch: Partial<Tab>) {
    setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }

  function addTab() {
    const t = newTab();
    setTabs((ts) => [...ts, t]);
    setActiveId(t.id);
  }

  function closeTab(id: string) {
    setTabs((ts) => {
      const filtered = ts.filter((t) => t.id !== id);
      const next = filtered.length ? filtered : [newTab()];
      if (id === activeId) setActiveId(next[next.length - 1].id);
      return next;
    });
  }

  return { tabs, activeId, active, setActiveId, updateTab, addTab, closeTab };
}
