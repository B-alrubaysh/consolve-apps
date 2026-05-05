import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useLanguage } from "../lib/useLanguage";

const MARQUEE_KEYFRAMES = `@keyframes consolveMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`;

function LogoItem({ client, isAr }) {
  const altText =
    (isAr ? client.logo_alt_ar : client.logo_alt_en) ||
    (isAr ? client.name_ar : client.name_en) ||
    client.name_en;

  const img = (
    <img
      src={client.logo_url}
      alt={altText}
      className="h-12 md:h-14 w-auto object-contain mx-8 grayscale opacity-60 transition duration-300 hover:grayscale-0 hover:opacity-100"
      loading="lazy"
    />
  );

  if (client.website_url) {
    return (
      <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="shrink-0 inline-flex items-center">
        {img}
      </a>
    );
  }
  return <span className="shrink-0 inline-flex items-center">{img}</span>;
}

export default function ClientLogoCarousel() {
  const { isAr } = useLanguage();
  const [clients, setClients] = useState(null); // null = loading

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const data = await base44.entities.Client.list("display_order", 100);
      if (cancelled) return;
      setClients((data || []).filter((c) => c.is_active === true));
    })();
    return () => { cancelled = true; };
  }, []);

  // Loading or empty → render nothing.
  if (clients === null || clients.length === 0) return null;

  const eyebrow = isAr ? "العملاء" : "Clients";
  const title = isAr ? "عملاؤنا" : "Our Clients";
  const subtitle = isAr
    ? "ثقة عملائنا بنا من منظمات في قطاعات متعددة"
    : "Trusted by organizations across multiple sectors";

  // Duplicate the array for a seamless infinite marquee.
  const looped = [...clients, ...clients];

  return (
    <section className="bg-background py-24 md:py-36">
      <style>{MARQUEE_KEYFRAMES}</style>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold uppercase text-primary tracking-[0.2em] mb-4">{eyebrow}</p>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">{title}</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className="flex w-max items-center hover:[animation-play-state:paused]"
          style={{
            animation: "consolveMarquee 40s linear infinite",
            animationDirection: isAr ? "reverse" : "normal",
          }}
        >
          {looped.map((c, i) => (
            <LogoItem key={`${c.id}-${i}`} client={c} isAr={isAr} />
          ))}
        </div>
      </div>
    </section>
  );
}