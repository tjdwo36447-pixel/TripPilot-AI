import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripPilot AI - 예산 기반 AI 여행 플래너",

  description:
    "여행 예산과 여행 스타일을 입력하면 AI가 항공편, 숙소, 여행 일정까지 맞춤형으로 계획해주는 AI 여행 플래너입니다.",

  keywords: [
    "여행 일정 AI",
    "AI 여행 계획",
    "여행 일정 자동 생성",
    "예산별 여행 추천",
    "여행 플래너 AI",
    "AI 여행 플래너",
    "여행 계획 추천",
  ],

  // ✅ Google Search Console 소유권 인증
  verification: {
    google: "pi8m3n_0V4m9UIGL2OW8a-qAsGXDwou-TQCTny-KNgA",
  },

  openGraph: {
    title: "TripPilot AI - 예산 기반 AI 여행 플래너",

    description:
      "예산부터 시작하는 스마트 여행. AI가 나만의 여행 일정과 여행 계획을 만들어드립니다.",

    type: "website",

    siteName: "TripPilot AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}