import { NextResponse } from 'next/server';
import { firestore } from '@/firebase/server';

export async function GET() {
  try {
    const logsSnapshot = await firestore
        .collection('Logs')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();
    const logs = logsSnapshot.docs.map(d => ({id: d.id, ...d.data()}));
    return NextResponse.json(logs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
