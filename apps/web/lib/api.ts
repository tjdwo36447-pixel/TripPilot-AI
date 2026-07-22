const API_URL =
  process.env.NEXT_PUBLIC_API_URL;

// ======================================
// 로그인
// ======================================

export async function loginUser(data: {
  email: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "로그인 실패",
    );
  }

  return result;
}

// ======================================
// 회원가입
// ======================================

export async function registerUser(data: {
  email: string;
  nickname: string;
  password: string;
}) {
  const response = await fetch(
    `${API_URL}/auth/register`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(data),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "회원가입 실패",
    );
  }

  return result;
}

// ======================================
// AI 여행 생성
// POST /ai
// ======================================

export async function createTrip(
  data: any,
  token: string,
) {
  const response = await fetch(
    `${API_URL}/ai`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "여행 생성 실패",
    );
  }

  return result;
}

// ======================================
// 여행 목록 조회
// GET /trips
// ======================================

export async function getTrips(
  token: string,
) {
  const response = await fetch(
    `${API_URL}/trips`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "여행 목록 조회 실패",
    );
  }

  return result;
}

// ======================================
// 여행 상세 조회
// GET /trips/:id
// ======================================

export async function getTrip(
  id: string,
  token: string,
) {
  const response = await fetch(
    `${API_URL}/trips/${id}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "여행 상세 조회 실패",
    );
  }

  return result;
}

// ======================================
// 여행 수정
// PATCH /trips/:id
// ======================================

export async function updateTrip(
  id: string,
  data: {
    title: string;
    startDate: string;
    endDate: string;
  },
  token: string,
) {
  const response = await fetch(
    `${API_URL}/trips/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "여행 수정 실패",
    );
  }

  return result;
}

// ======================================
// 여행 삭제
// DELETE /trips/:id
// ======================================

export async function deleteTrip(
  id: string,
  token: string,
) {
  const response = await fetch(
    `${API_URL}/trips/${id}`,
    {
      method: "DELETE",

      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "여행 삭제 실패",
    );
  }

  return result;
}

// ======================================
// 항공편 검색
// GET /flights/search
// ======================================

export async function searchFlights(
  departure: string,
  arrival: string,
) {
  const response = await fetch(
    `${API_URL}/flights/search` +
      `?departure=${encodeURIComponent(
        departure,
      )}` +
      `&arrival=${encodeURIComponent(
        arrival,
      )}`,
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "항공편 검색에 실패했습니다.",
    );
  }

  return result;
}

// ======================================
// 항공편 저장
// POST /flights/save
// ======================================

export async function saveFlight(
  data: {
    tripId: string;
    airline: string;
    departure: string;
    arrival: string;
    price: number;
    provider?: string;
    externalOfferId?: string;
    departureAt?: string;
    arrivalAt?: string;
  },
  token: string,
) {
  const response = await fetch(
    `${API_URL}/flights/save`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(data),
    },
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "항공편 저장에 실패했습니다.",
    );
  }

  return result;
}