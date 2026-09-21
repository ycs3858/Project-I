"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginPage() {

    const router = useRouter();

    return(
        <main className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="w-96 rounded-xl bg-white p-8 shadow-lg">

                {/* 제목 */}
                <h1 className="mb-6 text-center text-2xl font-bold">
                    로그인 성공
                </h1>

                {/* 로그인 페이지 이동 버튼 */}
                <button
                    className="rounded-md bg-gray-500 py-3 text-white hover:bg-gray-600"
                    type="button"
                    onClick={() => router.push("/login")}
                >
                    로그아웃
                </button>

            </div>
        </main>
    );
}