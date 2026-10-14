import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envText = fs.readFileSync('.env.local', 'utf8');
const get = (k) => {
  const line = envText.split('\n').find((l) => l.startsWith(k + '='));
  if (!line) return null;
  return line.slice(k.length + 1).replace(/^["']|["']$/g, '');
};

const url = get('NEXT_PUBLIC_SUPABASE_URL');
const keys = [
  get('SUPABASE_SECRET_KEY'),
  get('SUPABASE_SERVICE_ROLE_KEY'),
  get('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
];

for (const key of keys) {
  if (!key) continue;
  console.log('\n--- trying key prefix:', key.slice(0, 20), '---');
  const sb = createClient(url, key);
  const id = 'dddddddd-dddd-4ddd-8ddd-dddddddddddd';
  const slug = 'proof-of-work-and-block-rewards';

  const { data: byId, error: e1 } = await sb
    .from('assignments')
    .select('id,title,chapter_slug,status,created_at')
    .eq('id', id);
  console.log('BY_ID err:', e1?.message || 'none', 'rows:', byId?.length ?? 0);

  const { data: bySlug, error: e2 } = await sb
    .from('assignments')
    .select('id,title,chapter_slug,status,created_at')
    .eq('chapter_slug', slug);
  console.log('BY_SLUG err:', e2?.message || 'none', 'rows:', bySlug?.length ?? 0, bySlug);

  if (e1?.message?.includes('disabled') || e2?.message?.includes('disabled')) continue;

  const ids = [...new Set([...(byId || []), ...(bySlug || [])].map((a) => a.id))];
  if (ids.length) {
    const { data: subs, error: e3 } = await sb
      .from('assignment_submissions')
      .select('id,assignment_id,student_id,status,submitted_at')
      .in('assignment_id', ids)
      .order('submitted_at', { ascending: false })
      .limit(10);
    console.log('SUBMISSIONS err:', e3?.message || 'none', 'count:', subs?.length ?? 0);
    console.log(JSON.stringify(subs, null, 2));
  }

  // Test maybeSingle duplicate issue
  const { data: orSingle, error: orErr } = await sb
    .from('assignments')
    .select('id')
    .or(`id.eq.${id},chapter_slug.eq.${slug}`)
    .eq('status', 'active')
    .maybeSingle();
  console.log('OR maybeSingle err:', orErr?.message || 'none', 'data:', orSingle);

  break;
}
