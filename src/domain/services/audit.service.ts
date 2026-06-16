import { sql } from '@/lib/db';

export class AuditService {
  static async log(action: string, target: string, detail?: string) {
    try {
      if (!sql) return;
      await sql`
        INSERT INTO app_data (key, value, updated_at)
        VALUES (
          ${'audit_' + Date.now()},
          ${JSON.stringify({ action, target, detail, timestamp: new Date().toISOString() })},
          CURRENT_TIMESTAMP
        )
        ON CONFLICT (key) DO NOTHING
      `;
    } catch {
      // Audit logging is best-effort; don't break the caller
    }
  }
}
