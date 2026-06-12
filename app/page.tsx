import Link from "next/link";

import { Footer } from "@/components/ui/layout/Footer";
import { Header } from "@/components/ui/layout/Header";
import { FeatureCard } from "@/components/ui/FeatureCard";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="mx-auto max-w-7xl px-4">
        <section className="flex flex-col items-center py-16 text-center">
          <h1 className="mb-6 text-4xl font-semibold">
            Save your code once.
            <br />
            Find it instantly when it matters.
          </h1>

          <p className="mb-8 max-w-md text-sm leading-relaxed text-muted-foreground">
            QueryCode helps you organize, tag, and search your
            snippets with precision, so you can stop digging
            through old files and focus on building.
          </p>

          <a 
            href="/auth/login"
            className="rounded-md border border-border bg-primary text-primary-foreground px-6 py-2"
          >
            Sign Up
          </a>

          <p className="mt-4 text-xs text-muted-foreground">
            already have an account?
          </p>

          <Link href="/auth/login" className="text-xs text-primary underline">
            sign in
          </Link>
        </section>

        <FeatureCard
          title="Explore snippets shared by other developers"
          description="Search code, browse community snippets, and discover solutions faster. Learn from real-world examples and adapt them to your projects."
          showImage
        />

        <FeatureCard
          title="Instant Access"
          description="No more digging through files or repositories. Find the exact snippet you need in seconds with fast, precise search."
        />

        <FeatureCard
          title="Your Code, Fully Organized"
          description="Access your complete library of snippets with powerful search and filters, so you can quickly find exactly what you need."
          showImage
        />

        <FeatureCard
          title="Designed for Developers"
          description="Built with a clean interface, performance, and zero unnecessary friction. QueryCode keeps you focused on writing code."
        />

        <FeatureCard
          title="Smart Organization"
          description="Organize snippets with tags, language detection, and flexible filters. Quickly narrow results and find exactly what you're looking for."
        />
      </main>

      <Footer />
    </>
  );
}
