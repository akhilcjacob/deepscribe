import { NextResponse } from 'next/server';

export function apiError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export function apiSuccess<T>(data: T) {
  return NextResponse.json({ success: true, data });
}

export function validateTranscript(transcript: unknown): string {
  if (!transcript || typeof transcript !== 'string') {
    throw new Error('Transcript is required');
  }
  
  if (transcript.length < 10) {
    throw new Error('Transcript too short (minimum 10 characters)');
  }
  
  if (transcript.length > 8000000) { // ~2M tokens * 4 chars = 8M chars max
    throw new Error('Transcript too long (maximum 8M characters)');
  }
  
  return transcript.trim();
}