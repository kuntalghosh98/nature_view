"use client";

import { useEffect, useState } from "react";
import {
  Users,
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { TeamMember } from "@/types/team";
import { getLocalizedText } from "@/lib/getLocalizedText";
import { resolveMediaUrl } from "@/lib/media";
import { useLocale } from "@/providers/LocaleProvider";
import { PageHero } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { SkeletonGrid } from "@/components/SkeletonGrid";

export default function TeamPage() {
  const { locale, t } = useLocale();
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest<{ success: boolean; data: TeamMember[] }>("/team");
        setItems(res.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** Empty state */
  const renderEmpty = () => (
    <EmptyState
      icon={Users}
      title={t("pages.team.noMembers")}
      description={t("common.checkBackSoon")}
    />
  );

  const activeRolesCount = items.filter((member) => {
    return Boolean(member.role && getLocalizedText(member.role, locale));
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-forest-50/30 to-white">
      <PageHero
        icon={Users}
        eyebrow={t("header.tagline")}
        title={t("pages.team.title")}
        subtitle={t("pages.team.subtitle")}
        stats={[
          { label: t("pages.team.stats.totalMembers"), value: items.length },
          { label: t("pages.team.stats.activeRoles"), value: activeRolesCount },
        ]}
      />

      {/* Team Grid */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg:py-24">
        {loading ? (
          <SkeletonGrid />
        ) : items.length === 0 ? (
          renderEmpty()
        ) : (
          <div
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {items.map((member) => {
              const photoUrl = resolveMediaUrl(member.photo);
              const name = getLocalizedText(member.name, locale) || "Team Member";
              const role = getLocalizedText(member.role, locale);
              const bio = getLocalizedText(member.bio, locale);
              const rawSocials = member.socials as Record<string, string> | undefined;
              const socials = rawSocials
                ? Object.entries(rawSocials).map(([platform, url]) => ({
                    platform,
                    url,
                  }))
                : undefined;
              return (
                <div key={member._id} className="group flex flex-col items-center bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-32 h-32 rounded-full mb-4 bg-neutral-100 overflow-hidden ring-4 ring-forest-50/50">
                    {photoUrl ? (
                      <img src={photoUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-forest-700 bg-forest-100 font-bold text-2xl">
                        {name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-1">{name}</h3>
                  <div className="text-forest-600 font-medium text-sm mb-4">{role}</div>
                  {bio && <p className="text-neutral-600 text-sm mb-6 line-clamp-3">{bio}</p>}
                  
                  {socials && socials.length > 0 && (
                    <div className="mt-auto flex items-center justify-center gap-4 pt-4 border-t border-neutral-100 w-full">
                      {socials.map((social) => (
                        <a key={social.platform} href={social.url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-forest-600 transition-colors" aria-label={social.platform}>
                          <span className="text-sm font-medium capitalize">{social.platform}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}



