import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const commune = searchParams.get('commune');

  if (!commune) {
    return NextResponse.json({ error: 'Commune ID is required' }, { status: 400 });
  }

  const BASE_URL = process.env.NEXT_PUBLIC_MAYSTRO_BASE_URL;
  const MAYSTRO_API_SECRET = process.env.MAYSTRO_API_SECRET;

  if (!BASE_URL || !MAYSTRO_API_SECRET) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const res = await fetch(`${BASE_URL}/base/delivery-options/?commune=${commune}`, {
      headers: {
        Authorization: `token ${MAYSTRO_API_SECRET}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch delivery options from Maystro' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Delivery options proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
