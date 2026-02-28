"use client";

type TabKey = "database" | "review" | "stats" | "notifications";

export default function Sidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}) {
  const base =
    "w-full text-left px-4 py-3 rounded-xl transition font-medium";
  const active = "bg-[#B99AD5] text-slate-900";
  const inactive = "bg-transparent text-slate-800 hover:bg-slate-100";

  return (
    <aside className="w-72 shrink-0 border-r bg-white px-4 py-6 min-h-screen">
      <div className="space-y-3">
        <button
          className={`${base} ${activeTab === "database" ? active : inactive}`}
          onClick={() => onTabChange("database")}
          type="button"
        >
          Database Search
        </button>

        <button
          className={`${base} ${activeTab === "review" ? active : inactive}`}
          onClick={() => onTabChange("review")}
          type="button"
        >
          Resources for Review
        </button>

        <button
          className={`${base} ${activeTab === "stats" ? active : inactive}`}
          onClick={() => onTabChange("stats")}
          type="button"
        >
          Statistics
        </button>

        <button
          className={`${base} ${
            activeTab === "notifications" ? active : inactive
          }`}
          onClick={() => onTabChange("notifications")}
          type="button"
        >
          Notifications
        </button>
      </div>
    </aside>
  );
}
