"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    try {
      setLoading(true);
      setError("");

      const result = await loginUser({
        email,
        password,
      });

      localStorage.setItem(
        "accessToken",
        result.accessToken,
      );

      router.push("/ai");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: "500px",
        margin: "80px auto",
        padding: "30px",
      }}
    >
      <h1>로그인</h1>

      <br />

      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
        }}
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
        }}
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
        }}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>

      {error && (
        <p style={{ color: "red" }}>
          오류: {error}
        </p>
      )}

      <br />

      <button
        onClick={() => router.push("/register")}
        style={{
          width: "100%",
          padding: "12px",
        }}
      >
        회원가입
      </button>
    </main>
  );
}