import { NextRequest, NextResponse } from 'next/server';
import { extractPatientData } from '@/lib/gemini';
import { searchClinicalTrials } from '@/lib/clinical-trials';
import type { AnalyzeRequest, AnalyzeResponse, AnalyzeErrorResponse } from '@/models';

export async function POST(request: NextRequest) {
  try {
    const { transcript } = await request.json();

    if (!transcript || typeof transcript !== 'string') {
      return NextResponse.json(
        { error: 'Transcript is required and must be a string' },
        { status: 400 }
      );
    }

    const patientData = await extractPatientData(transcript);
    const trials = await searchClinicalTrials(patientData);

    return NextResponse.json({
      success: true,
      data: {
        patientData,
        trials
      }
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze transcript',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
