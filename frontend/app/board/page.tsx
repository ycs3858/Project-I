"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function BoardPage() {

    // 페이지 이동을 위한 라우터
    const router = useRouter();

    // 인증 확인 중
    const [loading, setLoading] = useState(true);

    // 로그인한 사용자 이름 확인
    const [username, setUsername] = useState("");

    // 검색어
    const [search, setSearch] = useState("");

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        router.replace("/login");
    };

    
    // 로그인 여부 확인
    useEffect(() => {
        const checkLogin = async () => {

            // LocalStorage에서 accessToken 가져오기
            const accessToken = localStorage.getItem("accessToken");

            // 토큰이 없는 경우
            if (!accessToken) {
                router.replace("/login");
                return;
            }

            try {

                // 백엔드에 현재 사용자 정보 요청
                const response = await fetch ("http://localhost:3001/auth/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // JWT 인증 실패
                if (!response.ok) {
                    localStorage.removeItem("accessToken");
                    router.replace("/login");
                    return;
                }

                // 사용자 정보 확인
                const data = await response.json();

                console.log(data);

                // 사용자 이름 저장
                setUsername(data.username);

                // 인증 완료
                setLoading(false);

            } catch (error) {
                
                console.error(error);
                router.replace("/login");

            }
        };

        checkLogin();
    }, [router]);

    // 인증 확인 중
    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-gray-100">
                <h1 className="text-2xl font-bold text-gray-700">
                    로그인 확인 중...
                </h1>
            </main>
        );
    }


    return (
        <main className="min-h-screen bg-gray-100">
            
            {/* 상단 헤더 */}
            <header className = "flex h-20 items-center justify-between border-b bg-white px-8">

                <h1
                    className = "cursor-pointer text-3xl font-bold tracking-tight text-blue-600"
                    onClick={() => router.push("/home")}
                >
                    PROJECT-I
                </h1>

                {/* 사용자 영역 */}
                <div className = "flex items-center gap-4">
                    <span className = "text-lg font-semibold text-gray-700">
                        {username}님
                    </span>

                    {/* 프로필 버튼 */}
                    <button
                        type = "button"
                        className = "flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-xl text-gray-600 hover:bg-gray-300"
                    >
                        👤
                    </button>
                </div>

            </header>

            {/* 메뉴바 */}
            <nav className="border-b bg-white px-8">

                <div className="flex h-16 items-center gap-8">

                    {/* 홈 */}
                    <button
                        type = "button"
                        className = "h-full px-3 font-semibold text-gray-500 hover:text-blue-600"
                        onClick={() => router.push("/home")}
                    >
                        홈
                    </button>

                    {/* 게시판 */}
                    <button
                        type = "button"
                        className = "h-full border-b-4 border-blue-500 px-3 font-semibold text-blue-600"
                    >
                        게시판
                    </button>

                    {/* 준비중 */}
                    <button
                        type = "button"
                        className = "h-full cursor-not-allowed px-3 font-semibold text-gray-300"
                        disabled
                    >
                        준비중
                    </button>

                    {/* 준비중 */}
                    <button
                        type = "button"
                        className = "h-full cursor-not-allowed px-3 font-semibold text-gray-300"
                        disabled
                    >
                        준비중
                    </button>

                </div>

            </nav>

            {/* 본문 */}
            <section className = "px-8 py-10">

                <div className = "mx-auto max-w-6xl">

                    {/* 게시판 제목 영역 */}
                    <div className = "mb-6 flex items-end justify-between">

                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">
                                게시판
                            </h2>

                            <p className="mt-2 text-gray-500">
                                게시판입니다.
                            </p>
                        </div>

                        {/* 오른쪽 버튼 */}
                        <div className = "flex gap-3">

                            {/* 글쓰기 */}
                            <button
                                type = "button"
                                className = "rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                                onClick={() => router.push("/board/write")}
                            >
                                ✎ 글쓰기
                            </button>

                            {/* 버튼 준비중 */}
                            <button
                                type = "button"
                                className = "rounded-lg bg-blue-100 px-5 py-3 font-semibold text-blue-600 transition hover:bg-blue-300"
                                disabled
                            >
                                준비중...
                            </button>

                        </div>

                    </div>

                    {/* 게시판 카드 */}
                    <div className = "rounded-xl bg-white p-6 shadow-md">
                        
                        {/* 검색 영역 */}
                        <div className = "mb-6 flex gap-3">

                            {/* 검색 조건 */}
                            <select className = "rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none focus:border-blue-500">
                                <option>제목</option>
                                <option>작성자</option>
                            </select>

                            {/* 검색창 */}
                            <div className = "flex flex-1 gap-3">

                                <input
                                    type = "text"
                                    placeholder="검색어를 입력하세요."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className = "w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />

                                <button
                                    type = "button"
                                    className = "rounded-lg bg-gray-100 px-5 text-lg hover:bg-gray-200"
                                >
                                    🔍
                                </button>

                            </div>

                        </div>

                        {/* 게시글 목록 */}
                        <div className = "overflow-hidden rounded-lg border border-gray-200">

                            {/* 테이블 헤더 */}
                            <div className = "grid grid-cols-[80px_1fr_140px_120px_80px] bg-gray-50 px-5 py-4 text-center text-sm font-semibold text-gray-600">

                                <div>번호</div>
                                <div>제목</div>
                                <div>작성자</div>
                                <div>작성일</div>
                                <div>조회수</div>

                            </div>

                        </div>

                    </div>

                </div>
            </section>

        </main>
    )
}