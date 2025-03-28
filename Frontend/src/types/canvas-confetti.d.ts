declare module 'canvas-confetti' {
    interface Options {
        particleCount?: number
        angle?: number
        spread?: number
        startVelocity?: number
        decay?: number
        scalar?: number
        origin?: {
            x?: number
            y?: number
        }
        colors?: string[]
        shapes?: string[]
        ticks?: number
        zIndex?: number
    }

    export default function confetti(options?: Options): void
}
