import { useEffect, useRef } from 'react'
import torchImg from '../../assets/navbar/torch.png'
import torchFlame from '../../assets/navbar/torch.png'

export default function Torch({ className, style }) {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas sizing
        canvas.width = 150
        canvas.height = 220

        // Particle system
        let particles = []

        const createParticle = () => {
            const x = canvas.width / 2 + (Math.random() - 0.5) * 30
            const y = canvas.height - 40 // Start near the bottom (bowl area)
            const size = Math.random() * 10 + 5
            const speedX = (Math.random() - 0.5) * 1.5
            const speedY = -Math.random() * 2.5 - 1.5 // Move up faster
            const life = 0
            const maxLife = Math.random() * 60 + 40

            // Randomly choose colors
            const colors = [
                `rgba(255, 100, 0, 0.8)`, // Orange
                `rgba(255, 200, 0, 0.8)`, // Yellow
                `rgba(255, 50, 0, 0.7)`,  // Red
                `rgba(255, 140, 0, 0.6)`  // Dark Orange
            ]
            const color = colors[Math.floor(Math.random() * colors.length)]

            particles.push({ x, y, size, speedX, speedY, life, maxLife, color })
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Create new particles
            if (particles.length < 100) {
                for (let i = 0; i < 3; i++) createParticle()
            }

            // Update and draw particles
            particles.forEach((p, index) => {
                p.x += p.speedX + Math.sin(Date.now() / 200) * 0.5 // Add some sway
                p.y += p.speedY
                p.size *= 0.96 // Shrink
                p.life++

                // Fade out
                const opacity = 1 - (p.life / p.maxLife)
                if (opacity <= 0) {
                    particles.splice(index, 1)
                    return
                }

                // Replace opacity in rgba string
                // Handle "rgba(r, g, b, a)" -> replace last number and paren
                const lastCommaIndex = p.color.lastIndexOf(',')
                if (lastCommaIndex !== -1) {
                    ctx.fillStyle = p.color.substring(0, lastCommaIndex) + `, ${opacity})`
                } else {
                    ctx.fillStyle = p.color // Fallback
                }

                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fill()
            })

            requestAnimationFrame(animate)
        }

        const animationId = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationId)
    }, [])

    const isLeft = className?.includes('torch-left')
    const imageSrc = isLeft ? torchFlame : torchImg

    return (
        <div className={`torch-container ${className || ''}`} style={style}>
            {/* Flame Canvas */}
            <canvas
                ref={canvasRef}
                className="torch-flame"
            />

            {/* Torch Body Image */}
            <img
                src={imageSrc}
                alt="Torch"
                className="torch-body"
                width="50"
                height="150"
            />
        </div>
    )
}
