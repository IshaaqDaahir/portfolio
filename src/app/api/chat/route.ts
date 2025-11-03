import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { auth } from '@/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await pool.query(
      'SELECT sender, content, created_at FROM chat_messages WHERE user_id = $1 ORDER BY created_at ASC',
      [session.user.id]
    );

    const messages = result.rows.map(row => ({
      sender: row.sender,
      name: row.sender === 'user' ? session.user.name : 'Isiya Dahiru',
      avatar: row.sender === 'user' ? session.user.image || '/avatar-user.svg' : '/avatar-me.svg',
      content: row.content,
      time: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    return NextResponse.json({ messages });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { message } = body;
    
    if (!message?.content) {
      return NextResponse.json({ error: 'Missing message content' }, { status: 400 });
    }

    await pool.query(
      'INSERT INTO chat_messages (user_id, sender, content) VALUES ($1, $2, $3)',
      [session.user.id, 'user', message.content]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
