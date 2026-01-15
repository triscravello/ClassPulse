// frontend/src/pages/Login.js
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f1f5f9",
        padding: "1rem",
        flexDirection: "column",
      }}
    >
      <h2 style={{ marginBottom: "1.5rem", color: "#111827" }}>Login</h2>
      <LoginForm />
    </div>
  );
};

export default Login;