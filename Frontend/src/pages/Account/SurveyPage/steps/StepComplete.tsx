import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import heart from '@/assets/images/heart.png'

const StepComplete = () => {
    const navigate = useNavigate()

    const floatingHearts = Array.from({ length: 10 }, (_, i) => {
        const isLeftSide = Math.random() < 0.5
        const left = isLeftSide
            ? `${5 + Math.random() * 20}%`          // 왼쪽 0~30%
            : `${75 + Math.random() * 20}%`     // 오른쪽 70~100%

        return {
            id: i,
            left,
            delay: Math.random() * 0.1,
            duration: 3 + Math.random() * 2,
            rotate: Math.random() * 30 - 15,
            size: 48 + Math.random() * 24,
        }
    })
    return (
        <div className="relative flex flex-col h-screen items-center justify-start w-full text-center overflow-hidden">
            {/* 💘 하트 애니메이션 */}
            {floatingHearts.map(({ id, left, delay, duration, rotate, size }) => (
                <motion.img
                    key={id}
                    src={heart}
                    alt="heart"
                    className="absolute"
                    initial={{ y: '100vh', opacity: 1, scale: 1, rotate: 0 }}
                    animate={{
                        y: ['100vh', '-30vh'],
                        scale: [1, 1.3, 1],
                        rotate: [0, rotate, -rotate, 0],
                        opacity: [1, 0.8, 0.4, 0],
                    }}
                    transition={{
                        duration,
                        delay,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut',
                    }}
                    style={{
                        left,
                        width: `${size}px`,
                        height: `${size}px`,
                        pointerEvents: 'none',
                    }}
                />
            ))}

            {/* 🎉 텍스트 */}
            <h2 className="text-2xl font-bold mt-40 mb-6 text-gray-800">설정이 완료되었어요! 🎉</h2>
            <p className="text-base text-gray-600 mt-16 mb-12 leading-relaxed">
                내 상황에 꼭 맞는 집을 찾을 수 있도록<br />
                입력해주신 정보를 잘 반영해둘게요 😊
            </p>

            <button
                onClick={() => navigate('/main')}
                className="bg-ssaeng-purple text-white px-6 py-2 w-72 mt-16 rounded-lg font-semibold hover:bg-ssaeng-purple-dark transition"
            >
                쌩Go집 이용하러 가기
            </button>
        </div>
    )
}

export default StepComplete
