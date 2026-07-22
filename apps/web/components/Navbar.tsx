"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function decodeJwt(token: string) {
  const payload = token.split('.')[1];

if (!payload) {
  throw new Error('유효하지 않은 JWT 토큰입니다.');
}

const base64 = payload
  .replace(/-/g, '+')
  .replace(/_/g, '/');

  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  );

  const decoded = atob(padded);

  const bytes = Uint8Array.from(
    decoded,
    (char) => char.charCodeAt(0)
  );

  const text = new TextDecoder().decode(bytes);

  return JSON.parse(text);
}

export default function Navbar() {
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  function loadUser() {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setIsLoggedIn(false);
      setNickname("");
      return;
    }

    try {
      const payload = decodeJwt(token);

      console.log("JWT PAYLOAD =", payload);

      setIsLoggedIn(true);
      setNickname(payload.nickname || "");
    } catch (error) {
      console.error("JWT 해석 실패:", error);

      setIsLoggedIn(false);
      setNickname("");
    }
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");

    setIsLoggedIn(false);
    setNickname("");

    router.push("/login");
  }

  return (
    <nav
      style={{
        padding: "20px 40px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          cursor: "pointer",
        }}
        onClick={() => router.push("/ai")}
      >
        ✈️ TripPilot AI
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {!isLoggedIn ? (
          <>
            <button onClick={() => router.push("/login")}>
              로그인
            </button>

            <button onClick={() => router.push("/register")}>
              회원가입
            </button>
          </>
        ) : (
          <>
            <span>
              👋 {nickname}님
            </span>

            <button onClick={() => router.push("/ai")}>
              AI 여행 생성
            </button>

            <button onClick={() => router.push("/trips")}>
              내 여행
            </button>

            <button onClick={handleLogout}>
              로그아웃
            </button>
          </>
        )}
      </div>
    </nav>
  );
}