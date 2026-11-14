import Link from "next/link";

type HeaderProps = {
    username : string;
};

export default function Header({username} : HeaderProps) {
    return (
        <header className = "flex h-20 items-center justify-between border-b bg-white px-8">

            {/* 프로젝트 로고 */}
            <h1 className = "text-3xl font-bold tracking-tight text-blue-600">
                <Link href = "/home">
                    PROJECT-I
                </Link>
            </h1>

            {/* 사용자 영역 */}
            <div className = "flex items-center gap-4">

                {/* 사용자 이름 */}
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
    )
}