import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import PageTransition from './PageTransition'
import PerformanceOptimizer from '../utils/PerformanceOptimizer'

export default function Layout() {
    const { pathname } = useLocation()

    // Scroll to top on route change
    useEffect(() => {
        window.scrollTo(0, 0)
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
    }, [pathname])

    return (
        <div className="layout-wrapper">
            <PerformanceOptimizer />
            <PageTransition />
            <Outlet />
        </div>
    )
}

