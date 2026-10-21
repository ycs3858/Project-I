"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function BoardWritePage() {
    const router = useRouter();

    // 로그인한 사용자 이름
    const [username, setUsername] = useState("");

    // 입력할 게시글 데이터
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 화면 상태
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    // 로그인 확인
    useEffect(() => {
        const checkLogin = async () => {
            const accessToken = localStorage.getItem("accessToken");

            // 로그인을 하지 않은 경우
            if (!accessToken) {
                router.replace("/login");
                return;
            }

            try {
                const response = await fetch (
                    "http://localhost:3001/auth/me",
                    {
                        method : "GET",
                        headers : {
                            Authorization : `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    localStorage.removeItem("accessToken");
                    router.replace("/login");
                    return;
                }

                const data = await response.json();
                setUsername(data.username);
                setLoading(false);
                
            } catch (err) {
                console.error("로그인 확인 오류 : ", err);
                setError ("로그인 상태를 확인할 수 없습니다. 서버 연결을 확인해주세요.")
                setLoading(false);
            }
        };

        checkLogin();
    }, [router]);


    // 게시글 작성
    const handleSubmit = async (event : FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!title.trim() || !content.trim()) {
            setError("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            router.replace("/login");
            return;
        }

        setSubmitting(true);

        try {
            const response = await fetch (
                "http://localhost:3001/board",
                {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },

                    body : JSON.stringify({
                        title : title.trim(),
                        content : content.trim(),
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem("accessToken");
                    router.replace("/login");
                    return;
                }

                throw new Error (
                    Array.isArray(data?.message) ? data.message.json(", ") : data?.message || "게시글 작성에 실패하였습니다."
                );
            }

            // 작성 성공 시 게시판으로 이동
            router.push("/board");

        } catch (err) {
            console.error("게시글 작성 오류 : ", err);

            setError(
                err instanceof Error ? err.message : "게시글 작성에 실패했습니다."
            );

        } finally {
            setSubmitting(false);
        }
    };


    // 로그인 확인 중
    if (loading) {
        return (
            <main className = "flex min-h-screen items-center justify-center bg-gray-100">
                <p className = "text-gray-600">
                    로그인 확인중...
                </p>
            </main>
        );
    }


    return (

        <main className = "min-h-screen bg-gray-100">

            {/* 상단 헤더 */}
            <header className = "flex h-20 items-center justify-between border-b bg-white px-8">

                <h1
                    className = "cursor-pointer text-3xl font-bold tracking-tight text-blue-600"
                    onClick={() => router.push("/home")}
                >
                    PROJECT-I
                </h1>

                <span className = "text-lg font-semibold text-gray-700">
                    {username}님
                </span>

            </header>

            {/* 메뉴바 */}
            <nav className = "border-b bg-white px-8">
                <div className = "flex h-16 items-center gap-8">

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
                        onClick={() => router.push("/board")}
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


            {/* 게시글 작성 본문 */}
            <section className = "px-8 py-10">

                <div className = "mx-auto max-w-4xl">
                    <h2 className = "text-3xl font-bold text-gray-800">
                        게시글 작성
                    </h2>

                    <p className = "mt-2 mb-6 text-gray-500">
                        제목과 내용을 입력해주세요.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className = "rounded-xl bg-white p-8 shadow-md"
                    >

                        {/* 제목 */}
                        <div className = "mb-6">
                            <label
                                htmlFor="title"
                                className="mb-2 block font-semibold text-gray-700"
                            >
                                제목
                            </label>

                            <input
                                id = "title"
                                type="text"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                placeholder="제목을 입력하세요."
                                maxLength={200}
                                required
                                className = "w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* 내용 */}
                        <div className = "mb-6">
                            <label
                                htmlFor="content"
                                className = "mb-2 block font-semibold text-gray-700"
                            >
                                내용
                            </label>

                            <textarea
                                id="content"
                                value={content}
                                onChange={(event) => setContent(event.target.value)}
                                placeholder="내용을 입력하세요."
                                rows={12}
                                required
                                className = "w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
                            />

                        </div>

                        {/* 오류 메시지 */}
                        {error && (<p className = "mb-4 text-sm text-red-500">{error}</p>)}

                        {/* 버튼 */}
                        <div className = "flex justify-end gap-3">
                            <button
                                type = "button"
                                className = "rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                                onClick={() => router.push("/board")}
                            >
                                취소
                            </button>

                            <button
                                type = "submit"
                                className = "rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                                disabled={submitting}
                            >
                                {submitting ? "등록 중..." : "등록"}
                            </button>
                        </div>

                    </form>

                </div>
            </section>

        </main>
    )

}