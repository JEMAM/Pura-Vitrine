import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ENV_FILE_PATH = path.join(process.cwd(), '.env.local');

export async function GET() {
  try {
    let envContent = '';
    if (fs.existsSync(ENV_FILE_PATH)) {
      envContent = fs.readFileSync(ENV_FILE_PATH, 'utf-8');
    }

    const parseEnv = (key: string): string => {
      const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (!match) return process.env[key] || '';
      return match[1].replace(/^["']|["']$/g, '').trim();
    };

    const gemini = parseEnv('GEMINI_API_KEY');
    const metaAppId = parseEnv('META_APP_ID');
    const metaAppSecret = parseEnv('META_APP_SECRET');
    const instagramAccountId = parseEnv('INSTAGRAM_ACCOUNT_ID');
    const instagramAccessToken = parseEnv('INSTAGRAM_ACCESS_TOKEN');
    const facebookPageId = parseEnv('FACEBOOK_PAGE_ID');
    const facebookPageAccessToken = parseEnv('FACEBOOK_PAGE_ACCESS_TOKEN');

    const mask = (val: string) => {
      if (!val) return '';
      if (val.length <= 8) return '••••••••';
      return `${val.slice(0, 6)}••••••••${val.slice(-4)}`;
    };

    return NextResponse.json({
      success: true,
      keys: {
        GEMINI_API_KEY: {
          isConfigured: !!gemini,
          preview: mask(gemini),
          rawValue: gemini,
        },
        META_APP_ID: {
          isConfigured: !!metaAppId,
          value: metaAppId,
        },
        META_APP_SECRET: {
          isConfigured: !!metaAppSecret,
          preview: mask(metaAppSecret),
          rawValue: metaAppSecret,
        },
        INSTAGRAM_ACCOUNT_ID: {
          isConfigured: !!instagramAccountId,
          value: instagramAccountId,
        },
        INSTAGRAM_ACCESS_TOKEN: {
          isConfigured: !!instagramAccessToken,
          preview: mask(instagramAccessToken),
          rawValue: instagramAccessToken,
        },
        FACEBOOK_PAGE_ID: {
          isConfigured: !!facebookPageId,
          value: facebookPageId,
        },
        FACEBOOK_PAGE_ACCESS_TOKEN: {
          isConfigured: !!facebookPageAccessToken,
          preview: mask(facebookPageAccessToken),
          rawValue: facebookPageAccessToken,
        },
      },
    });
  } catch (error) {
    console.error('Error reading env keys:', error);
    return NextResponse.json({ error: 'Erro ao ler variáveis de ambiente' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let currentContent = '';
    if (fs.existsSync(ENV_FILE_PATH)) {
      currentContent = fs.readFileSync(ENV_FILE_PATH, 'utf-8');
    }

    const updates: Record<string, string> = {};
    if (body.GEMINI_API_KEY !== undefined) updates['GEMINI_API_KEY'] = body.GEMINI_API_KEY;
    if (body.META_APP_ID !== undefined) updates['META_APP_ID'] = body.META_APP_ID;
    if (body.META_APP_SECRET !== undefined) updates['META_APP_SECRET'] = body.META_APP_SECRET;
    if (body.INSTAGRAM_ACCOUNT_ID !== undefined) updates['INSTAGRAM_ACCOUNT_ID'] = body.INSTAGRAM_ACCOUNT_ID;
    if (body.INSTAGRAM_ACCESS_TOKEN !== undefined) updates['INSTAGRAM_ACCESS_TOKEN'] = body.INSTAGRAM_ACCESS_TOKEN;
    if (body.FACEBOOK_PAGE_ID !== undefined) updates['FACEBOOK_PAGE_ID'] = body.FACEBOOK_PAGE_ID;
    if (body.FACEBOOK_PAGE_ACCESS_TOKEN !== undefined) updates['FACEBOOK_PAGE_ACCESS_TOKEN'] = body.FACEBOOK_PAGE_ACCESS_TOKEN;

    let lines = currentContent.split('\n');

    for (const [key, value] of Object.entries(updates)) {
      const sanitizedVal = value.trim();
      const regex = new RegExp(`^${key}=.*$`);
      let found = false;

      lines = lines.map((line) => {
        if (regex.test(line)) {
          found = true;
          return `${key}="${sanitizedVal}"`;
        }
        return line;
      });

      if (!found) {
        lines.push(`${key}="${sanitizedVal}"`);
      }

      // Also update running process.env
      process.env[key] = sanitizedVal;
    }

    try {
      fs.writeFileSync(ENV_FILE_PATH, lines.join('\n'), 'utf-8');
      return NextResponse.json({
        success: true,
        message: 'Chaves salvas com sucesso no arquivo .env.local!',
      });
    } catch (fsErr) {
      console.warn('Cannot write to disk (Vercel read-only environment):', fsErr);
      return NextResponse.json({
        success: true,
        message:
          'Chaves atualizadas na sessão ativa! Na Vercel, adicione as variáveis no painel da Vercel (Project Settings > Environment Variables) para persistência permanente.',
      });
    }
  } catch (error) {
    console.error('Error saving env keys:', error);
    return NextResponse.json({ error: 'Erro ao processar chaves' }, { status: 500 });
  }
}
