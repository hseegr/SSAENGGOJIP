import matchSearchStore from '@/store/matchSearchStore'
import useMatchSearchResultStore from '@/store/searchResultStore'

const MatchSearchResults = () => {
  const { setIsSearching } = matchSearchStore()
  const { results, resetResults } = useMatchSearchResultStore()

  const handleGoBack = () => {
    setIsSearching(false) // 검색 상태를 false로 변경하여 필터 화면으로 돌아가기
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">검색 결과</h2>

      {/* 검색 결과 내용 */}
      <div className="mb-8">
        {/* 여기에 실제 검색 결과 컨텐츠 추가 */}
        <p className="text-gray-600">검색 결과가 표시됩니다.</p>
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={handleGoBack}
        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
      >
        필터 설정으로 돌아가기
      </button>
    </div>
  )
}

export default MatchSearchResults
