"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!email || !nickname || !password) {
        setError("이메일, 닉네임, 비밀번호를 모두 입력해주세요.");
        return;
      }

      await registerUser({
        email,
        nickname,
        password,
      });

      setSuccess("회원가입이 완료되었습니다.");

      setTimeout(() => {
        router.push("/login");
      }, 1000);

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
      <h1>회원가입</h1>

      <br />

      {/* 이메일 */}
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

      {/* 닉네임 */}
      <input
        type="text"
        placeholder="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
        }}
      />

      {/* 비밀번호 */}
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

      {/* 회원가입 */}
      <button
        onClick={handleRegister}
        disabled={loading}
        style={{
          width: "100%",
          padding: "12px",
        }}
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>

      {error && (
        <p style={{ color: "red" }}>
          오류: {error}
        </p>
      )}

      {success && (
        <p style={{ color: "green" }}>
          {success}
        </p>
      )}

      <br />

      <button
        onClick={() => router.push("/login")}
        style={{
          width: "100%",
          padding: "12px",
        }}
      >
        로그인으로 돌아가기
      </button>
    </main>
  );
}