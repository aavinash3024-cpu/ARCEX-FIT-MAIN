'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  deleteUser,
} from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(err => {
    console.error("Auth Error (Guest):", err);
    errorEmitter.emit('auth-error', err);
  });
}

/** Initiate email/password sign-up (non-blocking). */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string): void {
  createUserWithEmailAndPassword(authInstance, email, password).catch(err => {
    console.error("Auth Error (SignUp):", err);
    errorEmitter.emit('auth-error', err);
  });
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password).catch(err => {
    console.error("Auth Error (SignIn):", err);
    errorEmitter.emit('auth-error', err);
  });
}

/** Initiate password reset email. */
export function initiatePasswordReset(authInstance: Auth, email: string): Promise<void> {
  return sendPasswordResetEmail(authInstance, email).catch(err => {
    console.error("Auth Error (Reset):", err);
    errorEmitter.emit('auth-error', err);
    throw err;
  });
}

/** Delete current user account. */
export async function initiateAccountDeletion(authInstance: Auth): Promise<void> {
  const user = authInstance.currentUser;
  if (!user) return;
  
  return deleteUser(user).catch(err => {
    console.error("Auth Error (Delete):", err);
    errorEmitter.emit('auth-error', err);
    throw err;
  });
}
