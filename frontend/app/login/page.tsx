"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {

    // 라우터 사용
    const router = useRouter();

    // 이메일 입력 값
    const [email, setEmail] = useState("");

    // 비밀번호 입력 값
    const [password, setPassword] = useState("");


    // 로그인 함수
    const handleLogin = async () => {
        // 입력 값이 없을 경우
        if(!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        // NestJS 백엔드에 로그인 요청
        const response = await fetch('http://localhost:3001/auth/login', {
            // 로그인 API는 POST 방식
            method : 'POST',

            // JSON 형태의 데이터를 보내는 것을 서버에 알려주는 내용
            headers : {
                'Content-Type' : 'application/json',
            },

            // 백엔드 LoginAuthDto에 맞는 데이터 전송
            body : JSON.stringify({
                email: email,
                password: password,
            }),
        });

        // 서버 응답을 JSON 형태로 변환
        const data = await response.json();

        // 로그인 성공 여부 확인
        if (!response.ok) {
            alert(data.message);
            return;
        }

        // accessToken 저장
        localStorage.setItem("accessToken", data.accessToken);

        // 응답 확인
        console.log(data);

        // 성공 시 홈으로 이동
        router.push("/home");
    };


    return(
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-96 rounded-xl bg-white p-8 shadow-lg">

                {/* 제목 */}
                <h1 className="mb-6 text-center text-2xl font-bold">
                    회원가입
                </h1>

                {/* ID 입력 */}
                <input
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    type="email"
                    placeholder="아이디(ID)을 입력하세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* PW 입력 */}
                <input
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    type="password"
                    placeholder="비밀번호(PW)을 입력하세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {/* 버튼 */}
                <div className="flex gap-3">

                    {/* 로그인 버튼 */}
                    <button
                        className="flex-1 rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600"
                        type="button"
                        onClick={handleLogin}
                    >
                        로그인
                    </button>

                    {/* 회원가입 */}
                    <button
                        className="flex-1 rounded-md bg-gray-500 py-3 text-white hover:bg-gray-600"
                        type="button"
                        onClick={() => router.push("/signup")}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </main>
    );
}