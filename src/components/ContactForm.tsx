"use client";

import { FormEvent, useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2, User, Mail, Phone, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/api";
import type { ContactSubmission } from "@/types/contact";
import { useLocale } from "@/providers/LocaleProvider";

export function ContactForm() {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const payload: Partial<ContactSubmission> = { name, email, phone, message };
      await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("contactForm.error"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm lg:p-10"
    >
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-forest-600 via-forest-500 to-accent-500" />

      {/* Form header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-forest-900 font-display">
          {t("contactForm.title")}
        </h2>
        <p className="mt-2 text-sm text-forest-900/60 leading-relaxed">
          {t("contactForm.subtitle")}
        </p>
      </div>

      {/* Success / Error messages */}
      <>
        {success && (
          <div
            className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                {t("contactForm.success")}
              </p>
              <p className="mt-0.5 text-xs text-emerald-700/70">
                {t("contactForm.subtitle")}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
            <p className="text-sm font-medium text-rose-800">{error}</p>
          </div>
        )}
      </>

      {/* Form fields */}
      <div className="space-y-5">
        {/* Name */}
        <div className="group">
          <label className="mb-1.5 block text-sm font-medium text-forest-900">
            {t("contactForm.fields.name")}
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-900/30 transition-colors group-focus-within:text-forest-600" />
            <input
              placeholder={t("contactForm.fields.name")}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-12 pr-4 text-sm text-forest-900 placeholder:text-forest-900/30 transition-all duration-300 focus:border-forest-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-forest-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="group">
          <label className="mb-1.5 block text-sm font-medium text-forest-900">
            {t("contactForm.fields.email")}
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-900/30 transition-colors group-focus-within:text-forest-600" />
            <input
              type="email"
              placeholder={t("contactForm.fields.email")}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-12 pr-4 text-sm text-forest-900 placeholder:text-forest-900/30 transition-all duration-300 focus:border-forest-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-forest-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Phone */}
        <div className="group">
          <label className="mb-1.5 block text-sm font-medium text-forest-900">
            {t("contactForm.fields.phone")}
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-forest-900/30 transition-colors group-focus-within:text-forest-600" />
            <input
              placeholder={t("contactForm.fields.phone")}
              className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-12 pr-4 text-sm text-forest-900 placeholder:text-forest-900/30 transition-all duration-300 focus:border-forest-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-forest-100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Message */}
        <div className="group">
          <label className="mb-1.5 block text-sm font-medium text-forest-900">
            {t("contactForm.fields.message")}
          </label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-forest-900/30 transition-colors group-focus-within:text-forest-600" />
            <textarea
              placeholder={t("contactForm.fields.message")}
              className="min-h-[140px] w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-3 pl-12 pr-4 text-sm text-forest-900 placeholder:text-forest-900/30 transition-all duration-300 focus:border-forest-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-forest-100 resize-none"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={saving}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-forest-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-forest-700/20 transition-all duration-300 hover:bg-forest-800 hover:shadow-xl hover:shadow-forest-700/25 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {t("contactForm.submitting")}
            </>
          ) : (
            <>
              {t("contactForm.submit")}
              <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}


