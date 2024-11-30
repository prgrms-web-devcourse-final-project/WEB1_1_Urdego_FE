import axiosInstance from '@/lib/axios';
import { NextRequest, NextResponse } from 'next/server';

const PORT = 8082;
const CONTENT_POST_URL = '/api/content-service/contents/multiple';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const params = request.nextUrl.searchParams;

  try {
    const res = await axiosInstance.post(
      `${axiosInstance.defaults.baseURL}:${PORT}${CONTENT_POST_URL}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        params: Object.fromEntries(params),
      }
    );
    return NextResponse.json(res.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
