import { motion, useReducedMotion } from "framer-motion";
import { Map as MapIcon } from "lucide-react";
import { Button } from "./components/Button";
import { Card } from "./components/Card";

const swatches = [
  { name: "parchment", className: "bg-parchment" },
  { name: "parchment-soft", className: "bg-parchment-soft" },
  { name: "ink", className: "bg-ink" },
  { name: "wax", className: "bg-wax" },
  { name: "gold", className: "bg-gold" },
  { name: "fog", className: "bg-fog" },
];

export default function App() {
  const reducedMotion = useReducedMotion();

  return (
    <main className="parchment min-h-screen text-ink">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <header className="flex items-center gap-3">
          <MapIcon className="h-8 w-8 text-ink" aria-hidden="true" />
          <h1 className="text-4xl font-bold">The Cartographer's Atlas</h1>
        </header>
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="cipher-text mt-6 text-sm text-ink/70"
        >
          Phase 1 Foundation Preview
        </motion.p>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Theme palette</h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {swatches.map((swatch) => (
              <div key={swatch.name} className="flex flex-col items-center gap-2">
                <div
                  className={`h-16 w-full rounded-md border border-ink/20 ${swatch.className}`}
                />
                <span className="text-xs text-ink/70">{swatch.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Button variants</h2>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold">Card variants</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Card variant="default">
              <h3 className="text-lg font-bold">Default</h3>
              <p className="mt-2 text-sm text-ink/70">Soft parchment surface.</p>
            </Card>
            <Card variant="sunken">
              <h3 className="text-lg font-bold">Sunken</h3>
              <p className="mt-2 text-sm text-ink/70">Pressed into the parchment.</p>
            </Card>
            <Card variant="framed">
              <h3 className="text-lg font-bold">Framed</h3>
              <p className="mt-2 text-sm text-ink/70">Gilded map frame.</p>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
