import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED_CLINICAL = ['/dashboard', '/inbox', '/patients', '/plans', '/exercise-library', '/reports', '/messages', '/settings', '/audit-log'];
const PROTECTED_PATIENT  = ['/m/today', '/m/session', '/m/checkin', '/m/progress', '/m/library', '/m/profile', '/m/games'];
const PUBLIC_ROUTES      = ['/login', '/m/login', '/m/onboarding'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Always allow public routes through — no auth check at all
  if (PUBLIC_ROUTES.some(r => path === r || path.startsWith(r + '/'))) {
    return NextResponse.next({ request });
  }

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

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in hitting protected route
  if (!user) {
    if (PROTECTED_CLINICAL.some(r => path.startsWith(r))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (PROTECTED_PATIENT.some(r => path.startsWith(r))) {
      return NextResponse.redirect(new URL('/m/login', request.url));
    }
    return supabaseResponse;
  }

  // Get role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();

  if (profile && !profile.is_active) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login?error=account_deactivated', request.url));
  }

  const role = profile?.role ?? 'patient';
  const isPatient  = role === 'patient';
  const isClinical = ['clinic_admin', 'therapist', 'assistant'].includes(role);

  // Logged in hitting root
  if (path === '/') {
    if (isClinical) return NextResponse.redirect(new URL('/dashboard', request.url));
    if (isPatient)  return NextResponse.redirect(new URL('/m/today', request.url));
  }

  // Patient hitting clinical routes
  if (isPatient && PROTECTED_CLINICAL.some(r => path.startsWith(r))) {
    return NextResponse.redirect(new URL('/m/today', request.url));
  }

  // Clinical hitting patient routes
  if (isClinical && PROTECTED_PATIENT.some(r => path.startsWith(r))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
