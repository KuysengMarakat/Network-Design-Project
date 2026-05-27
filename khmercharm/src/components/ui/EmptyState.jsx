// Generic empty-state component with optional action button.
export default function EmptyState({ icon = "🌸", title = "Nothing here", description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="text-6xl mb-4 opacity-80">{icon}</div>
      <h3 className="font-display text-xl font-bold text-brown-800 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-brown-500 max-w-sm mb-5">{description}</p>
      )}
      {action}
    </div>
  );
}
