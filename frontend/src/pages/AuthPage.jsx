import React from 'react';
import { useSignIn } from '@clerk/clerk-react';

export default function AuthPage() {
  const { signIn, isLoaded } = useSignIn();

  const handleGoogleSignIn = () => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
      strategy: 'oauth_google',
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/',
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Side: Clean Google Login Button */}
      <div className="w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm flex flex-col items-center text-center">
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
            SignIn
          </h2>
          <p className="text-sm text-gray-500 mb-8 font-normal">
            Sign in securely using your Google account.
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={!isLoaded}
            type="button"
            className="w-full flex items-center justify-center gap-3 bg-[#EAEAEA] hover:bg-[#dfdfdf] active:scale-[0.99] text-gray-800 font-medium py-3 px-5 rounded-lg border border-gray-300 transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span className="text-sm">Sign in with Google</span>
          </button>
        </div>
      </div>

      {/* Right Side: WorkTracker Branding Banner */}
      <div className="hidden md:flex md:w-1/2 min-h-screen bg-[#111936] flex-col items-center justify-center p-12 text-center text-white select-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-blue-500/30">
            W
          </div>
          <h1 className="text-3xl font-extrabold tracking-normal">WorkTracker</h1>
        </div>
        <p className="text-sm text-gray-300 max-w-lg font-normal leading-relaxed">
          Track • Plan • Grow. A Collaborative Platform for Daily Work Tracking, Task Mapping, and Monthly Reporting.
        </p>
      </div>
    </div>
  );
}