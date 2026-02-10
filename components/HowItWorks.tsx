const steps = [
  {
    number: "01",
    icon: "🔗",
    title: "Paste a URL",
    description:
      "Enter any company website URL and a short description of your product or service.",
  },
  {
    number: "02",
    icon: "🧠",
    title: "AI Analyzes",
    description:
      "Our AI scrapes and analyzes the website to understand the company, their services, and potential pain points.",
  },
  {
    number: "03",
    icon: "✉️",
    title: "Get 3 Emails",
    description:
      "Receive 3 unique cold email variations tailored to the company. Copy, customize, and send.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From URL to cold email in three simple steps.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-lg">
                  {step.icon}
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step {step.number}
                </span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
