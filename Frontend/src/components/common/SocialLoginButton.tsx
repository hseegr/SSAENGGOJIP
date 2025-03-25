type SocialLoginButtonProps = {
    bgColor: string
    textColor?: string
    logoSrc: string
    text: string
    onClick: () => void
}

const SocialLoginButton = ({
    bgColor,
    textColor = 'text-black',
    logoSrc,
    text,
    onClick,
}: SocialLoginButtonProps) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center justify-center gap-4 py-3 rounded-lg font-semibold hover:opacity-90 ${bgColor} ${textColor}`}
        >
            <img src={logoSrc} alt="logo" className="w-6 h-6" />
            {text}
        </button>
    )
}

export default SocialLoginButton
