export function StatusIndicator() {
  return (
    <div className="mt-16 text-center">
      <div className="inline-flex items-center gap-2 bg-gray-800/30 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700/50">
        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
        <span className="text-gray-300 text-sm">
          Join thousands of trainers worldwide
        </span>
      </div>
    </div>
  );
}
