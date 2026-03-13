import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle, Loader2, Eye, EyeOff, UtensilsCrossed, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const sanitizedEmail = email.trim().toLowerCase();
    const endpoint = isSignup ? `${API_BASE_URL}/api/auth/signup` : `${API_BASE_URL}/api/auth/login`;

    try {
      const res = await axios.post(endpoint, { email: sanitizedEmail, password });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      navigate('/');
    } catch (err: any) {
      console.error(`${isSignup ? 'Signup' : 'Login'} error:`, err);
      if (err.response) {
        setError(err.response.data?.message || `Error: ${err.response.status}`);
      } else {
        setError('Connection lost. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#020617] selection:bg-orange-500/30">
      {/* Animated Background Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-600/20 blur-[130px] rounded-full animate-blob pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-amber-600/20 blur-[130px] rounded-full animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute top-[30%] right-[10%] w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full animate-blob animation-delay-4000 pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className={`max-w-[480px] w-full relative z-10 px-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Branding */}
        <div className="text-center mb-10 group">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 mb-8 p-[2px] shadow-2xl shadow-orange-500/20 group-hover:scale-110 transition-transform duration-500">
            <div className="w-full h-full bg-[#020617] rounded-[2.4rem] flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent animate-pulse" />
              <UtensilsCrossed className="text-orange-500 w-12 h-12 relative z-10 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            </div>
          </div>
          <h2 className="text-5xl font-black text-white mb-3 tracking-tighter flex items-center justify-center gap-2">
            Mr. Chef <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">AI</span>
            <Sparkles className="w-6 h-6 text-amber-500 animate-bounce" />
          </h2>
          <p className="text-slate-400 font-medium text-lg">
            {isSignup ? 'Unlock your culinary potential' : 'Welcome back to the kitchen'}
          </p>
        </div>

        {/* Main Card */}
        <div className="relative group/card">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-[2.5rem] blur-sm transition duration-1000 group-hover/card:opacity-100" />
          
          <div className="relative bg-[#020617]/80 backdrop-blur-2xl rounded-[2.5rem] p-10 border border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Subtle light streak */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  Email Address
                </label>
                <div className="relative group/input">
                  <input
                    type="email"
                    placeholder="chef@mrchef.ai"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 focus:bg-white/[0.05] transition-all duration-300 text-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-sm font-bold text-slate-400 ml-2 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-500" />
                  Password
                </label>
                <div className="relative group/input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4.5 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/40 focus:bg-white/[0.05] transition-all duration-300 text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-400 transition-colors p-2"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-orange-500/5 opacity-0 group-focus-within/input:opacity-100 pointer-events-none transition-opacity duration-300" />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-100 p-5 rounded-3xl flex items-center gap-4 text-sm animate-shake">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden py-5 rounded-2xl transition-all duration-500 active:scale-[0.98] disabled:opacity-70"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 animate-gradient-xy" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                
                <div className="relative z-10 flex items-center justify-center gap-3 text-white font-black text-xl tracking-tight">
                  {loading ? (
                    <Loader2 className="w-7 h-7 animate-spin" />
                  ) : (
                    <>
                      <span>{isSignup ? 'START CREATING' : 'DASHBOARD ACCESS'}</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            <div className="mt-10 text-center space-y-4">
              <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <p className="text-slate-500 text-lg font-medium">
                {isSignup ? 'Already a Master Chef?' : 'New to our culinary AI?'}{' '}
                <button
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError('');
                  }}
                  className="text-white hover:text-orange-500 font-black decoration-orange-500/50 hover:decoration-orange-500 transition-all duration-300 underline underline-offset-8 ml-1"
                >
                  {isSignup ? 'Sign In' : 'Join the Brigade'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-8 text-center text-slate-500 text-sm font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3">
          <span className="w-10 h-[1px] bg-slate-800" />
          SECURE KITCHEN PROTOCOL
          <span className="w-10 h-[1px] bg-slate-800" />
        </p>
      </div>
    </div>
  );
};

export default Login;
