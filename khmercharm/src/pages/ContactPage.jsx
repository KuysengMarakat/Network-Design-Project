import { useState } from "react";
import { MapPin, Mail, Phone, Send, ChevronDown, Clock, MessageSquare } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import { useToast } from "../context/ToastContext";
import { faqs } from "../data/sampleData";

export default function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const f = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 600);
  };

  const inp = "w-full px-3 py-2.5 bg-ivory border border-gold-200 rounded-xl text-sm text-brown-900 placeholder:text-brown-300 focus:border-gold-400 focus:outline-none focus:bg-white transition-colors";

  return (
    <>
      <PageHeader title="Get in Touch" subtitle="Questions, custom orders, partnerships — we'd love to hear from you" breadcrumbs={[{ label: "Contact" }]} />

      <section className="py-10 px-4 sm:px-6 lg:px-8 bg-ivory">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_360px] gap-6">

          {/* Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gold-100 shadow-sm">
            <h2 className="font-display text-2xl font-bold text-brown-900 mb-1">Send us a message</h2>
            <p className="text-sm text-brown-500 mb-6">We typically reply within a few hours during business hours.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Your Name *">
                  <input className={inp} value={form.name} onChange={f("name")} required placeholder="Sreynich Mao" />
                </Field>
                <Field label="Email *">
                  <input className={inp} type="email" value={form.email} onChange={f("email")} required placeholder="your@email.com" />
                </Field>
              </div>
              <Field label="Subject *">
                <select className={inp} value={form.subject} onChange={f("subject")} required>
                  <option value="">Select a topic…</option>
                  <option>Order Question</option>
                  <option>Custom Order Request</option>
                  <option>Wholesale / Partnership</option>
                  <option>Product Question</option>
                  <option>Press / Collaboration</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Message *">
                <textarea className={`${inp} resize-none`} rows={6} value={form.message} onChange={f("message")} required placeholder="Tell us how we can help…" />
              </Field>
              <button type="submit" disabled={submitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 disabled:opacity-60 text-white font-semibold rounded-xl shadow-md transition-all">
                <Send className="w-4 h-4" /> {submitting ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          {/* Info sidebar */}
          <aside className="space-y-3">
            <div className="bg-white rounded-2xl p-5 border border-gold-100 shadow-sm space-y-4">
              <h3 className="font-display font-bold text-brown-900">Visit our store</h3>
              <ul className="space-y-3 text-sm">
                <InfoLine Icon={MapPin}      label="Phnom Penh, Cambodia" sub="Daun Penh District" />
                <InfoLine Icon={Mail}        label="support@khmercharm.com" />
                <InfoLine Icon={Phone}       label="+855 12 345 678" sub="Mon–Sat, 8 AM – 8 PM" />
                <InfoLine Icon={Clock}       label="Sunday: 9 AM – 6 PM" />
                <InfoLine Icon={MessageSquare} label="Live chat on Telegram" sub="@khmercharm" />
              </ul>
            </div>
            <div className="bg-gradient-to-br from-gold-50 to-clay-50 rounded-2xl p-5 border border-gold-100">
              <p className="text-xs font-bold text-gold-700 uppercase tracking-wide mb-2">Quick tip</p>
              <p className="text-sm text-brown-700 leading-relaxed">
                For urgent order questions, message us on Telegram for the fastest reply.
              </p>
            </div>
          </aside>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-ivory-dark silk-texture">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-gold-600 text-sm font-semibold uppercase tracking-widest">Frequently Asked</span>
            <h2 className="font-display text-3xl font-bold text-brown-900">FAQ</h2>
            <p className="text-brown-500">Quick answers to common questions.</p>
          </div>
          <div className="bg-white rounded-2xl border border-gold-100 shadow-sm overflow-hidden">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gold-100 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gold-50/50 transition-colors"
                >
                  <span className="font-semibold text-brown-900 pr-4">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-brown-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-4 text-sm text-brown-600 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-brown-700 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}
function InfoLine({ Icon, label, sub }) {
  return (
    <li className="flex items-start gap-3 text-brown-700">
      <Icon className="w-4 h-4 text-gold-600 mt-0.5 flex-shrink-0" />
      <div>
        <div className="font-medium">{label}</div>
        {sub && <div className="text-xs text-brown-400">{sub}</div>}
      </div>
    </li>
  );
}
