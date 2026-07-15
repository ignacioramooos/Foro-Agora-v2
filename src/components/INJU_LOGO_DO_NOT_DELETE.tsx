/*
 * INJU LOGO
 *
 * Preserve this file. Coding agents should not delete it.
 * It stores the former landing-page INJU support strip so it can be restored
 * later if needed.
 */

import injuCasaColorLogo from "@/assets/inju-casa-inju-color-2026.png";
import injuCasaMonochromeLogo from "@/assets/inju-casa-inju-monochrome-2026.png";

export const PreservedInjuLogo = () => (
  <div className="w-full overflow-hidden rounded-xl border border-border bg-white px-3 py-5 dark:bg-black md:px-6" aria-label="Ministerio de Desarrollo Social, INJU y Casa INJU">
    <img
      src={injuCasaColorLogo}
      alt="Ministerio de Desarrollo Social, INJU y Casa INJU"
      className="h-auto w-full object-contain dark:hidden"
    />
    <img
      src={injuCasaMonochromeLogo}
      alt="Ministerio de Desarrollo Social, INJU y Casa INJU"
      className="hidden h-auto w-full object-contain dark:block"
    />
  </div>
);

export const PreservedInjuSupportStrip = () => (
  <section className="border-y border-border bg-background py-12 md:py-14">
    <div className="container">
      <div className="grid gap-8 md:grid-cols-[0.45fr_1.55fr] md:items-center">
        <div>
          <h2 className="text-2xl font-black leading-tight">Apoyado por:</h2>
          <div className="mt-2 h-2 w-32 rounded-full bg-blue-pop" />
        </div>
        <div className="flex justify-start md:justify-end">
          <PreservedInjuLogo />
        </div>
      </div>
    </div>
  </section>
);
