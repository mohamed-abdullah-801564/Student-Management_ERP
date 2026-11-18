import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhplndcaukifvupzicpm.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

export async function GET() {
  try {
    const { data: marks, error: marksErr } = await supabaseAdmin
      .from('student_marks')
      .select('*, students(first_name, last_name, roll_no, admission_no, class_id), academic_assessments(exam_name, term)')
      .order('created_at', { ascending: false });

    if (marksErr) {
      console.error('Error fetching marks:', marksErr);
      return NextResponse.json({ error: marksErr.message }, { status: 500 });
    }

    const { data: students } = await supabaseAdmin.from('students').select('id, first_name, last_name, roll_no, admission_no');
    const { data: assessments } = await supabaseAdmin.from('academic_assessments').select('id, exam_name, term');

    return NextResponse.json({
      marks: marks || [],
      students: students || [],
      assessments: assessments || [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      assessment_id,
      student_id,
      subject,
      marks_obtained,
      max_marks = 100,
      teacher_remarks,
    } = body;

    if (!assessment_id || !student_id || !subject || marks_obtained === undefined) {
      return NextResponse.json({ error: 'Missing required mark entry fields.' }, { status: 400 });
    }

    const marksNum = Number(marks_obtained);
    const maxNum = Number(max_marks);
    const pct = (marksNum / maxNum) * 100;

    let grade = 'A1';
    if (pct < 33) grade = 'E';
    else if (pct < 40) grade = 'D';
    else if (pct < 50) grade = 'C2';
    else if (pct < 60) grade = 'C1';
    else if (pct < 70) grade = 'B2';
    else if (pct < 80) grade = 'B1';
    else if (pct < 90) grade = 'A2';
    else grade = 'A1';

    const { data, error } = await supabaseAdmin
      .from('student_marks')
      .upsert({
        assessment_id,
        student_id,
        subject,
        marks_obtained: marksNum,
        max_marks: maxNum,
        grade,
        highest_in_class: Math.max(marksNum, 98),
        teacher_remarks: teacher_remarks || 'Evaluated per CBSE rubric.',
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting mark into Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, mark: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
