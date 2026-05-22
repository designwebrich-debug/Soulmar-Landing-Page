import { NextResponse } from 'next/server'
// import { supabaseAdmin } from '@/lib/supabase/server' // Commented for Mock Mode

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { therapistId, sessionType, date, user } = body

    // ==========================================
    // MOCK SYSTEM SIMULATOR ENABLED
    // ==========================================
    console.log("[MOCK SYSTEM] Processing Checkout for:", user.email, sessionType)

    // 1. For free 15 min evaluation
    if (sessionType === 'evaluation_15min') {
      // Mock Anti-Fraud: Assume anyone with 'test@fail.com' already used it
      if (user.email === 'test@fail.com') {
        return NextResponse.json({ 
          error: 'SIMULADOR: El usuario ya ha utilizado su llamada de valoración gratuita.' 
        }, { status: 400 })
      }

      // Automatically trigger GOOGLE-BRIDGE mock
      return NextResponse.json({ success: true, appointment: { id: "mock-123" } })
    }

    // 2. For paid full session (Mercado Pago Simulator Logic)
    if (sessionType === 'full_session') {
      
      const mockTherapistFee = 180000; // Static mock fee

      // Return a Mock Init Point pointing to our local simulator
      const mockInitPoint = `/book/mock-payment?amount=${mockTherapistFee}&email=${encodeURIComponent(user.email)}&therapist=${therapistId}`

      return NextResponse.json({ init_point: mockInitPoint, preferenceId: "mock-pref-999" })
    }

    return NextResponse.json({ error: 'Invalid session type' }, { status: 400 })

  } catch (error: any) {
    console.error('Checkout Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
