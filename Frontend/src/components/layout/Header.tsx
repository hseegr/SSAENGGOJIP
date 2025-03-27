import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="sticky top-0 z-20 w-full bg-white border-b h-16 border-[#F4F4F4]">
      <div className="flex items-center justify-between h-16 w-full px-10 mx-auto">
        {/* 로고 */}
        <Link to="/main" className="flex items-center">
          <img src="/src/assets/images/logo.png" alt="logo" className="w-28" />
        </Link>

        {/* 네비게이션 메뉴 */}
        <div className="flex flex-row">
          <nav className="flex items-center space-x-10 text-sm text-[#242424] font-medium">
            <Link
              to="/explore"
              className="px-3 py-1 rounded-md transition-colors duration-200 hover:bg-ssaeng-purple/10"
            >
              매물탐색
            </Link>
            <Link
              to="/community"
              className="px-3 py-1 rounded-md transition-colors duration-200 hover:bg-ssaeng-purple/10"
            >
              커뮤니티
            </Link>
            <Link
              to="/account/register"
              className="px-3 py-1 rounded-md transition-colors duration-200 hover:bg-ssaeng-purple/10"
            >
              회원가입
            </Link>
          </nav>

          {/* 로그인 버튼 */}
          <Link
            to="/account/login"
            className="px-4 py-1 text-sm font-semibold text-white rounded-full bg-ssaeng-purple ml-10"
            viewTransition
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
