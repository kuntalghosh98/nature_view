import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { loginAdmin, restoreSession } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, loading, navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await dispatch(loginAdmin({ email, password })).unwrap();
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-[#f7f4ed] lg-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-forest-900 text-white lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(213,168,79,0.35),transparent_32%),linear-gradient(135deg,#153a25,#205c34_54%,#6c4d2f)]" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/12">
              <Leaf size={22} />
            </span>
            <span className="text-lg font-semibold">Nature View</span>
          </div>
          <div className="max-w-xl">
            <p className="mb-4 text-sm uppercase tracking-[0.22em] text-gold-400">Environmental CMS</p>
            <h1 className="text-5xl font-semibold leading-tight">Manage impact, stories, and destinations from one place.</h1>
            <p className="mt-6 text-base leading-7 text-white/74">
              Sprint 1 starts with a focused admin foundation.
            </p>
          </div>
        </div>
      </section>

      <section className="flex items-center justify-center px-4 py-10 sm-6">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-forest-900/10 bg-white p-6 shadow-panel sm-8">
          <div className="mb-8">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-forest-700 text-white lg">
              <Leaf size={22} />
            </div>
            <h2 className="text-2xl font-semibold text-forest-900">Admin Login</h2>
            <p className="mt-2 text-sm text-forest-900/62">Use your admin credentials to continue.</p>
          </div>

          <label className="block text-sm font-medium text-forest-900" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-forest-900/15 px-3 py-3 outline-none transition focus-forest-700 focus-4 focus-forest-100"
            required
          />

          <label className="mt-5 block text-sm font-medium text-forest-900" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-forest-900/15 px-3 py-3 outline-none transition focus-forest-700 focus-4 focus-forest-100"
            required
            minLength={8}
          />

          {error && <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full rounded-lg bg-forest-700 px-4 py-3 text-sm font-semibold text-white transition hover-forest-900 disabled-not-allowed disabled-65"
          >
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
}

