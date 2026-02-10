const faqs = [
  {
    question: "How does ColdPitch work?",
    answer:
      "ColdPitch scrapes and analyzes the target company's website to understand what they do, their services, and potential challenges. Then our AI uses that information to craft 3 personalized cold email variations that reference specific details from their site.",
  },
  {
    question: "What makes these emails different from ChatGPT?",
    answer:
      "Unlike generic ChatGPT outputs, ColdPitch automatically scrapes the target website and injects real, specific details into every email. Each email references actual company information — not filler content. This personalization dramatically improves response rates.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes! You can generate up to 3 cold emails per day completely free, no signup required. Each generation gives you 3 different email variations to choose from.",
  },
  {
    question: "What websites can I analyze?",
    answer:
      "ColdPitch works with any publicly accessible website. Company homepages, landing pages, and SaaS product sites work best. Some sites with heavy JavaScript rendering or access restrictions may have limited results.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>
        <div className="space-y-0 divide-y divide-border/50">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-6">
              <h3 className="text-base font-semibold text-foreground">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
