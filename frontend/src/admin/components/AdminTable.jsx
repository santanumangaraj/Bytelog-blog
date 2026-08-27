/**
 * AdminTable — generic, presentational data table.
 *
 * Knows nothing about blogs/users/reports: everything comes from `columns`.
 *
 * columns: [{
 *   key: string,                    // unique + used to read row[key] when no render()
 *   label: string | ReactNode,
 *   render?: (row, index) => ReactNode,
 *   className?: string,             // applied to <th> and <td>
 *   headerClassName?: string,
 *   align?: "left" | "center" | "right",
 *   width?: string,                 // e.g. "w-16"
 * }]
 */
const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export default function AdminTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = "No records found",
  emptyState = null,
  rowKey,
  onRowClick,
  skeletonRows = 6,
  dense = false,
  className = "",
}) {
  const cellPad = dense ? "px-3 py-2" : "px-4 py-3";
  const getKey = (row, index) =>
    typeof rowKey === "function" ? rowKey(row, index) : (row?.[rowKey] ?? row?.id ?? row?._id ?? index);

  return (
    <div
      className={`overflow-hidden rounded-xl border border-base-300 bg-base-100 ${className}`}
    >
      <div className="w-full overflow-x-auto">
        <table className="table w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-base-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`${cellPad} whitespace-nowrap border-b border-base-300 text-xs font-semibold uppercase tracking-wide text-base-content/60 ${
                    alignClass[col.align] ?? "text-left"
                  } ${col.width ?? ""} ${col.headerClassName ?? col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: skeletonRows }).map((_, r) => (
                <tr key={`sk-${r}`} className="border-b border-base-300/70 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className={cellPad}>
                      <div className="skeleton h-4 w-full max-w-[160px] rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length || 1} className="p-0">
                  {emptyState ?? (
                    <div className="px-4 py-12 text-center text-sm text-base-content/60">
                      {emptyMessage}
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={getKey(row, index)}
                  onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                  className={`border-b border-base-300/70 text-base-content transition-colors last:border-0 hover:bg-base-200/70 ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`${cellPad} align-middle ${alignClass[col.align] ?? "text-left"} ${
                        col.className ?? ""
                      }`}
                    >
                      {col.render ? col.render(row, index) : (row?.[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
