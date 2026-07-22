"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
const router = useRouter();

return (
<main
style={{
minHeight: "100vh",
background: "#ffffff",
color: "#111827",
}}
>
{/* Header */}
<header
style={{
height: "72px",
padding: "0 40px",
borderBottom: "1px solid #e5e7eb",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
background: "#ffffff",
}}
>
<h1
style={{
margin: 0,
fontSize: "24px",
fontWeight: 800,
cursor: "pointer",
}}
onClick={() => router.push("/")}
>
✈️ TripPilot AI </h1>

```
    <div
      style={{
        display: "flex",
        gap: "12px",
      }}
    >
      <button
        onClick={() => router.push("/login")}
        style={{
          padding: "10px 18px",
          border: "1px solid #d1d5db",
          borderRadius: "8px",
          background: "#ffffff",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        로그인
      </button>

      <button
        onClick={() => router.push("/register")}
        style={{
          padding: "10px 18px",
          border: "none",
          borderRadius: "8px",
          background: "#111827",
          color: "#ffffff",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        회원가입
      </button>
    </div>
  </header>

  {/* Hero */}
  <section
    style={{
      minHeight: "520px",
      padding: "100px 24px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      background:
        "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
    }}
  >
    <div
      style={{
        marginBottom: "20px",
        padding: "8px 16px",
        borderRadius: "999px",
        background: "#eef2ff",
        color: "#4f46e5",
        fontSize: "14px",
        fontWeight: 600,
      }}
    >
      ✨ AI가 만드는 나만의 여행
    </div>

    <h2
      style={{
        margin: "0 0 20px",
        fontSize: "clamp(36px, 6vw, 64px)",
        lineHeight: 1.15,
        fontWeight: 800,
      }}
    >
      나만의 여행을
      <br />
      AI로 계획하세요
    </h2>

    <p
      style={{
        margin: "0 0 36px",
        color: "#6b7280",
        fontSize: "20px",
        lineHeight: 1.6,
      }}
    >
      예산부터 시작하는 스마트 여행
      <br />
      당신에게 맞는 여행 일정을 AI가 만들어드립니다.
    </p>

    <button
      onClick={() => router.push("/ai")}
      style={{
        padding: "16px 32px",
        border: "none",
        borderRadius: "12px",
        background: "#111827",
        color: "#ffffff",
        fontSize: "18px",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.12)",
      }}
    >
      ✈️ AI 여행 만들기
    </button>
  </section>

  {/* Features */}
  <section
    style={{
      padding: "80px 24px 100px",
      maxWidth: "1100px",
      margin: "0 auto",
    }}
  >
    <h2
      style={{
        margin: "0 0 12px",
        textAlign: "center",
        fontSize: "36px",
        fontWeight: 800,
      }}
    >
      TripPilot AI 주요 기능
    </h2>

    <p
      style={{
        margin: "0 0 48px",
        textAlign: "center",
        color: "#6b7280",
        fontSize: "16px",
      }}
    >
      여행 계획부터 예약 관리까지 한 곳에서 관리하세요.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
      }}
    >
      <FeatureCard
        icon="💰"
        title="예산 기반 여행"
        description="예산을 먼저 설정하고 그 안에서 최적의 여행 계획을 만들어보세요."
      />

      <FeatureCard
        icon="🤖"
        title="AI 맞춤 일정"
        description="여행 스타일과 기간에 맞춰 AI가 나만의 일정을 생성합니다."
      />

      <FeatureCard
        icon="✈️"
        title="항공편 검색"
        description="여행지에 맞는 항공편을 검색하고 여행 일정에 저장할 수 있습니다."
      />

      <FeatureCard
        icon="🏨"
        title="숙소 및 여행 관리"
        description="생성한 여행 일정과 예약 정보를 한 곳에서 편리하게 관리하세요."
      />
    </div>
  </section>

  {/* Footer */}
  <footer
    style={{
      padding: "24px",
      borderTop: "1px solid #e5e7eb",
      textAlign: "center",
      color: "#9ca3af",
      fontSize: "14px",
    }}
  >
    © 2026 TripPilot AI. Smart travel starts here.
  </footer>
</main>
```

);
}

function FeatureCard({
icon,
title,
description,
}: {
icon: string;
title: string;
description: string;
}) {
return (
<div
style={{
padding: "28px 24px",
border: "1px solid #e5e7eb",
borderRadius: "16px",
background: "#ffffff",
transition: "transform 0.2s ease",
}}
>
<div
style={{
marginBottom: "16px",
fontSize: "36px",
}}
>
{icon} </div>

```
  <h3
    style={{
      margin: "0 0 10px",
      fontSize: "20px",
      fontWeight: 700,
    }}
  >
    {title}
  </h3>

  <p
    style={{
      margin: 0,
      color: "#6b7280",
      fontSize: "14px",
      lineHeight: 1.7,
    }}
  >
    {description}
  </p>
</div>
```

);
}
