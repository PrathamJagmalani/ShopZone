import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // Check passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Get existing users
    const users =
      JSON.parse(localStorage.getItem("users")) || [];

    // Check duplicate email
    const existingUser = users.find(
      (user) => user.email === email
    );

    if (existingUser) {
      setError(
        "An account with this email already exists."
      );
      return;
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name: name,
      email: email,
      password: password,
    };

    // Save user
    users.push(newUser);

    localStorage.setItem(
      "users",
      JSON.stringify(users)
    );

    // Automatically login the newly registered user
    localStorage.setItem(
      "loggedInUser",
      JSON.stringify({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      })
    );

    setSuccess(
      "Registration successful! Welcome to ShopZone."
    );

    // Go directly to home page
    setTimeout(() => {
      navigate("/home");
    }, 800);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2>Create Account</h2>

        <p className="auth-subtitle">
          Join ShopZone today
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

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

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
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>

            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
          >
            Create Account
          </button>

        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;