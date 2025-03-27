// src/types/canvasConfettiTypes.ts
export interface ConfettiOptions {
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
