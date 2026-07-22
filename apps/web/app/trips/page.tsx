"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getTrips,
} from "@/lib/api";

export default function TripsPage() {
  const router = useRouter();

  const [trips, setTrips] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ======================================
  // 여행 목록 불러오기
  // ======================================

  useEffect(() => {
    async function loadData() {
      const token =
        localStorage.getItem(
          "accessToken",
        );

      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const tripsResult =
          await getTrips(token);

        setTrips(tripsResult);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <main
        style={{
          padding: "40px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h1>
          🧳 내 여행 불러오는 중...
        </h1>
      </main>
    );
  }

  // ======================================
  // 화면
  // ======================================

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* ================================ */}
      {/* 헤더 */}
      {/* ================================ */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1>
          🧳 내 여행
        </h1>

        <button
          onClick={() =>
            router.push("/ai")
          }
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          ✨ 새 여행 만들기
        </button>
      </div>

      {/* ================================ */}
      {/* 오류 */}
      {/* ================================ */}

      {error && (
        <p
          style={{
            color: "red",
          }}
        >
          오류: {error}
        </p>
      )}

      {/* ================================ */}
      {/* 여행 없음 */}
      {/* ================================ */}

      {trips.length === 0 ? (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: "16px",
            padding: "50px 20px",
            textAlign: "center",
          }}
        >
          <h2>
            아직 생성된 여행이 없습니다.
          </h2>

          <p>
            AI를 이용해서 나만의 여행을
            만들어보세요.
          </p>

          <button
            onClick={() =>
              router.push("/ai")
            }
            style={{
              padding: "12px 24px",
              marginTop: "15px",
              cursor: "pointer",
            }}
          >
            AI 여행 만들기
          </button>
        </div>
      ) : (
        /* ================================ */
        /* 여행 목록 */
        /* ================================ */

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {trips.map((trip) => {
            const totalExpense =
              trip.expenses?.reduce(
                (
                  sum: number,
                  expense: any,
                ) =>
                  sum +
                  Number(
                    expense.amount,
                  ),
                0,
              ) ?? 0;

            return (
              <div
                key={trip.id}
                onClick={() =>
                  router.push(
                    `/trips/${trip.id}`,
                  )
                }
                style={{
                  border:
                    "1px solid #ddd",
                  borderRadius: "16px",
                  padding: "24px",
                  cursor: "pointer",
                  transition:
                    "0.2s",
                }}
              >
                {/* 여행 아이콘 */}

                <div
                  style={{
                    fontSize: "40px",
                    marginBottom: "10px",
                  }}
                >
                  ✈️
                </div>

                {/* 여행 제목 */}

                <h2
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  {trip.title}
                </h2>

                {/* 여행 기간 */}

                <p>
                  📅{" "}
                  {new Date(
                    trip.startDate,
                  ).toLocaleDateString(
                    "ko-KR",
                  )}

                  {" ~ "}

                  {new Date(
                    trip.endDate,
                  ).toLocaleDateString(
                    "ko-KR",
                  )}
                </p>

                {/* 일정 / 비용 개수 */}

                <div
                  style={{
                    display: "flex",
                    gap: "15px",
                    marginTop: "20px",
                    fontSize: "14px",
                  }}
                >
                  <span>
                    📍 일정{" "}
                    {trip.schedules
                      ?.length ?? 0}
                    개
                  </span>

                  <span>
                    💰 비용{" "}
                    {trip.expenses
                      ?.length ?? 0}
                    개
                  </span>
                </div>

                {/* 예상 비용 */}

                <div
                  style={{
                    marginTop: "25px",
                    padding: "20px",
                    borderRadius: "12px",
                    backgroundColor:
                      "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "#64748b",
                    }}
                  >
                    💰 총 예상 비용
                  </p>

                  <h2
                    style={{
                      margin:
                        "8px 0 0",
                      color: "#2563eb",
                      fontSize: "28px",
                    }}
                  >
                    {totalExpense.toLocaleString()}
                    원
                  </h2>
                </div>

                {/* 상세 보기 */}

                <div
                  style={{
                    marginTop: "25px",
                    paddingTop: "15px",
                    borderTop:
                      "1px solid #eee",
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  상세 보기 →
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}