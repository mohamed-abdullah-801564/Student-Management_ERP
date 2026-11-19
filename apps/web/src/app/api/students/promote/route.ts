import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhplndcaukifvupzicpm.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });
}

// --------------------------------------------------------------------------
// POST /api/students/promote - Execute batch promotion in Supabase
// --------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  try {
    const supabase = getAdminClient();
    const body = await req.json();

    const {
      studentIds,
      targetBatch = 'Class 9-B',
      sourceBatch = 'Class 8-B',
      academicYear = '2027-2028',
      action = 'promote', // 'promote' | 'tc_issued' | 'retain'
    } = body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json(
        { error: 'No student IDs provided for batch promotion.' },
        { status: 400 }
      );
    }

    if (action === 'promote') {
      // Update stream/class and increment academic year
      const { data, error } = await supabase
        .from('students')
        .update({
          stream: targetBatch,
          status: 'Active',
        })
        .in('id', studentIds)
        .select('id, admission_no, first_name, last_name, stream');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        promotedCount: studentIds.length,
        targetBatch,
        academicYear,
        updatedStudents: data,
      });
    } else if (action === 'tc_issued') {
      // Mark as TC Issued / Withdrawn
      const { data, error } = await supabase
        .from('students')
        .update({
          status: 'TC_Issued',
        })
        .in('id', studentIds)
        .select('id, admission_no, first_name, last_name, status');

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        withdrawnCount: studentIds.length,
        status: 'TC_Issued',
        updatedStudents: data,
      });
    }

    return NextResponse.json({ success: true, processed: studentIds.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
