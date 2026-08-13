import type { ReactNode } from "react";
import { ui } from "../../libs/ui";
import { BrandBackground } from "./BrandBackground";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <BrandBackground />
      <main className="relative z-[1] flex min-h-screen items-center justify-center px-5 py-10 max-[640px]:items-start max-[640px]:pt-16">
        <div
          className={`${ui.glass} w-full max-w-[440px] overflow-hidden rounded-lg`}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
