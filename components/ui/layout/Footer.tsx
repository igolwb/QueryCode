import Link from "next/link";

export function Footer() {
  return (
    <footer className="py-8 bg-background border-t border-border">
      <div className="flex justify-center gap-4 text-sm text-muted-foreground">
        <Link href="https://github.com" className="hover:text-primary-foreground">
          github
        </Link>

        <Link href="/about" className="hover:text-primary-foreground">
          about
        </Link>

      </div>
    </footer>
  );
}