"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignupPage() {

    // 라우터 사용
    const router = useRouter();

    // ID 입력
    const [email, setEmail] = useState("");

    // 사용자 이름 입력
    const [username, setUsername] = useState("");

    // PW 입력
    const [password, setPassword] = useState("");



    // 회원가입 api 호출
    const handleSignup = async () => {
        // 입력값이 없는 경우
        if(!email || !password || !username){
            alert("회원 정보를 입력해주세요.");
            return;
        }

        //NestJS 백엔드에 회원가입 요청
        const response = await fetch('http://localhost:3001/auth/signup',{
            
            // 회원가입 API는 POST 방식
            method: 'POST',

            // JSON 형태라는걸 알려주기
            headers : {
                'Content-type' : 'application/json',
            },

            // 백엔드 CreateAuthDTO에 맞는 데이터 전송
            body : JSON.stringify({
                email: email,
                username: username,
                password: password,
            }),
        });


        // 서버 응답을 JSON 형태로 변환
        const data = await response.json();

        // 회원가입 실패 시
        if(!response.ok) {
            alert(data.message);
            return;
        }
        
        // 회원가입 성공 시
        alert("회원가입이 완료되었습니다.");

        // 응답확인
        console.log(data);

        // 회원가입 성공 시
        router.push("/login")
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-96 rounded-xl bg-white p-8 shadow-lg">

                {/* 제목 */}
                <h1 className="mb-6 text-center text-2xl font-bold">
                    회원가입
                </h1>

                {/* 이메일 입력 */}
                <input
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    type="email"
                    placeholder="이메일(ID)을 입력하세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* 사용자 이름 입력 */}
                <input
                    className="mb-4 w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    type="text"
                    placeholder="사용자 이름을 입력하세요."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                {/* 비밀번호 입력 */}
                <input
                    className="mb-6 w-full rounded-md border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    type="password"
                    placeholder="비밀번호를 입력하세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <div className="flex gap-3">

                    {/* 회원가입 버튼 */}
                    <button
                        className="flex-1 rounded-md bg-blue-500 py-3 text-white hover:bg-blue-600"
                        type="button"
                        onClick={handleSignup}
                    >
                        회원가입
                    </button>

                    {/* 돌아가기 버튼 */}
                    <button
                        className="flex-1 rounded-md bg-gray-500 py-3 text-white hover:bg-gray-600"
                        type="button"
                        onClick={() => router.push("/login")}
                    >
                        돌아가기
                    </button>
                </div>
            </div>
        </main>
    );
}