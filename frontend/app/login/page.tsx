"use client";

import { useState } from "react";


export default function LoginPage() {

    // 이메일 입력 값
    const [email, setEmail] = useState("");

    // 비밀번호 입력 값
    const [password, setPassword] = useState("");

    // 테스트용 색깔 변경
    const [textColor, setTextColor] = useState("black");

    const changeTextColor = () => {
        const colors = [ "red", "blue", "green" ];

        const randomIndex = Math.floor(Math.random() * colors.length);

        setTextColor(colors[randomIndex]);
    }


    return (
        <main>
            <h1 style={{ color: textColor }}>로그인</h1>

            {/* 이메일 입력 */}
            <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            {/* 비밀번호 입력 */}
            <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* 로그인 버튼 */}
            <button type="button"
            onClick={changeTextColor}>
                로그인
            </button>
        </main>
    );
}