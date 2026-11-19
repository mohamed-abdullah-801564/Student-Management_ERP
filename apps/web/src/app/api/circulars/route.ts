import { NextRequest, NextResponse } from 'next/server';

export interface CircularItem {
  id: string;
  memoNo: string;
  title: string;
  audience: 'all' | 'parents' | 'teachers';
  priority: 'normal' | 'urgent';
  content: string;
  attachmentUrl?: string;
  attachmentName?: string;
  author: string;
  created_at: string;
}

// In-memory persistent registry for active session broadcasts
let circularsRegistry: CircularItem[] = [
  {
    id: 'cir-1',
    memoNo: 'CIR-2026-NOV-088',
    title: 'Annual Athletic Meet & Sports Day 2026 Schedule',
    audience: 'all',
    priority: 'normal',
    content:
      'Dear Parents, Guardians and Faculty, We are delighted to announce our Annual Athletic Meet & Sports Day 2026 scheduled for Friday, 28th November at the Senior Campus Athletics Ground. Students must report in House Uniforms by 07:30 AM sharp.',
    attachmentUrl:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
    attachmentName: 'Sports_Day_Schedule_Map.jpg',
    author: 'Dr. K. Arumugam, Principal',
    created_at: '2026-11-16T08:30:00.000Z',
  },
  {
    id: 'cir-2',
    memoNo: 'CIR-2026-NOV-082',
    title: 'CBSE Pre-Board Moderation & Practical Evaluation Guidelines',
    audience: 'teachers',
    priority: 'normal',
    content:
      'Faculty moderation meeting scheduled for 3:30 PM in AV Room 2. Subject teachers must finalize Term 1 practical assessments by Friday.',
    author: 'Academic Council',
    created_at: '2026-11-14T09:15:00.000Z',
  },
  {
    id: 'cir-3',
    memoNo: 'CIR-2026-NOV-079',
    title: 'Advisory: Winter Uniform Transition & Morning Assembly Timings',
    audience: 'parents',
    priority: 'urgent',
    content:
      'All students are requested to wear full winter blazers / cardigans from Monday. Morning roll call assembly timings adjusted to 8:45 AM due to seasonal morning fog.',
    attachmentUrl:
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    attachmentName: 'Winter_Uniform_Advisory.jpg',
    author: 'Principal Office',
    created_at: '2026-11-12T07:45:00.000Z',
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audience = searchParams.get('audience');

  let filtered = circularsRegistry;
  if (audience === 'parents') {
    filtered = circularsRegistry.filter((c) => c.audience === 'all' || c.audience === 'parents');
  } else if (audience === 'teachers') {
    filtered = circularsRegistry.filter((c) => c.audience === 'all' || c.audience === 'teachers');
  }

  return NextResponse.json({ circulars: filtered });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, audience, priority = 'normal', content, attachmentUrl, attachmentName } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }

    const memoIndex = String(circularsRegistry.length + 80).padStart(3, '0');
    const newCircular: CircularItem = {
      id: `cir-${Date.now()}`,
      memoNo: `CIR-2026-NOV-${memoIndex}`,
      title: title.trim(),
      audience: (audience as any) || 'all',
      priority: priority === 'urgent' ? 'urgent' : 'normal',
      content: content.trim(),
      attachmentUrl,
      attachmentName,
      author: 'Dr. K. Arumugam, Principal',
      created_at: new Date().toISOString(),
    };

    circularsRegistry = [newCircular, ...circularsRegistry];

    return NextResponse.json({ success: true, circular: newCircular });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
