"use client";

import { ContactForm } from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold">Contact</h1>
        <p className="text-sm text-forest-900/65">Have a question or want to learn more? Send us a message.</p>
      </section>

      <section>
        <ContactForm />
      </section>
    </div>
  );
}
