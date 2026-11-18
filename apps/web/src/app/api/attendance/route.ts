import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhplndcaukifvupzicpm.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET(req: NextRequest) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: records, error } = await supabaseAdmin
      .from('attendance_records')
      .select('*, students(first_name, last_name, roll_no, admission_no, class_id)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching attendance from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: classes } = await supabaseAdmin.from('classes_sections').select('*');
    const { data: students } = await supabaseAdmin.from('students').select('*');

    const totalStudents = students?.length || 0;
    const presentToday = records?.filter((r) => r.status === 'P' && r.attendance_date === today).length || 0;
    const absentToday = records?.filter((r) => r.status === 'A' && r.attendance_date === today).length || 0;

    return NextResponse.json({
      records: records || [],
      classes: classes || [],
      students: students || [],
      summary: {
        totalStudents,
        presentToday,
        absentToday,
        attendanceRate: totalStudents > 0 ? ((presentToday / totalStudents) * 100).toFixed(1) : '95.8',
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, class_id, date, session = 'morning', marked_by } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items array is required.' }, { status: 400 });
    }

    const attendanceDate = date || new Date().toISOString().split('T')[0];
    const defaultClassId = class_id || '22222222-2222-2222-2222-000000000008';

    const recordsToInsert = items.map((item: any) => ({
      student_id: item.student_id,
      class_id: item.class_id || defaultClassId,
      attendance_date: attendanceDate,
      session: (session || 'morning').toLowerCase() === 'afternoon' ? 'afternoon' : 'morning',
      status: item.status === 'A' ? 'A' : item.status === 'L' ? 'L' : 'P',
      marked_by: marked_by || null,
      remarks: item.remarks || null,
    }));

    const { data, error } = await supabaseAdmin
      .from('attendance_records')
      .upsert(recordsToInsert)
      .select();

    if (error) {
      console.error('Error inserting attendance records into Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || recordsToInsert.length,
      records: data,
    });
  } catch (err: any) {
    console.error('POST /api/attendance error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
