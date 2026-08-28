export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3" aria-busy="true" aria-label="Loading">
      <div className="h-3 w-1/3 rounded shimmer" />
      <div className="h-8 w-2/3 rounded shimmer" />
      <div className="h-2 w-1/2 rounded shimmer" />
    </div>
  );
}

export function SkeletonTableRow() {
  return (
    <tr aria-busy="true">
      <td className="px-4 py-3"><div className="h-3 w-32 rounded shimmer" /></td>
      <td className="px-4 py-3"><div className="h-3 w-20 rounded shimmer" /></td>
      <td className="px-4 py-3"><div className="h-3 w-24 rounded shimmer" /></td>
      <td className="px-4 py-3"><div className="h-3 w-16 rounded shimmer" /></td>
      <td className="px-4 py-3"><div className="h-5 w-20 rounded-full shimmer" /></td>
      <td className="px-4 py-3"><div className="h-6 w-16 rounded shimmer" /></td>
    </tr>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3" aria-busy="true" aria-label="Loading chart">
      <div className="h-3 w-1/4 rounded shimmer" />
      <div className="h-48 w-full rounded shimmer" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded shimmer"
          style={{ width: `${70 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}
