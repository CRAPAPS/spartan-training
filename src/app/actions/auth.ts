'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { checkRateLimit } from '@/lib/rateLimit';
import { verifyTurnstile } from '@/lib/turnstile';

export async function signInAction(formData: FormData) {
  const email = formData.get('email') as string;

  const turnstileToken = formData.get('cf-turnstile-response') as string | null;
  if (!await verifyTurnstile(turnstileToken)) {
    redirect(`/sign-in?error=${encodeURIComponent('Security check failed. Please try again.')}`);
  }

  if (!checkRateLimit(`signin:${email}`, 5, 15 * 60 * 1000)) {
    redirect(`/sign-in?error=${encodeURIComponent('Too many sign-in attempts. Please wait 15 minutes.')}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: formData.get('password') as string,
  });

  if (error) {
    redirect(`/sign-in?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}

export async function updatePasswordAction(formData: FormData) {
  const password        = formData.get('password') as string;
  const confirmPassword = formData.get('confirm_password') as string;

  if (password !== confirmPassword) {
    redirect(`/dashboard/settings?error=${encodeURIComponent('Passphrases do not match')}`);
  }
  if (password.length < 8) {
    redirect(`/dashboard/settings?error=${encodeURIComponent('Passphrase must be at least 8 characters')}`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/dashboard/settings?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard/settings?updated=1');
}
