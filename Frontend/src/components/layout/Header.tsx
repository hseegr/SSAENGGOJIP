// Header.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { logout as logoutApi } from '@/services/userService'
import logo from '@/assets/images/logo.png'
import { useChatSocket } from '@/hooks/useChatSocket'

// isNonSticky prop을 받도록 수정
const Header = ({ isNonSticky }) => {
  const navigate = useNavigate()
  const isLoggedIn = useUserStore((state) => state.isLoggedIn)
  const logout = useUserStore((state) => state.logout)
  const { disconnect } = useChatSocket()

  const handleLogout = async () => {
    try {
      disconnect()
      await logoutApi()
      logout()
      navigate('/account/login')
    } catch (error) {
      console.error('로그아웃 실패:', error)
    }
  }

  return (
    // 조건부로 sticky 클래스 추가/제거
    <header
      className={`${isNonSticky ? '' : 'sticky'} top-0 z-20 w-full bg-white border-b h-16 border-[#F4F4F4]`}
    >
      <div className="flex items-center justify-between h-16 w-full px-10 mx-auto">
        {/* 로고 */}
        <Link to="/main" className="flex items-center">
          <img src={logo} alt="logo" className="w-28" />
        </Link>

        {/* 네비게이션 메뉴 */}
        <div className="flex flex-row items-center">
          <nav className="flex items-center space-x-10 text-sm text-[#242424] font-medium">
            <Link
              to="/explore"
              className="px-3 py-1 rounded-md hover:bg-ssaeng-purple/10"
            >
              매물탐색
            </Link>
            <Link
              to="/community"
              className="px-3 py-1 rounded-md hover:bg-ssaeng-purple/10"
            >
              커뮤니티
            </Link>
            {isLoggedIn ? (
              <Link
                to="/mypage"
                className="px-3 py-1 rounded-md hover:bg-ssaeng-purple/10"
              >
                마이페이지
              </Link>
            ) : (
              <Link
                to="/account/login"
                className="px-3 py-1 rounded-md hover:bg-ssaeng-purple/10"
                viewTransition
              >
                회원가입
              </Link>
            )}
          </nav>

          {/* 로그인 / 로그아웃 버튼 */}
          <div className="flex items-center space-x-4 ml-10">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-20 py-1 text-sm font-semibold text-white text-center rounded-full bg-gray-400"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/account/login"
                className="w-20 py-1 text-sm font-semibold text-white text-center rounded-full bg-ssaeng-purple"
                viewTransition
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
