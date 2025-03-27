import confetti from 'canvas-confetti'
import type { ConfettiOptions } from '@/types/canvasConfettiTypes'

export const useConfetti = () => {
    const count = 200
    const defaults: Partial<ConfettiOptions> = {
        origin: { y: 0.7 },
    }

    function fire(particleRatio: number, opts: Partial<ConfettiOptions>) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
        })
    }

    return () => {
        fire(0.25, { spread: 26, startVelocity: 70 })
        fire(0.2, { spread: 20 })
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
        fire(0.1, { spread: 120, startVelocity: 45 })
    }
}
