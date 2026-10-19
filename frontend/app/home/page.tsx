"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {

    // 페이지 이동을 위한 Router
    const router = useRouter();

    // 인증 확인 중인지 확인
    const [loading, setLoading] = useState(true);

    // 로그아웃
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        router.replace("/login")
    }

    // 로그인한 사용자 이름 
    const [username, setUsername] = useState("");

    // 로그인 확인
    useEffect(() => {
        const checkLogin = async () => {
            // localStorage에서 accessToken 가져오기
            const accessToken = localStorage.getItem("accessToken");

            // 토큰이 없는 경우
            if (!accessToken) {
                router.replace("/login");
                return;
            }

            try {
                // 백엔드에 현재 사용자 정보 요청
                const response = await fetch("http://localhost:3001/auth/me", {
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

                // 사용자 이름
                setUsername(data.username);

                // 인증 확인 완료
                setLoading(false);

            } catch (error) {
                // 서버와 연결할 수 없는 경우
                console.error(error);
                router.replace("/login");
            }
        };

        checkLogin();
    }, [router]);

    // 인증 확인 중
    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-gray-100">
                <h1 className="mb-6 text-center text-2xl font-bold">
                    로그인 확인 중...
                </h1>
            </main>
        );
    }

    // 인증된 사용자만 표시
    return (
        <main className = "min-h-screen bg-gr-100">

            {/* 상단 헤더 */}
            <header className = "flex h-20 items-center justify-between border-b bg-white px-8">

                <h1 className = "text-3xl font-bold tracking-tight text-blue-600">
                    PROJECT-I
                </h1>

                {/* 사용자 영역 */}
                <div className="flex items-center gap-4">
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

                    {/* 로그아웃 버튼 */}
                    <button
                        type = "button"
                        className = "flex h-11 w-11 items-center justify-center rounded-full bg-gray-200 text-xl text-gray-600 hover:bg-gray-300"
                        onClick={handleLogout}
                    >
                        🚪
                    </button>
                </div>

            </header>

            {/* 메뉴바 */}
            <nav className = "border-b bg-white px-8">

                <div className = "flex h-16 items-center gap-8">

                    <button
                        type = "button"
                        className = "h-full border-b-4 border-blue-500 px-3 font-semibold text-blue-600"
                    >
                        홈
                    </button>

                    <button
                        type = "button"
                        className = "h-full px-3 font-semibold text-gray-500 hover:text-blue-600"
                        onClick={() => router.push("/board")}
                    >
                        게시판
                    </button>

                    <button
                        type = "button"
                        disabled
                        className = "h-full cursor-not-allowed px-3 font-semibold text-gray-300"
                    >
                        준비중
                    </button>

                    <button
                        type = "button"
                        disabled
                        className = "h-full cursor-not-allowed px-3 font-semibold text-gray-300"
                    >
                        준비중
                    </button>

                </div>

            </nav>


            {/* 메인 영역 */}
            <section className = "flex flex-col items-center px-6 py-20">

                {/* 환영 문구 */}
                <div className = "mb-14 text-center">

                    <h2 className = "text-2xl font-bold text-gray-800">
                        안녕하세요, {" "}
                        <span className = "text-blue-600">
                            {username}님!
                        </span>
                    </h2>

                    <p className = "mt-4 text-xl text-gray-500">
                        PROJECT-I에 오신 것을 환영합니다.
                    </p>

                </div>


                {/* 기능 카드 */}
                <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">

                    {/* 게시판 카드 */}
                    <div className="rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">

                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
                            📝
                        </div>

                        <h3 className = "text-2xl font-bold text-gray-800">
                            게시판
                        </h3>

                        <p className = "mt-3 text-gray-500">
                            게시판을 조회하고 작성할 수 있습니다.
                        </p>

                        <button
                            type = "button"
                            className = "mt-8 w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                            onClick={() => router.push("/board")}
                        >
                            바로가기 →
                        </button>
                    </div>

                    {/* 내 정보 카드 */}
                    <div className="rounded-2xl bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">

                        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl">
                            👤
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800">
                            내 정보
                        </h3>

                        <p className="mt-3 text-gray-500">
                            회원정보를 확인할 수 있습니다.
                        </p>

                        <button
                            type = "button"
                            className="mt-8 w-full rounded-lg bg-gray-400 py-3 font-semibold text-white transition hover:bg-gray-500"
                        >
                            바로가기 →
                        </button>

                    </div>

                </div>

                {/* 로그아웃 */}
                <button
                    type = "button"
                    className="mt-12 rounded-lg px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-200"
                    onClick={handleLogout}
                >
                    LOGOUT
                </button>

            </section>

        </main>
    );
}