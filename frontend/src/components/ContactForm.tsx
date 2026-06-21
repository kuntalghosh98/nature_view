"use client";

import { FormEvent, useState } from "react";
import { apiRequest } from "@/lib/api";
import type { ContactSubmission } from "@/types/contact";

export function ContactForm() {
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
        body: JSON.stringify(payload)
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 rounded-3xl border border-forest-900/10 bg-white p-6 shadow-sm">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Contact us</h2>
        <p className="text-sm text-forest-900/65">Send a message and we’ll get back to you soon.</p>
      </div>

      {success ? <p className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">Your message has been submitted.</p> : null}
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">{error}</p> : null}

      <input
        placeholder="Name"
        className="rounded-lg border px-3 py-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="rounded-lg border px-3 py-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        placeholder="Phone"
        className="rounded-lg border px-3 py-2"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <textarea
        placeholder="Message"
        className="min-h-[140px] rounded-lg border px-3 py-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        required
      />

      <button type="submit" className="rounded-lg bg-forest-700 px-4 py-3 text-sm font-semibold text-white" disabled={saving}>
        {saving ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
