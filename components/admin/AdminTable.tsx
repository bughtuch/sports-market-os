interface Column<T> {
  key: string;
  label: string;
  render: (row: T) => React.ReactNode;
  width?: string;
}

interface AdminTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  emptyMessage?: string;
  keyFn: (row: T) => string;
}

export default function AdminTable<T>({
  columns,
  rows,
  emptyMessage = "No records found.",
  keyFn,
}: AdminTableProps<T>) {
  return (
    <div className="border border-zinc-800/60 rounded-sm overflow-hidden">
      {/* Header */}
      <div
        className="grid bg-zinc-900/60 border-b border-zinc-800/60"
        style={{ gridTemplateColumns: columns.map((c) => c.width ?? "1fr").join(" ") }}
      >
        {columns.map((col) => (
          <div key={col.key} className="px-3 py-2">
            <span className="text-zinc-600 text-[8px] font-mono uppercase tracking-widest">
              {col.label}
            </span>
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.length === 0 ? (
        <div className="px-3 py-6 text-center">
          <p className="text-zinc-600 text-[10px] font-mono">{emptyMessage}</p>
        </div>
      ) : (
        rows.map((row) => (
          <div
            key={keyFn(row)}
            className="grid border-b border-zinc-900/60 last:border-0 hover:bg-zinc-900/20 transition-colors"
            style={{ gridTemplateColumns: columns.map((c) => c.width ?? "1fr").join(" ") }}
          >
            {columns.map((col) => (
              <div key={col.key} className="px-3 py-2.5 flex items-center min-w-0">
                <div className="text-[10px] min-w-0 w-full">{col.render(row)}</div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
