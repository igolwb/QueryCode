import Link from "next/link";

export function Header() {
  return (
    <header className="w-full bg-primary border-b border-border">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-primary-foreground">
          QueryCode
        </Link>

        <button
          type="button"
          aria-label="Open menu"
          className="flex flex-col gap-1 p-2 rounded focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <span className="h-0.5 w-5 bg-primary-foreground" />
          <span className="h-0.5 w-5 bg-primary-foreground" />
          <span className="h-0.5 w-5 bg-primary-foreground" />
        </button>
      </div>
    </header>
  );
}