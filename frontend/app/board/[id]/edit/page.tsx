"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import Header from "@/components/Header";
import MenuBar from "@/components/MenuBar";


type Post = {
    id : number;
    title : string;
    content : string;
    authorId : number;
    viewCount : number;
    createdAt : string;
    updatedAt : string;
    author?: {username : string;};
};

export default function BoardEditPage() {
    const router = useRouter();
    const {id} = useParams<{id : string}>();

    // 로그인 사용자 이름
    const [username, setUsername] = useState("");

    // 게시글 데이터
    const [post, setPost] = useState<Post | null>(null);

    // 수정할 제목과 내용
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    // 화면 상태
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");


    // 로그인 확인 및 기존 게시글 조회
    useEffect(() => {
        const fetchData = async () => {
            const accessToken = localStorage.getItem("accessToken");

            // 비회원은 수정 불가
            if (!accessToken) {
                router.replace("/login")
                return;
            }

            try {
                // 로그인 사용자 확인
                const userResponse = await fetch (
                    "http://localhost:3001/auth/me",
                    {
                        method : "GET",
                        headers : {
                            Authorization : `Bearer ${accessToken}`,
                        },
                    }
                );

                // 토큰이 유효하지 않은 경우
                if (!userResponse.ok) {
                    localStorage.removeItem("accessToken");
                    router.replace("/login");
                    return;
                }

                const userData = await userResponse.json();

                // 사용자 ID 확인
                const rawUserId = userData.id ?? userData.sub;
                const userId = Number(rawUserId);

                if (!Number.isSafeInteger(userId) || userId <= 0) {
                    throw new Error ("사용자 정보를 확인할 수 없습니다.");
                }

                setUsername(userData.username || "");

                // 기존 게시글 조회
                const postResponse = await fetch (
                    `http://localhost:3001/board/${id}`
                );

                if (!postResponse.ok) {
                    throw new Error("게시글을 불러오지 못했습니다.");
                }

                const postData : Post | null = await postResponse.json();

                if (!postData) {
                    throw new Error("게시글을 찾을 수 없습니다.");
                }


                // 작성자가 본인인지 확인
                if (userId !== Number(postData.authorId)) {
                    throw new Error ("본인이 작성한 게시글만 수정할 수 있습니다.");
                }

                // 기존 게시글 데이터 저장
                setPost(postData);
                setTitle(postData.title);
                setContent(postData.content);

            } catch (err) {
                console.error("게시글 조회 오류 : ", err);

                setError (
                    err instanceof Error ? err.message : "게시글을 불러오지 못했습니다."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, router]);


    // 게시글 수정
    const handleSubmit = async (
        event : FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");

        // 제목과 내용 확인
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
            const response = await fetch (`http://localhost:3001/board/${id}`,
                {
                    method : "PATCH",
                    headers : {
                        "Content-Type": "application/json",
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
                // 인증 실패
                if (response.status === 401) {
                    localStorage.removeItem("accessToken");
                    router.replace("/login");
                    return;
                }

                throw new Error (
                    Array.isArray(data?.message) ? data.message.join(",") : data?.message || "게시글 수정에 실패했습니다."
                );
            }

            // 수정 성공 시 상세 페이지로 이동
            router.push(`/board/${id}`);
        } catch (err) {
            console.error("게시글 수정 오류:", err);

            setError(
                err instanceof Error ? err.message : "게시글 수정에 실패했습니다."
            );

        } finally {
            setSubmitting(false);
        }
    };

    // 게시글 불러오는 중
    if (loading) {
        return (
            <main className = "flex min-h-screen items-center justify-center bg-gray-100">
                <p className = "text-gray-600">
                    게시글을 불러오는 중입니다.
                </p>
            </main>
        );
    }

    // 오류 또는 수정 권한이 없는 경우
    if (error && !post) {
        return (
            <main className = "min-h-screen bg-gray-100 px-8 py-10">
                <div className = "mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-md">
                    <p className = "text-red-500">
                        {error}
                    </p>

                    <button
                        type = "button"
                        className = "mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                        onClick = {() => router.push(`/board/${id}`)}
                    >
                        게시글로 돌아가기
                    </button>
                </div>
            </main>
        );
    }

    if (!post) return null;


    // 게시글 수정 화면
    return (
        <main className = "min-h-screen bg-gray-100">

            {/* 공통 헤더 */}
            <Header username = {username} />

            {/* 공통 메뉴바 */}
            <MenuBar activePage="board" />

            {/* 게시글 수정 본문 */}
            <section className = "px-8 py-10">
                <div className = "mx-auto max-w-4xl">

                    <h2 className = "text-3xl font-bold text-gray-800">
                        게시글 수정
                    </h2>

                    <p className = "mt-2 mb-6 text-gray-500">
                        제목과 내용을 수정해주세요.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className = "rounded-xl bg-white p-8 shadow-md"
                    >

                        {/* 제목 */}
                        <div className = "mb-6">
                            <label
                                htmlFor = "title"
                                className = "mb-2 block font-semibold text-gray-700"
                            >
                                제목
                            </label>

                            <input
                                id = "title"
                                type = "text"
                                value = {title}
                                onChange={(event) => setTitle(event.target.value)}
                                maxLength={200}
                                required
                                className = "w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* 내용 */}
                        <div className = "mb-6">
                            <label
                                htmlFor = "content"
                                className = "mb-2 block font-semibold text-gray-700"
                            >
                                내용
                            </label>

                            <textarea
                                id = "content"
                                value = {content}
                                onChange={(event) => setContent(event.target.value)}
                                rows = {12}
                                required
                                className = "w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* 오류 메시지 */}
                        {error && (
                            <p className = "mb-4 text-sm text-red-500">
                                {error}
                            </p>
                        )}

                        {/* 버튼 */}
                        <div className="flex justify-end gap-3">

                            <button
                                type = "button"
                                className = "rounded-lg bg-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-300"
                                onClick={() => router.push(`/board/${id}`)}
                            >
                                취소
                            </button>

                            <button
                                type="submit"
                                disabled={submitting}
                                className = "rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {submitting ? "저장 중..." : "수정 완료"}
                            </button>

                        </div>

                    </form>

                </div>
            </section>

        </main>
    );

}