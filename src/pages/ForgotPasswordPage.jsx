import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { getErrorMessage } from "../utils/getErrorMessage";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await forgotPassword(email);
 
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err, "Could not send reset email. Please try again."));
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Forgot Password</h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter your email and we&apos;ll send you a reset token.
        </p>

        {sent ? (
          <div>
            <div className="bg-green-50 text-green-700 text-sm rounded-md px-3 py-2 mb-4">
              If this email is registered, a reset token has been sent to it. Check your
              inbox for the token.
            </div>
            <Link
              to="/reset-password"
              className="block text-center bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 w-full"
            >
              I have my reset token
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-4">
                {error}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white font-medium px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 w-full"
            >
              {submitting ? "Sending..." : "Send Reset Token"}
            </button>
          </form>
        )}

        <p className="text-sm text-gray-500 text-center mt-4">
          Remembered your password?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
