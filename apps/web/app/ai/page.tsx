"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createTrip } from "@/lib/api";

export default function AIPage() {
  const router = useRouter();

  const [country, setCountry] =
    useState("");

  const [city, setCity] =
    useState("");

  // 여행 시작일
  const [startDate, setStartDate] =
    useState("");

  // 여행 종료일
  const [endDate, setEndDate] =
    useState("");

  const [budget, setBudget] =
    useState(1200000);

  const [style, setStyle] =
    useState("");

  const [result, setResult] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ======================================
  // 로그인 상태 확인
  // ======================================

  useEffect(() => {
    const token =
      localStorage.getItem(
        "accessToken",
      );

    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  // ======================================
  // 로그아웃
  // ======================================

  function handleLogout() {
    localStorage.removeItem(
      "accessToken",
    );

    router.replace("/login");
  }

  // ======================================
  // 여행 일수 계산
  // ======================================

  function calculateDays(
    start: string,
    end: string,
  ) {
    if (!start || !end) {
      return 0;
    }

    const startTime =
      new Date(
        `${start}T00:00:00`,
      ).getTime();

    const endTime =
      new Date(
        `${end}T00:00:00`,
      ).getTime();

    const difference =
      endTime - startTime;

    const days =
      difference /
        (1000 * 60 * 60 * 24) +
      1;

    return days;
  }

  const days =
    calculateDays(
      startDate,
      endDate,
    );

  // ======================================
  // 여행 생성
  // ======================================

  async function handleCreateTrip() {
    setError("");

    // 국가 확인
    if (!country.trim()) {
      setError(
        "여행 국가를 입력해주세요.",
      );

      return;
    }

    // 도시 확인
    if (!city.trim()) {
      setError(
        "여행 도시를 입력해주세요.",
      );

      return;
    }

    // 출발일 확인
    if (!startDate) {
      setError(
        "여행 시작일을 선택해주세요.",
      );

      return;
    }

    // 종료일 확인
    if (!endDate) {
      setError(
        "여행 종료일을 선택해주세요.",
      );

      return;
    }

    // 날짜 검증
    if (endDate < startDate) {
      setError(
        "여행 종료일은 시작일보다 빠를 수 없습니다.",
      );

      return;
    }

    // 예산 확인
    if (
      !budget ||
      budget <= 0
    ) {
      setError(
        "예산을 입력해주세요.",
      );

      return;
    }

    // 스타일 확인
    if (!style.trim()) {
      setError(
        "여행 스타일을 입력해주세요.",
      );

      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem(
          "accessToken",
        );

      if (!token) {
        router.replace("/login");

        return;
      }

      // 서버로 전송할 데이터
      const data = {
        country,

        city,

        // 자동 계산된 여행 일수
        days,

        // 실제 여행 날짜
        startDate,

        endDate,

        budget,

        style,
      };

      console.log(
        "AI 여행 생성 요청:",
        data,
      );

      const response =
        await createTrip(
          data,
          token,
        );

      setResult(response);
    } catch (err: any) {
      setError(
        err.message ||
          "여행 생성에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* ================================= */}
      {/* 헤더 */}
      {/* ================================= */}

      <header
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <h1>
          ✈️ AI 여행 플래너
        </h1>

        <button
  onClick={() => router.push("/trips")}
  style={{
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    background: "#4f46e5",
    color: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  }}
>
  내 여행
</button>

        <button
          onClick={
            handleLogout
          }
          style={{
            padding:
              "10px 20px",
            cursor:
              "pointer",
          }}
        >
          로그아웃
        </button>
      </header>

      {/* ================================= */}
      {/* 여행 정보 입력 */}
      {/* ================================= */}

      <section>
        <h3>
          여행 정보
        </h3>

        {/* 국가 */}

        <input
          value={country}
          onChange={(e) =>
            setCountry(
              e.target.value,
            )
          }
          placeholder="국가 (예: 일본)"
          style={{
            padding:
              "10px",
            width:
              "100%",
            maxWidth:
              "500px",
          }}
        />

        <br />
        <br />

        {/* 도시 */}

        <input
          value={city}
          onChange={(e) =>
            setCity(
              e.target.value,
            )
          }
          placeholder="도시 (예: 도쿄)"
          style={{
            padding:
              "10px",
            width:
              "100%",
            maxWidth:
              "500px",
          }}
        />

        <br />
        <br />

        {/* ================================= */}
        {/* 여행 기간 */}
        {/* ================================= */}

        <h4>
          📅 여행 기간
        </h4>

        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            alignItems:
              "center",
            maxWidth:
              "500px",
          }}
        >
          {/* 시작일 */}

          <input
            type="date"
            value={
              startDate
            }
            onChange={(e) =>
              setStartDate(
                e.target.value,
              )
            }
            style={{
              padding:
                "10px",
              flex:
                1,
            }}
          />

          <span>
            ~
          </span>

          {/* 종료일 */}

          <input
            type="date"
            value={
              endDate
            }
            min={
              startDate ||
              undefined
            }
            onChange={(e) =>
              setEndDate(
                e.target.value,
              )
            }
            style={{
              padding:
                "10px",
              flex:
                1,
            }}
          />
        </div>

        {/* 여행 일수 표시 */}

        {days > 0 && (
          <p
            style={{
              marginTop:
                "12px",
              fontWeight:
                "bold",
            }}
          >
            ✈️ 총 여행 기간:{" "}
            {days}일
          </p>
        )}

        <br />

        {/* 예산 */}

        <input
          type="number"
          value={
            budget
          }
          onChange={(e) =>
            setBudget(
              Number(
                e.target.value,
              ),
            )
          }
          placeholder="예산"
          min="0"
          style={{
            padding:
              "10px",
            width:
              "100%",
            maxWidth:
              "500px",
          }}
        />

        <br />
        <br />

        {/* 여행 스타일 */}

        <input
          value={style}
          onChange={(e) =>
            setStyle(
              e.target.value,
            )
          }
          placeholder="스타일 (예: 맛집, 쇼핑)"
          style={{
            padding:
              "10px",
            width:
              "100%",
            maxWidth:
              "500px",
          }}
        />
      </section>

      <br />

      {/* ================================= */}
      {/* 여행 생성 버튼 */}
      {/* ================================= */}

      <button
        onClick={
          handleCreateTrip
        }
        disabled={
          loading
        }
        style={{
          padding:
            "12px 30px",
          cursor:
            loading
              ? "not-allowed"
              : "pointer",
        }}
      >
        {loading
          ? "생성 중..."
          : "여행 생성하기"}
      </button>

      {/* ================================= */}
      {/* 오류 메시지 */}
      {/* ================================= */}

      {error && (
        <p
          style={{
            color:
              "red",
            marginTop:
              "20px",
          }}
        >
          오류: {error}
        </p>
      )}

      {/* ================================= */}
      {/* 여행 생성 결과 */}
      {/* ================================= */}

      {result && (
        <section
          style={{
            marginTop:
              "40px",
          }}
        >
          <h2>
            🎉{" "}
            {
              result.plan
                ?.title
            }
          </h2>

          {/* 항공권 */}

          <div
            style={{
              border:
                "1px solid #ddd",
              padding:
                "20px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
            }}
          >
            <h3>
              ✈️ 항공권
            </h3>

            <p>
              {
                result.plan
                  ?.flight
              }
            </p>
          </div>

          {/* 숙소 */}

          <div
            style={{
              border:
                "1px solid #ddd",
              padding:
                "20px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
            }}
          >
            <h3>
              🏨 숙소
            </h3>

            <p>
              {
                result.plan
                  ?.hotel
              }
            </p>
          </div>

          {/* 일정 */}

          <div
            style={{
              border:
                "1px solid #ddd",
              padding:
                "20px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
            }}
          >
            <h3>
              📅 여행 일정
            </h3>

            {result.plan?.schedules?.map(
              (
                item: any,
                index: number,
              ) => (
                <div
                  key={
                    index
                  }
                  style={{
                    marginBottom:
                      "20px",
                  }}
                >
                  <h4>
                    {
                      item.date
                    }{" "}
                    -{" "}
                    {
                      item.place
                    }
                  </h4>

                  <p>
                    {
                      item.description
                    }
                  </p>
                </div>
              ),
            )}
          </div>

          {/* 예상 비용 */}

          <div
            style={{
              border:
                "1px solid #ddd",
              padding:
                "20px",
              borderRadius:
                "10px",
            }}
          >
            <h3>
              💰 예상 비용
            </h3>

            {result.plan?.expenses?.map(
              (
                item: any,
                index: number,
              ) => (
                <p
                  key={
                    index
                  }
                >
                  {
                    item.category
                  }
                  :{" "}
                  {Number(
                    item.amount,
                  ).toLocaleString()}
                  원
                </p>
              ),
            )}
          </div>
        </section>
      )}
    </main>
  );
}