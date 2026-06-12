interface FeatureCardProps {
  title: string;
  description: string;
  showImage?: boolean;
}

export function FeatureCard({
  title,
  description,
  showImage = false,
}: FeatureCardProps) {
  return (
    <section className="flex flex-col items-center py-12 text-center">
      <div className="w-full max-w-md rounded-md bg-card p-6">
        <h2 className="mb-4 text-xl font-medium text-card-foreground">{title}</h2>

        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>

        {showImage && <div className="mt-8 h-52 w-full bg-muted rounded-md" />}
      </div>
    </section>
  );
}