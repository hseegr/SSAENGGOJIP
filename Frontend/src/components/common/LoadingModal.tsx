// src/components/common/LoadingModal.tsx
import ReactDOM from 'react-dom'
import { motion } from 'framer-motion'
import gifSrc from '@/assets/images/loading.gif'

interface LoadingModalProps {
  isOpen: boolean
  message?: string
  gifSrc?: string // GIF 이미지 소스 경로를 받는 prop 추가
}

const LoadingModal: React.FC<LoadingModalProps> = ({
  isOpen,
  message = '검색 중...',
  // 기본 GIF는 프로젝트의 assets/images 폴더에 loading.gif라는 파일이 있다고 가정합니다.
  // 파일 위치에 맞게 경로를 조정해주세요.
}) => {
  if (!isOpen) return null

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center"
      >
        {/* GIF 이미지 */}
        <img src={gifSrc} alt="Loading" className="h-32 w-32 mb-4" />

        <p className="text-ssaeng-purple font-bold text-xl">{message}</p>
        <p className="text-gray-500 text-sm mt-2">잠시만 기다려 주세요</p>
      </motion.div>
    </div>,
    document.body,
  )
}

export default LoadingModal
