import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SideMenu from '@/components/MyPage/SideMenu'
import MyInfoTab from '@/components/MyPage/MyInfoTab'
import PreferencesTab from '@/components/MyPage/PreferencesTab'
import FavoriteListingsTab from '@/components/MyPage/FavoriteListingsTab'

const MyPage = () => {
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const tab = params.get('tab') as 'info' | 'preferences' | 'favorites'

    const [activeTab, setActiveTab] = useState<'info' | 'preferences' | 'favorites'>(tab || 'info')

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <MyInfoTab />
            case 'preferences':
                return <PreferencesTab />
            case 'favorites':
                return <FavoriteListingsTab />
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen flex bg-white">
            {/* 왼쪽 사이드 메뉴 */}
            <aside className="w-[340px] relative py-10 pl-10 pr-10">
                <div className="absolute top-10 bottom-10 right-0 w-px bg-gray-200" />
                <SideMenu activeTab={activeTab} onChangeTab={setActiveTab} />
            </aside>

            {/* 오른쪽 콘텐츠 영역 */}
            <main className="flex-1 py-2">
                {renderTabContent()}
            </main>
        </div>
    )
}

export default MyPage