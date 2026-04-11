import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAdminSession, setAdminSession } from "../../lib/adminAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("loading"); // loading, setup, login, forgot, reset
  const [form, setForm] = useState({ full_name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resetToken, setResetToken] = useState("");

  useEffect(() => {
    // Check if already logged in
    const session = getAdminSession();
    if (session?.user?.id) {
      navigate("/csaccess/dashboard");
      return;
    }

    // Check for reset token in URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset");
    if (token) {
      setResetToken(token);
      setMode("reset");
      return;
    }

    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const res = await base44.functions.invoke("adminAuth", { action: "check_setup" });
      setMode(res.data.hasOwner ? "login" : "setup");
    } catch {
      setMode("login");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await base44.functions.invoke("adminAuth", {
        action: "login",
        email: form.email,
        password: form.password,
      });
      setAdminSession(res.data);
      navigate("/csaccess/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await base44.functions.invoke("adminAuth", {
        action: "setup_owner",
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      setSuccess("Owner account created! You can now log in.");
      setTimeout(() => { setMode("login"); setSuccess(""); setForm({ full_name: "", email: "", password: "", confirmPassword: "" }); }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Setup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await base44.functions.invoke("adminPasswordReset", {
        action: "request_reset",
        email: form.email,
      });
      setSuccess("If an account exists with that email, a reset link has been sent.");
    } catch {
      setSuccess("If an account exists with that email, a reset link has been sent.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await base44.functions.invoke("adminPasswordReset", {
        action: "reset_password",
        token: resetToken,
        password: form.password,
      });
      setSuccess("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        window.history.replaceState({}, "", "/csaccess");
        setMode("login");
        setSuccess("");
        setForm({ full_name: "", email: "", password: "", confirmPassword: "" });
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  if (mode === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-secondary">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="https://media.base44.com/images/public/69c6e2cf0b61fa041c4eb06c/4c25434d1_Consolve_identity_compressed_HQai.png"
            alt="Consolve"
            className="h-10 mx-auto mb-6"
            style={{ mixBlendMode: "screen" }}
          />
          <h1 className="text-xl font-bold text-white">
            {mode === "setup" && "Initial Setup"}
            {mode === "login" && "Admin Login"}
            {mode === "forgot" && "Reset Password"}
            {mode === "reset" && "New Password"}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {mode === "setup" && "Create the owner account to get started"}
            {mode === "login" && "Sign in to the admin panel"}
            {mode === "forgot" && "Enter your email to receive a reset link"}
            {mode === "reset" && "Enter your new password"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-4">
            {success}
          </div>
        )}

        {/* Setup Form */}
        {mode === "setup" && (
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Full Name</label>
              <Input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Your full name"
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@consolve.com"
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Min 8 characters"
                  required
                  minLength={8}
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Confirm Password</label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 mt-2 font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Owner Account"}
            </Button>
          </form>
        )}

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@consolve.com"
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  required
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 mt-2 font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
            </Button>
            <button
              type="button"
              onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
              className="w-full text-sm text-white/40 hover:text-primary transition-colors mt-2"
            >
              Forgot your password?
            </button>
          </form>
        )}

        {/* Forgot Password Form */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Email Address</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@consolve.com"
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
            </Button>
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className="flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors mx-auto mt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to login
            </button>
          </form>
        )}

        {/* Reset Password Form */}
        {mode === "reset" && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">New Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Min 8 characters"
                required
                minLength={8}
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-white/50 mb-1.5 block">Confirm New Password</label>
              <Input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="Repeat password"
                required
                className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 font-semibold">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}