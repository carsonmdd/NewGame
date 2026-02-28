"use client";

import { Resource } from "@/types/resource";

export default function ResourceCard({
  resource,
  onEdit,
  onDelete,
}: {
  resource: Resource;
  onEdit: (resource: Resource) => void;
  onDelete: (resource: Resource) => void;
}) {
  return (
    <div className="rounded-2xl bg-[#B99AD5]/35 p-6 shadow-sm border border-[#B99AD5]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden>
              ☆
            </span>
            <h3 className="text-xl font-semibold text-[#333333] truncate">
              {resource.title || "Resource Name"}
            </h3>
          </div>

          <p className="mt-2 text-sm text-[#333333]/90 line-clamp-2">
            {resource.description ||
              "Description goes here. (Optional for now.)"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onEdit(resource)}
          className="rounded-full p-2 hover:bg-white/50"
          aria-label="Edit resource"
          title="Edit"
        >
          ✏️
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(resource.tags ?? []).slice(0, 6).map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full bg-[#B99AD5] text-[#333333] text-xs"
          >
            {t}
          </span>
        ))}

        <button
          type="button"
          className="w-8 h-8 rounded-full bg-[#B99AD5] text-[#333333] flex items-center justify-center"
          aria-label="Add tag (not implemented)"
          title="Add tag (later)"
          onClick={() => {}}
        >
          +
        </button>

        <button
          type="button"
          onClick={() => onDelete(resource)}
          className="ml-auto text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
