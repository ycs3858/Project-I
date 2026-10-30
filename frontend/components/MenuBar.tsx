import Link from "next/link";


type MenuBarProps = {
    activePage : "home" | "board";
};

export default function MenuBar ({activePage} : MenuBarProps) {

    // 모든 메뉴에 공통적으로 적용되는 스타일
    const baseClass = "flex h-full items-center px-3 font-semibold";

    // 현재 선택된 메뉴의 스타일
    const activeClass = "border-b-4 border-blue-500 text-blue-600";

    // 선택되지 않은 메뉴의 스타일
    const inactiveClass = "text-gray-500 hover:text-blue-600";

    return (
        <nav className = "border-b bg-white px-8">

            <div className = "flex h-16 items-center gap-8">

                {/* 홈 */}
                <Link
                    href = "/home"
                    aria-current = {activePage === "home" ? "page" : undefined}
                    className = {`${baseClass} ${activePage === "home" ? activeClass : inactiveClass}`}
                >
                    홈
                </Link>

                {/* 게시판 */}
                <Link
                    href = "/board"
                    aria-current = {activePage === "board" ? "page" : undefined}
                    className = {`${baseClass} ${activePage === "board" ? activeClass : inactiveClass}`}
                >
                    게시판
                </Link>

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
    )
}