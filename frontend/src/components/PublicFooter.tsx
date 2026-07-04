"use client";

import Link from "next/link";
import { useLocale } from "@/providers/LocaleProvider";

export function PublicFooter() {
  const { t } = useLocale();
  return (
    <footer className="border-t border-forest-900/10 bg-forest-900/95 text-forest-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold">{t('footer.title')}</h2>
          <p className="mt-2 text-sm text-forest-100/75">{t('footer.subtitle')}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/contact" className="text-forest-100 hover:text-white">
            {t('header.nav.contact')}
          </Link>
          <Link href="/impact" className="text-forest-100 hover:text-white">
            {t('header.nav.impact')}
          </Link>
          <Link href="/team" className="text-forest-100 hover:text-white">
            {t('header.nav.team')}
          </Link>
          <Link href="/projects" className="text-forest-100 hover:text-white">
            {t('header.nav.projects')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
