// middleware.ts
// Auth + role-based routing middleware
// Runs on every request before page renders

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED_CLINICAL = ['/dashboard', '/inbox', '/patients', '/plans', '/exercise-library', '/reports', '/messages', '/settings', '/audit-log'];
const PROTECTED_PATIENT   = ['/m/today', '/m/session', '/m/checkin', '/m/progress', '/m/library', '/m/profile', '/m/games'];

// Public routes (no auth needed)
const PUBLIC_ROUTES = ['/login', '/m/login', '/m/onboarding'];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — REQUIRED: do not remove
  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  // ── Unauthenticated user hitting a protected route ─────────
  if (!user) {
    const isProtectedClinical = PROTECTED_CLINICAL.some(r => path.startsWith(r));
    const isProtectedPatient  = PROTECTED_PATIENT.some(r => path.startsWith(r));

    if (isProtectedClinical) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (isProtectedPatient) {
      return NextResponse.redirect(new URL('/m/login', request.url));
    }
    return supabaseResponse;
  }

  // ── Authenticated user: fetch role ─────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, clinic_id, is_active')
    .eq('id', user.id)
    .single();

  // Deactivated account
  if (profile && !profile.is_active) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login?error=account_deactivated', request.url));
  }

  const role = profile?.role ?? 'patient';
  const isPatient  = role === 'patient';
  const isClinical = ['clinic_admin', 'therapist', 'assistant'].includes(role);

  // ── Redirect from login pages if already authed ────────────
  if (path === '/login' || path === '/') {
    if (isClinical) return NextResponse.redirect(new URL('/dashboard', request.url));
    if (isPatient)  return NextResponse.redirect(new URL('/m/today', request.url));
  }
  if (path === '/m/login') {
    if (isPatient)  return NextResponse.redirect(new URL('/m/today', request.url));
    if (isClinical) return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ── Patients hitting clinical routes ──────────────────────
  const isHittingClinical = PROTECTED_CLINICAL.some(r => path.startsWith(r));
  if (isPatient && isHittingClinical) {
    return NextResponse.redirect(new URL('/m/today', request.url));
  }

  // ── Clinical staff hitting patient routes ─────────────────
  const isHittingPatient = PROTECTED_PATIENT.some(r => path.startsWith(r));
  if (isClinical && isHittingPatient) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
