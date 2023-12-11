export default function NavBar({ children }) {
  return (
    <div className="absolute top-0 right-0 w-full z-[4] shadow-sm bg-[var(--sp-colors-surface1)] border-none h-600 py-50 px-200">
      {children}
    </div>
  );
}
