'use client';
import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setSent(true);
      setForm({ name: '', email: '', message: '' });
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center h-[300px]">
        <div className="w-16 h-16 rounded-full bg-[var(--accent-cyan)]/10 flex items-center justify-center mb-6">
          <CheckCircle2 size={32} className="text-[var(--accent-cyan)]" />
        </div>
        <h3 className="text-xl font-display font-bold text-white mb-2">Transmisión Exitosa</h3>
        <p className="text-gray-400 font-light text-sm max-w-[250px]">
          Mensaje recibido en el centro de control. Te contactaré en breve.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Nombre</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--accent-cyan)] focus:bg-white/[0.05] transition-all"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--accent-cyan)] focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Mensaje</label>
        <textarea
          placeholder="Cuéntame sobre tu proyecto..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={4}
          className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-[var(--accent-cyan)] focus:bg-white/[0.05] transition-all resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold rounded-xl px-6 py-3.5 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={16} />
        {sending ? 'Transmitiendo...' : 'Enviar Señal'}
      </button>
    </form>
  );
}
