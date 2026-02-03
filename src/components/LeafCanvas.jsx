import { useEffect, useRef } from 'react'

const LEAF_COUNT = 200
const COLORS = ['#e60000', '#ff3333', '#800000', '#ff6666', '#b30000', '#cc2200', '#ff4d4d']
const SPAWN_REGIONS = [
    { xMin: 0.0, xMax: 0.35, yMin: 0.0, yMax: 0.50 },
    { xMin: 0.70, xMax: 1.0, yMin: 0.0, yMax: 0.50 }
]

class RealisticLeaf {
    constructor(canvasWidth, canvasHeight) {
        this.x = 0
        this.y = 0
        this.velocityX = 0
        this.velocityY = 0
        this.targetSpeedY = 0
        this.size = 0
        this.color = ''
        this.opacity = 0
        this.rotation = 0
        this.rotationSpeed = 0
        this.flip = 0
        this.flipSpeed = 0
        this.swayPhase = 0
        this.canvasWidth = canvasWidth
        this.canvasHeight = canvasHeight
        this.reset(true)
    }

    reset(initial = false) {
        const region = SPAWN_REGIONS[Math.floor(Math.random() * SPAWN_REGIONS.length)]

        this.x = (Math.random() * (region.xMax - region.xMin) + region.xMin) * this.canvasWidth

        if (initial) {
            this.y = Math.random() * this.canvasHeight
            this.opacity = Math.random() * 0.8 + 0.2
        } else {
            this.y = (Math.random() * (region.yMax - region.yMin) + region.yMin) * this.canvasHeight
            this.opacity = 0
        }

        this.size = Math.random() * 4 + 3
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)]

        this.velocityX = (Math.random() - 0.5) * 0.5
        this.velocityY = Math.random() * 1.0 + 0.5

        this.rotation = Math.random() * Math.PI * 2
        this.rotationSpeed = (Math.random() - 0.5) * 0.04
        this.flip = Math.random() * Math.PI * 2
        this.flipSpeed = Math.random() * 0.05 + 0.02
        this.swayPhase = Math.random() * Math.PI * 2
    }

    update(isHovering) {
        if (this.opacity < 1) this.opacity += 0.01

        if (isHovering) {
            this.targetSpeedY = -1.5 - Math.random() * 0.8
        } else {
            this.targetSpeedY = 1.0 + Math.random() * 0.6
        }

        this.velocityY += (this.targetSpeedY - this.velocityY) * 0.03

        this.y += this.velocityY

        this.swayPhase += 0.025
        let swayAmount = Math.sin(this.swayPhase) * 0.8

        if (isHovering) {
            swayAmount += (Math.random() - 0.5) * 2.5
            this.rotationSpeed = (Math.random() - 0.5) * 0.08
        }

        this.x += swayAmount + this.velocityX
        this.rotation += this.rotationSpeed
        this.flip += this.flipSpeed

        if (this.y > this.canvasHeight + 20) {
            this.reset()
        }
        if (this.y < -60) {
            this.reset()
        }
        if (this.x < -20 || this.x > this.canvasWidth + 20) {
            this.reset()
        }
    }

    draw(ctx) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.rotation)

        const flipScale = Math.abs(Math.sin(this.flip))
        ctx.scale(1, Math.max(flipScale, 0.1))

        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color

        // Draw maple leaf shape
        ctx.beginPath()
        ctx.moveTo(0, -this.size)
        ctx.quadraticCurveTo(this.size * 0.5, -this.size * 0.5, this.size, -this.size * 0.3)
        ctx.quadraticCurveTo(this.size * 0.6, 0, this.size * 0.8, this.size * 0.5)
        ctx.quadraticCurveTo(this.size * 0.3, this.size * 0.3, 0, this.size)
        ctx.quadraticCurveTo(-this.size * 0.3, this.size * 0.3, -this.size * 0.8, this.size * 0.5)
        ctx.quadraticCurveTo(-this.size * 0.6, 0, -this.size, -this.size * 0.3)
        ctx.quadraticCurveTo(-this.size * 0.5, -this.size * 0.5, 0, -this.size)
        ctx.fill()

        ctx.restore()
    }

    updateCanvasSize(width, height) {
        this.canvasWidth = width
        this.canvasHeight = height
    }
}

export default function LeafCanvas() {
    const canvasRef = useRef(null)
    const leavesRef = useRef([])
    const isHoveringRef = useRef(false)
    const animationRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const resizeCanvas = () => {
            // Handle high DPI displays
            const dpr = window.devicePixelRatio || 1
            canvas.width = window.innerWidth * dpr
            canvas.height = window.innerHeight * dpr
            canvas.style.width = `${window.innerWidth}px`
            canvas.style.height = `${window.innerHeight}px`

            ctx.scale(dpr, dpr)

            leavesRef.current.forEach(leaf => {
                leaf.updateCanvasSize(window.innerWidth, window.innerHeight)
            })
        }

        resizeCanvas()

        // Initialize leaves
        leavesRef.current = []
        for (let i = 0; i < LEAF_COUNT; i++) {
            leavesRef.current.push(new RealisticLeaf(canvas.width, canvas.height))
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)
            for (const leaf of leavesRef.current) {
                leaf.update(isHoveringRef.current)
                leaf.draw(ctx)
            }
            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        window.addEventListener('resize', resizeCanvas)

        return () => {
            cancelAnimationFrame(animationRef.current)
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [])

    const handleMouseEnter = () => {
        isHoveringRef.current = true
    }

    const handleMouseLeave = () => {
        isHoveringRef.current = false
    }

    return (
        <>
            <canvas
                ref={canvasRef}
                className="leaf-canvas"
            />
            {/* Invisible hover zones over tree areas */}
            <div
                className="tree-zone tree-zone-left"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            <div
                className="tree-zone tree-zone-right"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
        </>
    )
}
