interface SideMenuProps {
    activeTab: 'info' | 'preferences' | 'favorites';
    onChangeTab: (tab: 'info' | 'preferences' | 'favorites') => void;
}

const SideMenu = ({ activeTab, onChangeTab }: SideMenuProps) => {
    const getButtonClass = (tab: string) =>
        `w-full py-2 px-6 text-center font-semibold rounded-xl transition-colors duration-200
         ${activeTab === tab ? 'bg-ssaeng-purple text-white' : 'text-gray-400 hover:text-ssaeng-purple'}`

    return (
        <div className="flex flex-col gap-4">
            <button onClick={() => onChangeTab('info')} className={getButtonClass('info')}>
                내 정보
            </button>
            <button onClick={() => onChangeTab('preferences')} className={getButtonClass('preferences')}>
                내 생활권 선호도 설정
            </button>
            <button onClick={() => onChangeTab('favorites')} className={getButtonClass('favorites')}>
                관심 매물
            </button>
        </div>
    )
}

export default SideMenu
