import { useState, useEffect, memo } from 'react'
import './CountdownTimer.css'

const calculateTimeLeft = (targetDate) => {
    const difference = +new Date(targetDate) - +new Date()
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        }
    }

    return timeLeft
}

const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num.toString()
}

const CountdownTimer = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate))

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate))
        }, 1000)

        return () => clearInterval(timer)
    }, [targetDate])

    return (
        <div className="countdown-container">
            <div className="time-box-wrapper">
                <div className="time-box">
                    <span className="time-value">{formatNumber(timeLeft.days)}</span>
                </div>
                <div className="time-box-glow"></div>
                <span className="time-label">DAYS</span>
                <span className="time-separator">:</span>
            </div>
            <div className="time-box-wrapper">
                <div className="time-box">
                    <span className="time-value">{formatNumber(timeLeft.hours)}</span>
                </div>
                <div className="time-box-glow"></div>
                <span className="time-label">HOURS</span>
                <span className="time-separator">:</span>
            </div>
            <div className="time-box-wrapper">
                <div className="time-box">
                    <span className="time-value">{formatNumber(timeLeft.minutes)}</span>
                </div>
                <div className="time-box-glow"></div>
                <span className="time-label">MINUTES</span>
                <span className="time-separator">:</span>
            </div>
            <div className="time-box-wrapper">
                <div className="time-box">
                    <span className="time-value">{formatNumber(timeLeft.seconds)}</span>
                </div>
                <div className="time-box-glow"></div>
                <span className="time-label">SECONDS</span>
            </div>
        </div>
    )
}

export default memo(CountdownTimer)
