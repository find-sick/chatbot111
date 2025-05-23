"use client";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { signUpWithEmail, signInWithEmail } from '../actions/user-actions';
import GoogleSignIn from '../components/GoogleSignIn';
import './login-styles.css';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      handleRegister(email, password);
    } else {
      handleLogin(email, password);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await signInWithEmail(email, password);
    
    if (result.session) {
      const {access_token: token} = result.session;
      localStorage.setItem('token', token);
      setEmail("");
      setPassword("");
      router.push('/');
    } else {
      alert(result.error);
    }
  }

  const handleRegister = async (email: string, password: string) => {
    const result = await signUpWithEmail(email, password);
    console.log(111,result)
    if (result.error) {
      alert(result.error);
    } else {
      alert("注册成功");
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div className="login-container">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="login-title">
          {isRegister ? "创建新账户" : "登录你的账户"}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="form-container">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="input-label">
                邮箱
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="input-label">
                密码
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div style={{marginTop: "15px"}}>
              <button
                type="submit"
                className="submit-btn"
              >
                {isRegister ? "注册" : "登录"}
              </button>
            </div>
          </form>

          <div className="divider-container">
            <div className="divider-line" />
            <div className="divider-text">
              或者使用其他方式登录
            </div>
          </div>

          <GoogleSignIn />

          <div className="toggle-link">
            <span className="mr-1">
              {isRegister ? "已有账户？" : "还没有账户？"}
            </span>
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="toggle-btn"
            >
              {isRegister ? "立即登录" : "创建新账户"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
