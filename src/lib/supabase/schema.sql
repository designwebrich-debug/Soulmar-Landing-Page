-- ==============================================================================
-- SOULMAR SILICON VALLEY CORE v2026 - SUPABASE ARCHITECTURE
-- Role: SUPABASE-ARCHITECT & THE FINANCIAL-GUARD
-- Description: DDL script for Therapists, Patients, and Appointments.
-- Includes RLS policies and Trigger/RPC for anti-fraud validation.
-- ==============================================================================

-- 1. Enable UUID extension if not present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- TABLES
-- ==============================================================================

-- Patients Table
CREATE TABLE public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Therapists Table
CREATE TABLE public.therapists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    specialization TEXT NOT NULL,
    biography TEXT,
    session_fee_cop NUMERIC NOT NULL, -- Ej: 150000 para COP
    is_active BOOLEAN DEFAULT true,
    calendar_id TEXT, -- Para sincronización con Google Calendar
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Appointments Table (Booking Core)
CREATE TYPE appointment_status AS ENUM ('temporal_hold', 'confirmed', 'cancelled', 'completed');
CREATE TYPE session_type AS ENUM ('evaluation_15min', 'full_session');

CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    therapist_id UUID REFERENCES public.therapists(id) ON DELETE CASCADE,
    session_type session_type NOT NULL,
    status appointment_status DEFAULT 'temporal_hold' NOT NULL,
    appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
    transaction_id TEXT UNIQUE, -- ID de Mercado Pago
    meet_link TEXT, -- Enlace generado por GOOGLE-BRIDGE
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- SECURITY & ANTI-FRAUD LOGIC (THE FINANCIAL-GUARD)
-- ==============================================================================

-- Trigger to update 'updated_at'
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_appointments_modtime
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();


-- RPC / Function: Validate and Insert 15min Evaluation
-- Prevents a user (by email) from booking more than one free 15min evaluation.
CREATE OR REPLACE FUNCTION book_free_evaluation(
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT,
    p_therapist_id UUID,
    p_appointment_date TIMESTAMP WITH TIME ZONE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_patient_id UUID;
    v_existing_eval_count INT;
    v_appointment_id UUID;
BEGIN
    -- 1. Check or Create Patient
    SELECT id INTO v_patient_id FROM public.patients WHERE email = p_email;
    
    IF v_patient_id IS NULL THEN
        INSERT INTO public.patients (email, full_name, phone)
        VALUES (p_email, p_full_name, p_phone)
        RETURNING id INTO v_patient_id;
    END IF;

    -- 2. Anti-fraud check: Has this patient already booked a free evaluation?
    SELECT COUNT(*) INTO v_existing_eval_count 
    FROM public.appointments 
    WHERE patient_id = v_patient_id 
      AND session_type = 'evaluation_15min'
      AND status != 'cancelled';
      
    IF v_existing_eval_count > 0 THEN
        -- Abort transaction, return error format for the frontend
        RETURN jsonb_build_object(
            'success', false,
            'error_code', 'FREE_EVAL_ALREADY_USED',
            'message', 'El usuario ya ha utilizado su llamada de valoración gratuita.'
        );
    END IF;

    -- 3. Insert Appointment as 'confirmed' since it's free
    INSERT INTO public.appointments (patient_id, therapist_id, session_type, status, appointment_date)
    VALUES (v_patient_id, p_therapist_id, 'evaluation_15min', 'confirmed', p_appointment_date)
    RETURNING id INTO v_appointment_id;

    -- 4. Return success
    RETURN jsonb_build_object(
        'success', true,
        'appointment_id', v_appointment_id,
        'patient_id', v_patient_id
    );
END;
$$;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Therapists are readable by everyone (Public API for /book page)
CREATE POLICY "Therapists are publicly viewable."
    ON public.therapists FOR SELECT
    USING (is_active = true);

-- Inserts into appointments are governed by our RPCs or secure Server logic (Service Role)
-- So we deny direct public insert from the web to avoid tampering.
CREATE POLICY "Appointments read-only for public"
    ON public.appointments FOR SELECT
    USING (true);

-- Patients read-only
CREATE POLICY "Patients read-only for public"
    ON public.patients FOR SELECT
    USING (true);
