interface OptionButtonProps {
    text: string
    selected: boolean
    onClick: () => void
}

const OptionButton = ({ text, selected, onClick }: OptionButtonProps) => {
    return (
        <button
            className={`w-80 py-3 rounded-lg border text-sm font-medium transition-all
          ${selected
                    ? 'border-ssaeng-purple text-ssaeng-purple bg-ssaeng-purple-light'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
        `}
            onClick={onClick}
        >
            {text}
        </button>
    )
}

export default OptionButton
