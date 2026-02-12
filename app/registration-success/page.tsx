'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function RegistrationSuccess() {
  const [countdown, setCountdown] = useState(10);
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const userType = searchParams.get('userType') || 'investor';

  useEffect(() => {
    // Countdown timer for automatic redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/login';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRedirect = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Registration Successful!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your {userType} account has been created successfully.
        </p>

        {/* Email Verification Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <div className="text-left">
              <p className="text-blue-800 font-medium mb-1">
                Verify your email address
              </p>
              <p className="text-blue-600 text-sm">
                We've sent a verification link to{' '}
                <span className="font-semibold">{email || 'your email address'}</span>. 
                Please check your inbox and click the link to verify your account.
              </p>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-sm">
            Redirecting to login page in{' '}
            <span className="font-bold text-indigo-600">{countdown}</span> seconds...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleManualRedirect}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Go to Login Now
          </button>
          
          <Link
            href="/"
            className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition duration-200"
          >
            Back to Home
          </Link>
        </div>

        {/* Support Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Didn't receive the email?{' '}
            <button className="text-indigo-600 hover:text-indigo-500 font-medium">
              Resend verification
            </button>
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Need help?{' '}
            <a href="mailto:support@unlistx.com" className="hover:text-gray-600">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}