"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getTrip,
  deleteTrip,
  updateTrip,
} from "@/lib/api";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();

  const tripId = params.id as string;

  const [trip, setTrip] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  // ======================================
  // 여행 정보 불러오기
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
        const tripResult =
          await getTrip(
            tripId,
            token,
          );

        setTrip(tripResult);

        setTitle(
          tripResult.title || "",
        );

        setStartDate(
          tripResult.startDate
            ? tripResult.startDate.split(
                "T",
              )[0]
            : "",
        );

        setEndDate(
          tripResult.endDate
            ? tripResult.endDate.split(
                "T",
              )[0]
            : "",
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tripId, router]);

  // ======================================
  // 여행 삭제
  // ======================================

  async function handleDelete() {
    const confirmed =
      window.confirm(
        "정말 이 여행을 삭제하시겠습니까?",
      );

    if (!confirmed) {
      return;
    }

    const token =
      localStorage.getItem(
        "accessToken",
      );

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      await deleteTrip(
        tripId,
        token,
      );

      alert(
        "여행이 삭제되었습니다.",
      );

      router.push("/trips");
    } catch (err: any) {
      alert(err.message);
    }
  }

  // ======================================
  // 여행 정보 수정
  // ======================================

  async function handleUpdate() {
    const token =
      localStorage.getItem(
        "accessToken",
      );

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const updatedTrip =
        await updateTrip(
          tripId,
          {
            title,
            startDate,
            endDate,
          },
          token,
        );

      setTrip({
        ...trip,
        ...updatedTrip,
      });

      setIsEditing(false);

      alert(
        "여행 정보가 수정되었습니다.",
      );
    } catch (err: any) {
      alert(err.message);
    }
  }

  // ======================================
  // Google Flights로 이동
  // ======================================

  function handleFlightBooking(
    flight: any,
  ) {
    if (!trip) {
      return;
    }

    const departureCode =
      flight.departure
        ?.trim()
        .toUpperCase();

    const arrivalCode =
      flight.arrival
        ?.trim()
        .toUpperCase();

    if (
      !departureCode ||
      !arrivalCode
    ) {
      alert(
        "항공편 출발지 또는 도착지 정보가 없습니다.",
      );

      return;
    }

    const startDate =
      trip.startDate
        ? new Date(
            trip.startDate,
          )
            .toISOString()
            .split("T")[0]
        : "";

    const searchQuery =
      [
        "Flights",
        "from",
        departureCode,
        "to",
        arrivalCode,
        startDate
          ? `on ${startDate}`
          : "",
      ]
        .filter(Boolean)
        .join(" ");

    const googleFlightsUrl =
      `https://kr.trip.com/?Allianceid=9435700&SID=325339148&trip_sub1=&trip_sub3=D18821294` +
      encodeURIComponent(
        searchQuery,
      );

    const confirmed =
      window.confirm(
        `외부 항공권 검색 사이트로 이동합니다.\n\n` +
          `${departureCode} → ${arrivalCode}\n` +
          `${startDate || "여행 날짜"}\n\n` +
          `TripPilot에서는 결제하지 않으며,\n` +
          `외부 사이트에서 직접 예약 및 결제합니다.`,
      );

    if (!confirmed) {
      return;
    }

    window.open(
      googleFlightsUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  // ======================================
  // Booking.com으로 이동
  // ======================================

  function handleHotelBooking(
    hotel: any,
  ) {
    if (!trip) {
      return;
    }

    const hotelName =
      hotel.name || "";

    const destination =
      trip.title || hotelName;

    const checkin =
      trip.startDate
        ? new Date(
            trip.startDate,
          )
            .toISOString()
            .split("T")[0]
        : "";

    const checkout =
      trip.endDate
        ? new Date(
            trip.endDate,
          )
            .toISOString()
            .split("T")[0]
        : "";

    const params =
      new URLSearchParams();

    params.set(
      "ss",
      destination,
    );

    if (checkin) {
      params.set(
        "checkin",
        checkin,
      );
    }

    if (checkout) {
      params.set(
        "checkout",
        checkout,
      );
    }

    params.set(
      "group_adults",
      "1",
    );

    params.set(
      "no_rooms",
      "1",
    );

    const bookingUrl =
      `https://kr.trip.com/?Allianceid=9435700&SID=325339148&trip_sub1=&trip_sub3=D18821294`;

    const confirmed =
      window.confirm(
        `외부 숙소 예약 사이트로 이동합니다.\n\n` +
          `숙소: ${hotelName}\n` +
          `체크인: ${checkin || "-"}\n` +
          `체크아웃: ${checkout || "-"}\n\n` +
          `TripPilot에서는 결제하지 않으며,\n` +
          `외부 사이트에서 직접 예약 및 결제합니다.`,
      );

    if (!confirmed) {
      return;
    }

    window.open(
      bookingUrl,
      "_blank",
      "noopener,noreferrer",
    );
  }

  // ======================================
  // Loading
  // ======================================

  if (loading) {
    return (
      <main
        style={{
          padding: "40px",
        }}
      >
        <h1>
          여행 정보를 불러오는 중...
        </h1>
      </main>
    );
  }

  // ======================================
  // Error
  // ======================================

  if (error) {
    return (
      <main
        style={{
          padding: "40px",
        }}
      >
        <p
          style={{
            color: "red",
          }}
        >
          오류: {error}
        </p>
      </main>
    );
  }

  // ======================================
  // Trip 없음
  // ======================================

  if (!trip) {
    return (
      <main
        style={{
          padding: "40px",
        }}
      >
        <h1>
          여행을 찾을 수 없습니다.
        </h1>
      </main>
    );
  }

  // ======================================
  // 총 비용
  // ======================================

  const totalExpense =
    trip.expenses?.reduce(
      (
        total: number,
        expense: any,
      ) =>
        total +
        Number(
          expense.amount,
        ),
      0,
    ) ?? 0;

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* ================================= */}
      {/* 뒤로가기 */}
      {/* ================================= */}

      <button
        onClick={() =>
          router.push("/trips")
        }
        style={{
          marginBottom: "20px",
          padding: "10px 16px",
          cursor: "pointer",
        }}
      >
        ← 내 여행 목록
      </button>

      {/* ================================= */}
      {/* 제목 */}
      {/* ================================= */}

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
          🧳 {trip.title}
        </h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={() =>
              setIsEditing(
                !isEditing,
              )
            }
            style={{
              padding: "8px 14px",
              cursor: "pointer",
            }}
          >
            {isEditing
              ? "취소"
              : "수정"}
          </button>

          <button
            onClick={handleDelete}
            style={{
              padding: "8px 14px",
              color: "red",
              cursor: "pointer",
            }}
          >
            삭제
          </button>
        </div>
      </div>

      {/* ================================= */}
      {/* 여행 정보 */}
      {/* ================================= */}

      {isEditing ? (
        <section
          style={{
            border:
              "1px solid #ddd",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "30px",
          }}
        >
          <h2>
            ✏️ 여행 정보 수정
          </h2>

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <label>
              여행 제목
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value,
                )
              }
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginTop: "8px",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "15px",
            }}
          >
            <label>
              시작일
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value,
                )
              }
              style={{
                display: "block",
                padding: "10px",
                marginTop: "8px",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "15px",
            }}
          >
            <label>
              종료일
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value,
                )
              }
              style={{
                display: "block",
                padding: "10px",
                marginTop: "8px",
              }}
            />
          </div>

          <button
            onClick={handleUpdate}
            style={{
              marginTop: "20px",
              padding: "12px 20px",
              cursor: "pointer",
            }}
          >
            저장
          </button>
        </section>
      ) : (
        <section
          style={{
            border:
              "1px solid #ddd",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "30px",
          }}
        >
          <p>
            📅 시작일:{" "}
            {new Date(
              trip.startDate,
            ).toLocaleDateString(
              "ko-KR",
            )}
          </p>

          <p>
            📅 종료일:{" "}
            {new Date(
              trip.endDate,
            ).toLocaleDateString(
              "ko-KR",
            )}
          </p>

          <p>
            💰 총 예상 비용:{" "}
            <strong>
              {totalExpense.toLocaleString()}
              원
            </strong>
          </p>
        </section>
      )}

      {/* ================================= */}
      {/* 여행 일정 */}
      {/* ================================= */}

      <section
        style={{
          marginBottom: "30px",
        }}
      >
        <h2>
          📅 여행 일정
        </h2>

        {!trip.schedules ||
        trip.schedules.length ===
          0 ? (
          <p>
            등록된 일정이 없습니다.
          </p>
        ) : (
          trip.schedules.map(
            (schedule: any) => (
              <div
                key={schedule.id}
                style={{
                  border:
                    "1px solid #eee",
                  borderRadius: "10px",
                  padding: "16px",
                  marginTop: "12px",
                }}
              >
                <h3>
                  {schedule.place}
                </h3>

                <p>
                  {
                    schedule.description
                  }
                </p>
              </div>
            ),
          )
        )}
      </section>

      {/* ================================= */}
      {/* 항공권 */}
      {/* ================================= */}

      <section
        style={{
          marginBottom: "30px",
        }}
      >
        <h2>
          ✈️ 항공권
        </h2>

        {!trip.flights ||
        trip.flights.length ===
          0 ? (
          <div
            style={{
              border:
                "1px solid #eee",
              borderRadius: "10px",
              padding: "20px",
              marginTop: "15px",
            }}
          >
            <p>
              아직 저장된 항공편이
              없습니다.
            </p>
          </div>
        ) : (
          trip.flights.map(
            (flight: any) => {
              const departureTime =
                flight.departureAt
                  ? new Date(
                      flight.departureAt,
                    )
                  : null;

              const arrivalTime =
                flight.arrivalAt
                  ? new Date(
                      flight.arrivalAt,
                    )
                  : null;

              return (
                <div
                  key={flight.id}
                  style={{
                    border:
                      "1px solid #eee",
                    borderRadius: "14px",
                    padding: "20px",
                    marginTop: "15px",
                  }}
                >
                  {/* 항공사 */}
                  <h3>
                    ✈️{" "}
                    {flight.airline ||
                      "항공사 정보 없음"}
                  </h3>

                  {/* 노선 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      margin:
                        "20px 0",
                      fontSize: "22px",
                      fontWeight: "bold",
                    }}
                  >
                    <span>
                      {flight.departure}
                    </span>

                    <span>
                      →
                    </span>

                    <span>
                      {flight.arrival}
                    </span>
                  </div>

                  {/* 출발 */}
                  <div
                    style={{
                      marginTop: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      🛫 출발
                    </p>

                    <strong>
                      {departureTime
                        ? departureTime.toLocaleString(
                            "ko-KR",
                          )
                        : "시간 정보 없음"}
                    </strong>
                  </div>

                  {/* 도착 */}
                  <div
                    style={{
                      marginTop: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#666",
                      }}
                    >
                      🛬 도착
                    </p>

                    <strong>
                      {arrivalTime
                        ? arrivalTime.toLocaleString(
                            "ko-KR",
                          )
                        : "시간 정보 없음"}
                    </strong>
                  </div>

                  {/* 예약 버튼 */}
                  <button
                    onClick={() =>
                      handleFlightBooking(
                        flight,
                      )
                    }
                    style={{
                      marginTop: "20px",
                      padding:
                        "10px 16px",
                      cursor:
                        "pointer",
                    }}
                  >
                    ✈️ 항공권 예약하러 가기
                  </button>
                </div>
              );
            },
          )
        )}
      </section>

      {/* ================================= */}
      {/* 숙소 */}
      {/* ================================= */}

      <section
        style={{
          marginBottom: "30px",
        }}
      >
        <h2>
          🏨 숙소
        </h2>

        {!trip.hotels ||
        trip.hotels.length ===
          0 ? (
          <p>
            등록된 숙소가
            없습니다.
          </p>
        ) : (
          trip.hotels.map(
            (hotel: any) => {
              const hotelPrice =
                Number(
                  hotel.price,
                );

              return (
                <div
                  key={hotel.id}
                  style={{
                    border:
                      "1px solid #eee",
                    borderRadius: "10px",
                    padding: "16px",
                    marginTop: "12px",
                  }}
                >
                  <h3>
                    🏨{" "}
                    {hotel.name}
                  </h3>

                  <p>
                    💰{" "}
                    {hotelPrice.toLocaleString()}
                    원
                  </p>

                  <button
                    onClick={() =>
                      handleHotelBooking(
                        hotel,
                      )
                    }
                    style={{
                      marginTop: "10px",
                      padding:
                        "10px 16px",
                      cursor:
                        "pointer",
                    }}
                  >
                    🏨 숙소 예약하러 가기
                  </button>
                </div>
              );
            },
          )
        )}
      </section>

      {/* ================================= */}
      {/* 비용 내역 */}
      {/* ================================= */}

      <section
        style={{
          marginBottom: "30px",
        }}
      >
        <h2>
          💰 비용 내역
        </h2>

        {!trip.expenses ||
        trip.expenses.length ===
          0 ? (
          <p>
            등록된 비용이
            없습니다.
          </p>
        ) : (
          trip.expenses.map(
            (expense: any) => {
              const expenseAmount =
                Number(
                  expense.amount,
                );

              return (
                <div
                  key={expense.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    padding: "12px 0",
                    borderBottom:
                      "1px solid #eee",
                  }}
                >
                  <span>
                    {
                      expense.category
                    }
                  </span>

                  <strong>
                    {expenseAmount.toLocaleString()}
                    원
                  </strong>
                </div>
              );
            },
          )
        )}
      </section>
    </main>
  );
}