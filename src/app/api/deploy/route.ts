import { NextResponse } from 'next/server';
import { exec } from 'child_process';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const commitMsg = message || `Update portfolio — ${new Date().toLocaleDateString('es')}`;

    const result = await new Promise<{ success: boolean; output: string; error?: string }>((resolve) => {
      const cwd = process.cwd();
      const cmd = `cd "${cwd}" && git add -A && git commit -m "${commitMsg}" && git push origin main`;

      exec(cmd, { timeout: 30000 }, (error, stdout, stderr) => {
        if (error) {
          // Check if it's just "nothing to commit"
          if (stderr.includes('nothing to commit') || stdout.includes('nothing to commit')) {
            resolve({ success: true, output: 'No hay cambios para publicar. Todo está actualizado.' });
          } else {
            resolve({ success: false, output: stdout, error: stderr || error.message });
          }
        } else {
          resolve({ success: true, output: stdout || 'Deploy exitoso ✓' });
        }
      });
    });

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: 'Error ejecutando deploy: ' + (e instanceof Error ? e.message : 'Unknown') },
      { status: 500 }
    );
  }
}
