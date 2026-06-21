import { MagicWand, ShieldCheck, Rocket, Persons } from "@gravity-ui/icons";
import SectionHeading from "@/components/ui/SectionHeading";

const features = [
  {
    icon: MagicWand,
    title: "Curated Quality",
    description: "Every prompt is reviewed by our team before going live.",
  },
  {
    icon: Rocket,
    title: "Ship Faster",
    description: "Copy battle-tested prompts and skip the trial and error.",
  },
  {
    icon: ShieldCheck,
    title: "Premium Access",
    description: "Unlock exclusive private prompts with a one-time upgrade.",
  },
  {
    icon: Persons,
    title: "Creator Community",
    description: "Built by power users sharing what actually works.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="mx-auto max-w-7xl px-4 py-16 md:py-24 lg:px-8">
        <SectionHeading
          eyebrow="Why PromptVerse"
          title="Everything you need to prompt better"
          subtitle="A platform designed for creators and power users alike."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent-soft-foreground">
                  <Icon width={24} height={24} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-muted">{f.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
