function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export { LoadingSpinner };