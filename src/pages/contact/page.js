
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, Send, MessageCircle, Heart } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { useLocale } from "@/providers/LocaleProvider";

export default function ContactPage() {
  const { t } = useLocale();

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      label: t("pages.contact.address"),
      value: t("pages.contact.details.addressValue"),
    },
    {
      icon: <Phone className="w-5 h-5" />,
      label: t("pages.contact.phone"),
      value: "+880 2 988 1234",
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: t("pages.contact.email"),
      value: "info@natureview.gov.bd",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: t("pages.contact.hours"),
      value: t("pages.contact.details.hoursValue"),
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-950 py-20 lg-28">
        {/* Decorative blurs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-forest-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-500/10 px-4 py-1.5 text-sm font-medium text-accent-300 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4" />
              {t("pages.contact.hero.eyebrow")}
            </span>
          </div>

          <h1
            className="mt-6 text-4xl font-bold tracking-tight text-white lg-5xl font-display"
          >
            {t("pages.contact.title")}
          </h1>

          <p
            className="mt-4 mx-auto max-w-2xl text-lg text-forest-200/80 leading-relaxed"
          >
            {t("pages.contact.subtitle")}
          </p>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </section>

      {/* Contact Content */}
      <section className="relative mx-auto max-w-7xl px-6 py-16 lg-24">
        <div className="grid gap-10 lg-cols-5 lg-12">
          {/* Contact Info Sidebar */}
          <div
            className="lg-span-2"
          >
            <div className="sticky top-8 space-y-6">
              {/* Info heading */}
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-forest-200/60 bg-forest-50 px-4 py-1.5 text-sm font-semibold text-forest-700">
                  <Heart className="w-4 h-4" />
                  {t("pages.contact.info")}
                </span>
                <h2 className="mt-5 text-2xl font-bold text-forest-900 font-display">
                  {t("pages.contact.sidebar.title")}
                </h2>
                <p className="mt-3 text-sm text-forest-900/60 leading-relaxed">
                  {t("pages.contact.sidebar.description")}
                </p>
              </div>

              {/* Contact info cards */}
              <div
                className="space-y-4"
              >
                {contactInfo.map((info, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover-md hover-forest-200/60 hover:-translate-y-0.5"
                  >
                    <div className="flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-forest-50 text-forest-600 transition-all duration-300 group-hover-forest-100 group-hover-forest-700">
                      {info.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-forest-900/40">
                        {info.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-forest-900 break-words">
                        {info.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative accent card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-forest-700 to-forest-900 p-6 text-white">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="relative">
                  <Send className="w-8 h-8 text-accent-300" />
                  <h3 className="mt-4 text-lg font-semibold font-display">
                    {t("pages.contact.quickResponse.title")}
                  </h3>
                  <p className="mt-2 text-sm text-forest-200/80 leading-relaxed">
                    {t("pages.contact.quickResponse.description")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="lg-span-3"
          >
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="border-t border-neutral-200 bg-gradient-to-b from-neutral-50 to-white py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <div
          >
            <p className="text-sm font-medium tracking-widest uppercase text-forest-600">
              {t("pages.contact.cta.eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-bold text-forest-900 font-display lg-4xl">
              {t("pages.contact.cta.title")}
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-forest-900/60 leading-relaxed">
              {t("pages.contact.cta.subtitle")}
            </p>
            <Link
              href="/impact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest-700 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-forest-700/20 transition-all duration-300 hover-forest-800 hover-xl hover-forest-700/25 hover:-translate-y-0.5"
            >
              {t("pages.contact.cta.button")}
              <Heart className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}



