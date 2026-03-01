import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    setLoading(true);
    // Simulate submission (will be replaced with Supabase later)
    setTimeout(() => {
      toast.success("Message sent! We'll get back to you soon.");
      setForm({ name: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">Get In Touch</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-10">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <InfoRow icon={<Phone size={18} />} label="Phone" value="+91 98765 43210" />
              <InfoRow icon={<Mail size={18} />} label="Email" value="info@grtjewellery.com" />
              <InfoRow icon={<MapPin size={18} />} label="Address" value="T. Nagar, Chennai, Tamil Nadu 600017" />
            </div>
            <div className="bg-secondary rounded-xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-2">Store Hours</h3>
              <div className="text-sm text-muted-foreground font-body space-y-1">
                <p>Mon – Sat: 10:00 AM – 9:00 PM</p>
                <p>Sunday: 10:00 AM – 8:00 PM</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="md:col-span-3 bg-card border border-border rounded-xl p-6 space-y-4">
            <Input label="Full Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Email *" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
            <div>
              <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1 block">Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-primary-foreground py-3 rounded-lg font-body font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Send size={16} /> {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const Input = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <label className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1 block">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-ring"
    />
  </div>
);

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-primary mt-0.5">{icon}</span>
    <div>
      <p className="text-xs text-muted-foreground font-body">{label}</p>
      <p className="text-sm font-body text-foreground">{value}</p>
    </div>
  </div>
);

export default Contact;
