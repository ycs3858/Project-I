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
        <main className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-96 rounded-xl bg-white p-8 shadow-lg">

                <h1 className="mb-6 text-center text-2xl font-bold">
                    홈
                </h1>

                <div className="flex gap-3">
                    <button
                        className="flex-1 rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600"
                        type="button"
                        onClick={handleLogout}
                    >
                        로그아웃
                    </button>
                </div>

            </div>
        </main>
    );
}