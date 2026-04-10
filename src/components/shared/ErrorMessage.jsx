export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-2 text-xs underline hover:no-underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}
