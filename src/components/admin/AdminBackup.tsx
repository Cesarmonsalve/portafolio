'use client';

import { useMemo, useState } from 'react';
import { Download, Upload, ShieldCheck, Database, RotateCcw, AlertTriangle } from 'lucide-react';
import { saveConfigData } from '@/lib/SiteConfigContext';
import { toast } from '@/components/ui/Toast';

const DATA_KEYS = [
  'cm_site_config',
  'cm_projects',
  'cm_skills',
  'cm_socials',
  'cm_store_items',
  'cm_messages',
  'cm_audit_logs',
];

type BackupPayload = {
  version: string;
  exported_at: string;
  source: 'cm-design-admin';
  data: Record<string, unknown>;
};

export default function AdminBackup(_props: { onUnreadChange?: (n: number) => void; setActiveTab?: (tab: string) => void }) {
  const [preview, setPreview] = useState<BackupPayload | null>(null);
  const [importing, setImporting] = useState(false);

  const checklist = useMemo(() => ([
    {
      label: 'Contraseña privada en servidor',
      detail: 'El acceso admin ahora usa /api/auth + cookie httpOnly; no depende de NEXT_PUBLIC_ADMIN_PASS.',
      ok: true,
    },
    {
      label: 'Datos persistentes',
      detail: 'Cuando DATABASE_URI existe, /api/data guarda en Neon. Si no, el panel conserva fallback local.',
      ok: true,
    },
    {
      label: 'Respaldo descargable',
      detail: 'Puedes exportar proyectos, configuración, tienda, skills, redes y mensajes en un JSON.',
      ok: true,
    },
    {
      label: 'Importación controlada',
      detail: 'El importador valida estructura básica antes de sobrescribir datos.',
      ok: true,
    },
  ]), []);

  const collectLocalData = () => {
    const data: Record<string, unknown> = {};
    for (const key of DATA_KEYS) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw;
      }
    }
    return data;
  };

  const exportBackup = async () => {
    let data = collectLocalData();

    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) data = { ...data, ...json.data };
      }
    } catch {
      // Local fallback is still valid.
    }

    const payload: BackupPayload = {
      version: '3.0.0',
      exported_at: new Date().toISOString(),
      source: 'cm-design-admin',
      data,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `cm-design-backup-${stamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Respaldo descargado correctamente', 'success');
  };

  const readImportFile = async (file: File) => {
    const text = await file.text();
    const parsed = JSON.parse(text) as BackupPayload;
    if (!parsed || parsed.source !== 'cm-design-admin' || typeof parsed.data !== 'object') {
      throw new Error('El archivo no parece ser un respaldo válido de CM Design.');
    }
    setPreview(parsed);
  };

  const applyImport = async () => {
    if (!preview) return;
    setImporting(true);

    try {
      for (const key of DATA_KEYS) {
        if (preview.data[key] !== undefined) {
          await saveConfigData(key, preview.data[key]);
        }
      }
      toast('Respaldo importado correctamente', 'success');
      setPreview(null);
    } catch {
      toast('No fue posible importar todo el respaldo', 'error');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="h-px w-10 bg-neon-red" />
            <span className="acid-kicker">Admin // Seguridad</span>
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">Respaldo y salud del sistema</h1>
          <p className="mt-1 text-sm text-gray-500">Exporta, importa y revisa puntos críticos del panel.</p>
        </div>
        <button onClick={exportBackup} className="acid-button !py-2.5">
          <Download size={15} /> Descargar respaldo
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="admin-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-white">
            <ShieldCheck size={16} className="text-neon-red" /> Checklist técnico
          </h2>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.label} className="border border-white/[0.08] bg-white/[0.02] p-4 angle-frame-sm">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="h-2 w-2 bg-neon-red shadow-[0_0_14px_rgba(203,254,28,.65)]" />
                  {item.label}
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[.18em] text-white">
            <Database size={16} className="text-neon-red" /> Importar respaldo
          </h2>
          <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center border border-dashed border-neon-red/30 bg-neon-red/[0.035] p-8 text-center transition hover:border-neon-red/70 angle-frame">
            <Upload size={30} className="mb-3 text-neon-red" />
            <span className="text-sm font-black uppercase tracking-[.14em] text-white">Seleccionar JSON</span>
            <span className="mt-2 max-w-md text-xs leading-5 text-gray-500">
              Usa esta opción para restaurar proyectos, tienda, mensajes, redes y configuración general.
            </span>
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                readImportFile(file).catch((error) => toast(error.message || 'Archivo inválido', 'error'));
                event.currentTarget.value = '';
              }}
            />
          </label>

          {preview && (
            <div className="mt-5 border border-yellow-400/25 bg-yellow-400/[0.06] p-4 angle-frame-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="mt-0.5 text-yellow-300" />
                <div>
                  <p className="text-sm font-bold text-white">Respaldo detectado: {new Date(preview.exported_at).toLocaleString('es')}</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Se reemplazarán los datos actuales para las claves encontradas en el archivo.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button onClick={applyImport} disabled={importing} className="acid-button !py-2">
                      <RotateCcw size={14} /> {importing ? 'Importando...' : 'Aplicar importación'}
                    </button>
                    <button onClick={() => setPreview(null)} className="ghost-button !py-2">Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
