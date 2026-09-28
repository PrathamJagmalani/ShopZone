import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Get registered users from localStorage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Find user
    const user = users.find(
      (user) =>
        user.email === email &&
        user.password === password
    );

    if (!user) {
      setError("Invalid email or password.");
      return;
    }

    // Store currently logged-in user
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify(user)
    );

    setSuccess("Login successful!");

    // Redirect to products
    setTimeout(() => {
      navigate("/products");
    }, 800);
  };

  return (
    <div className="auth-page">

      <div className="auth-box">

        <div className="auth-icon">
          🛒
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Login to your ShopZone account
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin}>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>

        <p className="register-text">
          Don't have an account?{" "}
          <Link to="/register">
            Create Account
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;