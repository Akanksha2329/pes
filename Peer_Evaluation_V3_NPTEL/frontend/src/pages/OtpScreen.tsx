// src/pages/OtpScreen.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { api } from '../lib/api';

export default function OtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name ,email, password, role} = location.state || {};
  const [otp, setOtp] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [dialogAction, setDialogAction] = useState<'retry' | 'login'>('retry');

  const ErrorDialog = () => {
    if (!showDialog) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center min-w-[320px]">
          <svg width={56} height={56} viewBox="0 0 24 24" fill="none" className="mb-2">
            <circle cx="12" cy="12" r="12" fill="#f87171" />
            <path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="text-lg font-semibold text-center mb-4 text-red-600">{dialogMessage}</div>
          <div className="w-full flex gap-3">
            <button
              onClick={() => setShowDialog(false)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-3xl w-full"
            >
              Close
            </button>
            <button
              onClick={() => {
                setShowDialog(false);
                if (dialogAction === 'login') navigate('/login');
              }}
              className="bg-purple-700 text-white px-4 py-2 rounded-3xl w-full"
            >
              {dialogAction === 'login' ? 'Login' : 'Retry'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  

  const handleVerify = async () => {
    try {
      const otpRes = await api.post('/api/auth/verify', {
        email,
        otp,
      });

      if (otpRes.data.verified) {
        const registerRes = await api.post('/api/auth/register', {
          name,
          email,
          password,
          role,
        }, {
          withCredentials: true,
        });
        
        const { token, role: userRole } = registerRes.data;

        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);

        // Navigate to role-specific page
        if (userRole === 'admin') navigate('/admin');
        else if (userRole === 'teacher') navigate('/teacher');
        else if (userRole === 'ta') navigate('/ta');
        else navigate('/dashboard');
      } else {
        setDialogMessage('Invalid OTP');
        setDialogAction('retry');
        setShowDialog(true);
      }
    } catch (err: any) {
      console.error(err);
      const backendMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Verification or registration failed';
      const lowerMessage = String(backendMessage).toLowerCase();
      setDialogMessage(backendMessage);
      setDialogAction(lowerMessage.includes('already exists') ? 'login' : 'retry');
      setShowDialog(true);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-300 via-pink-300 to-red-300">
      <ErrorDialog />
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md text-center animate-fadeIn">
        <button
        onClick={() => navigate('/register')}
        className="mb-4 text-purple-600 hover:underline text-sm flex items-center"
        >
        ← Back to Register
        </button>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">OTP Verification</h2>
        <p className="text-gray-500 mb-6">Enter the OTP sent to <strong>{email}</strong></p>
        
        <input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          className="w-full text-center tracking-widest text-xl px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 transition"
        />

        <button
          onClick={handleVerify}
          className="mt-6 w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 transition shadow-md transform hover:scale-105"
        >
          Verify OTP
        </button>

        <p className="mt-4 text-gray-600 text-sm">
          Didn’t receive the code? <span className="text-purple-600 font-medium cursor-pointer hover:underline">Resend</span>
        </p>
      </div>
    </div>
  );
}
