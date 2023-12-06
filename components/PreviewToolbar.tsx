export default function PreviewToolbar({ children }) {
  return (
    <div className="absolute top-0 right-0 w-full z-[4] shadow-sm bg-[var(--sp-colors-surface1)] border-none h-500 py-50 px-200">
      {children}
    </div>
  );
}
