import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // adjust this path if needed
import { useNavigate } from "react-router-dom";


const LoginForm = ({ isShowLogin, handleLoginClick }) => {
  const [formData, setFormData] = useState({ username: "", password: "", code: "" });
  const [step, setStep] = useState(1); // Step 1: Firebase Login, Step 2: 2FA
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState("");
  const navigate = useNavigate();


  const checkPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (/\d/.test(password) && /[A-Z]/.test(password)) return "Strong";
    return "Medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password, code } = formData;

    if (attempts >= 3) {
      alert("Too many failed attempts. Please try again later.");
      return;
    }

    if (step === 1) {
      if (!username || !password) {
        alert("Username and password are required.");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, username, password);
        setStep(2); // Move to 2FA
      } catch (error) {
        setAttempts((prev) => prev + 1);
        alert("Login failed: " + error.message);
      }
    } else if (step === 2) {
      if (code === "123456") {
      alert("Login successful with 2FA!");
      setStep(1);
      setFormData({ username: "", password: "", code: "" });
      setAttempts(0);
      handleLoginClick(); // Optional: to close popup
      navigate("/admin-dashboard"); // ✅ Redirect to dashboard
    } else {
        alert("Incorrect 2FA code.");
      }
    }
  };

  return (
    <div className={`${isShowLogin ? "active" : ""} show`}>
      <div className="login-form">
        <div className="form-box solid">
          <form onSubmit={handleSubmit}>
            <h1 className="login-text">Admin Login</h1>

            {step === 1 ? (
              <>
                <label>Email</label>
                <input
                  type="email"
                  name="username"
                  className="login-box"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="off"
                />

                <label>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="login-box"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="off"
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: 10,
                      top: 12,
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#555"
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                </div>
                <p style={{ marginTop: 5, color: strength === "Strong" ? "green" : strength === "Medium" ? "orange" : "red" }}>
                  Password Strength: {strength}
                </p>
              </>
            ) : (
              <>
                <label>Enter 2FA Code</label>
                <input
                  type="text"
                  name="code"
                  className="login-box"
                  value={formData.code}
                  onChange={handleChange}
                />
              </>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", marginTop: "20px" }}>
              <input
                type="submit"
                value={step === 1 ? "LOGIN" : "VERIFY"}
                className="login-btn"
                style={{
                  flex: 1,
                  backgroundColor: "rgb(48,172,251)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "15pt",
                  fontWeight: 700,
                  padding: "10px",
                  cursor: "pointer"
                }}
              />
              <button
                type="button"
                className="close-btn"
                onClick={() => {
                  handleLoginClick();
                  setStep(1);
                  setFormData({ username: "", password: "", code: "" });
                  setAttempts(0);
                }}
                style={{
                  flex: 1,
                  backgroundColor: "rgb(48,172,251)",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  fontSize: "15pt",
                  fontWeight: 700,
                  padding: "10px",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
