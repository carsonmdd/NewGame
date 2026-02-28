"use client";

import { useEffect, useMemo, useState } from "react";
import { resourceApi } from "@/lib/api";
import { Resource, ResourceInput } from "@/types/resource";
import ResourceForm from "@/components/ResourceForm";
import Sidebar from "@/components/Sidebar";
import ResourceCard from "@/components/ResourceCard";

type TabKey = "database" | "review" | "stats" | "notifications";

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("database");

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingResource, setEditingResource] = useState<Resource | null | "new">(null);

  // UI-only controls (safe: no backend changes)
  const [search, setSearch] = useState("");
  const [sortNewest, setSortNewest] = useState(false);
  const [sortLanguage, setSortLanguage] = useState(false);
  const [sortTags, setSortTags] = useState(false);

  const loadResources = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await resourceApi.getAll();
      setResources(response.data.data);
    } catch {
      setError("Failed to load resources.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  const handleCreateOrUpdate = async (input: ResourceInput) => {
    try {
      if (editingResource === "new") {
        await resourceApi.create(input);
      } else if (editingResource) {
        await resourceApi.update(editingResource.pk, editingResource.sk, input);
      }
      setEditingResource(null);
      loadResources();
    } catch {
      alert("Operation failed");
    }
  };

  const handleDelete = async (resource: Resource) => {
    if (!confirm(`Are you sure you want to delete ${resource.title}?`)) return;

    try {
      await resourceApi.delete(resource.pk, resource.sk);
      loadResources();
    } catch {
      alert("Failed to delete resource. Check CORS and Lambda logs.");
    }
  };

  // IMPORTANT: Filtering is DISABLED for now.
  // Search input is UI-only, does not affect displayed cards yet.
  const displayedResources = useMemo(() => {
    return resources;
  }, [resources]);

  // Placeholder pages 
  const Placeholder = ({ title }: { title: string }) => (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-[#333333]">{title}</h1>
      <p className="mt-2 text-slate-600">
        This section is set up for navigation, but will be implemented later.
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-8">
          {/*  switch tabs to placeholder pages */}
          {activeTab === "review" && <Placeholder title="Resources for Review" />}
          {activeTab === "stats" && <Placeholder title="Statistics" />}
          {activeTab === "notifications" && <Placeholder title="Notifications" />}

          {activeTab === "database" && (
            <div className="max-w-6xl mx-auto">
              {/* Top row: search + filter icon + plus */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 bg-white border rounded-2xl px-4 py-3 shadow-sm">
                    <span className="text-slate-500" aria-hidden>
                      🔍
                    </span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search for resources"
                      className="w-full outline-none text-[#333333]"
                    />
                    <button
                      type="button"
                      className="text-slate-500 hover:text-slate-800"
                      aria-label="Filter options (placeholder)"
                      title="Filters later"
                      onClick={() => {}}
                    >
                      🎛️
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingResource("new")}
                  className="w-14 h-14 rounded-full bg-[#B99AD5] text-[#333333] text-3xl flex items-center justify-center shadow-sm"
                  aria-label="Add resource"
                  title="Add resource"
                >
                  +
                </button>
              </div>

              {/* Sort buttons row (UI-only for now) */}
              <div className="mt-6 flex gap-6">
                <button
                  type="button"
                  onClick={() => setSortNewest((v) => !v)}
                  className="flex-1 bg-[#8C4D93] text-white py-3 rounded-xl font-semibold"
                >
                  Sort by Newest {sortNewest ? "▲" : "▼"}
                </button>
                <button
                  type="button"
                  onClick={() => setSortLanguage((v) => !v)}
                  className="flex-1 bg-[#8C4D93] text-white py-3 rounded-xl font-semibold"
                >
                  Sort by Language {sortLanguage ? "▲" : "▼"}
                </button>
                <button
                  type="button"
                  onClick={() => setSortTags((v) => !v)}
                  className="flex-1 bg-[#8C4D93] text-white py-3 rounded-xl font-semibold"
                >
                  Sort by tags {sortTags ? "▲" : "▼"}
                </button>
              </div>

              {/* Error / loading */}
              {loading && <div className="mt-8">Loading...</div>}
              {error && <p className="text-red-600 mt-6">{error}</p>}

              {/* Card list container */}
              <div className="mt-6 rounded-2xl bg-white border p-6">
                <div className="max-h-[540px] overflow-y-auto pr-2 space-y-5">
                  {displayedResources.map((r) => (
                    <ResourceCard
                      key={r.id}
                      resource={r}
                      onEdit={(res) => setEditingResource(res)}
                      onDelete={handleDelete}
                    />
                  ))}

                  {/* Only show empty state when there are literally no resources */}
                  {!loading && resources.length === 0 && (
                    <p className="text-slate-600">
                      No resources yet. Click the “+” button to add one.
                    </p>
                  )}
                </div>
              </div>

              {/* Modal: ResourceForm (Create/Edit) */}
              {editingResource && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
                  <div className="w-full max-w-2xl">
                    <ResourceForm
                      initialData={editingResource === "new" ? undefined : editingResource}
                      onSubmit={handleCreateOrUpdate}
                      onCancel={() => setEditingResource(null)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
