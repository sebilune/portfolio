import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-4 text-sm border-t-2 border-natural-400 dark:border-neutral-700 text-neutral-400 bg-background">
      <div className="container flex justify-between max-w-3xl px-10 mx-auto">
        <a
          href="https://youtu.be/gWI1d891COE?si=5kXxAofcSEvcBuUP&t=32"
          className="inline-flex items-center group"
        >
          <p className="group-hover:underline group-hover:decoration-neutral-500 group-hover:decoration-2 group-hover:underline-offset-4">
            Engineers turn dreams into reality.
          </p>
          <ArrowUpRight size={16} className="ml-0.5" />
        </a>
        <p>2026</p>
      </div>
    </footer>
  );
}
