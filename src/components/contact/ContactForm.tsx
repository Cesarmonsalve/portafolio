'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

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
      <div className="text-center py-6">
        <p className="text-neon-red font-bold text-sm">¡Mensaje enviado!</p>
        <p className="text-gray-500 text-xs mt-1">Te responderé pronto.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Tu nombre"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
        className="admin-input"
      />
      <input
        type="email"
        placeholder="Tu email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="admin-input"
      />
      <textarea
        placeholder="Tu mensaje..."
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        required
        rows={4}
        className="admin-input resize-none"
      />
      <button
        type="submit"
        disabled={sending}
        className="acid-button w-full !py-3 disabled:opacity-60"
      >
        <Send size={14} />
        {sending ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
