"use client";


import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Post = {
    id : number;
    title : string;
    content : string;
    authorId : number;
    viewCount : number;
    createdAt : string;
    updatedAt : string;
    author : {
        username : string;
    };
};


export default function BoardDetailPage() {
    const router = useRouter();
    const {id} = useParams<{ id : string }>();

    // 사용자 이름 : 비회원은 방문자로 표시
    const [username, setUsername] = useState("방문자");

    // 게시글 데이터
    const [post, setPost] = useState<Post | null>(null);

    // 게시글 조회 상태
    const [postLoading, setPostLoading] = useState(true);
    const [error, setError] = useState("");

    // 로그인한 경우에만 사용자 이름 확인
    useEffect(() => {
        const fetchUsername = async () => {
            const accessToken = localStorage.getItem("accessToken");

            // 비회원이면 방문자 표시 유지
            if (!accessToken) return;

            try {
                const response = await fetch(
                    "http://localhost:3001/auth/me",
                {
                    method : "GET",
                    headers : {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                // 토큰이 유효하지 않아도 열람은 가능
                if (!response.ok) {
                    localStorage.removeItem("asscessToken");
                    setUsername("방문자");
                    return;
                }

                const data = await response.json();
                setUsername(data.username || "방문자");
            
            } catch (err) {
                console.error("사용자 정보 조회 오류:", err);
                setUsername("방문자");
            }
        };


        fetchUsername();
    }, []);


    // 게시글 상세 조회
    useEffect (() => {
        const fetchPost = async () => {

            try {
                const response = await fetch(`http://localhost:3001/board/${id}`);

                if (!response.ok) {
                    throw new Error("게시글을 불러오지 못했습니다.");
                }

                const data: Post | null = await response.json();

                if (!data) {
                    setError("해당 게시글을 찾을 수 없습니다.");
                } else {
                    setPost(data);
                }
            
            } catch (err) {
                console.error("게시글 상세 조회 오류:", err);

                setError(
                    err instanceof Error ? err.message : "게시글 조회에 실패했습니다."
                );
            } finally {
                setPostLoading(false);
            }
        };

        fetchPost();
    }, [id]);


    // 게시글 조회 중
    if (postLoading) {
        return (
            <main className = "flex min-h-screen items-center justify-center bg-gray-100">
                <p className = "text-gray-600">
                    게시글을 불러오는 중입니다.
                </p>
            </main>
        );
    }


    // 오류 또는 게시글이 없는 경우
    if (error || !post) {
        return (
            <main className = "min-h-screen bg-gray-100 px-8 py-10">
                <div className = "mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-md">
                    <p className = "text-red-500">
                        {error || "게시글을 찾을 수 없습니다."}
                    </p>

                    <button
                        type = "button"
                        className = "mt-6 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
                        onClick = {() => router.push("/board")}
                    >
                        목록으로
                    </button>
                </div>
            </main>
        );
    }


    // 게시글 상세 화면
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


            {/* 게시글 본문 */}
            <section className = "px-8 py-10">

                <div className = "mx-auto max-w-4xl">
                    {/* 목록으로 돌아가기 */}
                    <button
                        type = "button"
                        className = "mb-5 font-semibold text-blue-600 hover:underline"
                        onClick={() => router.push("/board")}
                    >
                        ← 게시글 목록
                    </button>

                    <article className = "rounded-xl bg-white p-8 shadow-md">
                        
                        {/* 제목 및 작성자 정보 */}
                        <div className = "border-b pb-6">

                            <h2 className = "text-3xl font-bold text-gray-800">
                                {post.title}
                            </h2>

                            <div className = "mt-4 flex flex-wrap gap-4 text-sm text-gray-500">

                                <span>
                                    작성자 : {post.author.username}
                                </span>

                                <span>
                                    작성일 : {" "}
                                    {new Date(
                                        post.createdAt
                                    ).toLocaleDateString("ko-KR")}
                                </span>

                                <span>
                                    조회수 : {post.viewCount}
                                </span>

                            </div>

                        </div>

                        {/* 게시글 내용 */}
                        <div className = "min-h-60 whitespace-pre-wrap py-8 leading-7 text-gray-700">
                            {post.content}
                        </div>

                    </article>
                </div>
            </section>

        </main>
    );

}