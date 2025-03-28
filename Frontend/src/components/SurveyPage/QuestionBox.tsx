import { ReactNode } from 'react'

interface QuestionBoxProps {
    children: ReactNode
}

const QuestionBox = ({ children }: QuestionBoxProps) => {
    return (
        <div className="text-xl font-semibold text-[#242424] leading-relaxed">
            {children}
        </div>
    )
}

export default QuestionBox
