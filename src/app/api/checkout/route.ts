import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { therapistId, sessionType, date, user } = body

    // 1. Verify User exists or create in Supabase
    // This logic mimics the RPC call or calls it directly via Supabase Admin
    
    // For free 15 min evaluation
    if (sessionType === 'evaluation_15min') {
      const { data, error } = await supabaseAdmin.rpc('book_free_evaluation', {
        p_email: user.email,
        p_full_name: user.name,
        p_phone: user.phone || null,
        p_therapist_id: therapistId,
        p_appointment_date: date
      })

      if (error || (data && !data.success)) {
        return NextResponse.json({ 
          error: data?.message || error?.message || 'Error booking evaluation' 
        }, { status: 400 })
      }

      // Automatically trigger GOOGLE-BRIDGE here later...
      return NextResponse.json({ success: true, appointment: data })
    }

    // For paid full session (Mercado Pago logic)
    if (sessionType === 'full_session') {
      // 1. Fetch Therapist fee from Supabase
      const { data: therapist, error: therapistError } = await supabaseAdmin
        .from('therapists')
        .select('session_fee_cop')
        .eq('id', therapistId)
        .single()

      if (therapistError || !therapist) {
        return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
      }

      // 2. Mercado Pago Preference Creation Payload
      const preferencePayload = {
        items: [
          {
            id: 'full_session',
            title: `Sesión de Terapia - Soulmar`,
            quantity: 1,
            unit_price: therapist.session_fee_cop,
            currency_id: 'COP'
          }
        ],
        payer: {
          email: user.email,
          name: user.name
        },
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/book/success`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/book`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/book`
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`,
        metadata: {
          therapist_id: therapistId,
          appointment_date: date,
          user_email: user.email,
          user_name: user.name
        }
      }

      // 3. Make request to Mercado Pago API
      const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferencePayload)
      })

      const mpData = await mpResponse.json()

      if (!mpResponse.ok) {
        throw new Error(mpData.message || 'Error creating preference')
      }

      // 4. Temporarily hold the appointment in Supabase
      // Assuming user exists or we create it here
      const { data: patient } = await supabaseAdmin
        .from('patients')
        .upsert({ email: user.email, full_name: user.name }, { onConflict: 'email' })
        .select()
        .single()

      if (patient) {
        await supabaseAdmin
          .from('appointments')
          .insert({
            patient_id: patient.id,
            therapist_id: therapistId,
            session_type: 'full_session',
            status: 'temporal_hold',
            appointment_date: date,
            transaction_id: mpData.id // Save preference ID for tracking
          })
      }

      return NextResponse.json({ init_point: mpData.init_point, preferenceId: mpData.id })
    }

    return NextResponse.json({ error: 'Invalid session type' }, { status: 400 })

  } catch (error: any) {
    console.error('Checkout Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
