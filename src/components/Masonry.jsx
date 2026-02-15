import { useEffect, useLayoutEffect, useMemo, useRef, useState, memo } from 'react';
import { gsap } from 'gsap';

import './Masonry.css';

// Move constants outside to prevent re-creation on every render
const MEDIA_QUERIES = ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'];
const COLUMN_COUNTS = [5, 4, 3, 2];
const DEFAULT_COLUMNS = 1;

const useMedia = (queries, values, defaultValue) => {
    // Safe initial value function that checks for window existence (SSR safe-ish)
    const get = () => {
        if (typeof window === 'undefined') return defaultValue;
        return values[queries.findIndex(q => matchMedia(q).matches)] ?? defaultValue;
    };

    const [value, setValue] = useState(get);

    useEffect(() => {
        const handler = () => setValue(get);
        queries.forEach(q => matchMedia(q).addEventListener('change', handler));
        return () => queries.forEach(q => matchMedia(q).removeEventListener('change', handler));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps because queries are now constant external modules

    return value;
};

const useMeasure = () => {
    const ref = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setSize({ width, height });
        });
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    return [ref, size];
};

const preloadImages = async urls => {
    await Promise.all(
        urls.map(
            src =>
                new Promise(resolve => {
                    const img = new Image();
                    img.src = src;
                    img.onload = img.onerror = () => resolve();
                })
        )
    );
};

const Masonry = memo(({
    items = [], // Default empty array to prevent crash
    ease = 'power3.out',
    duration = 0.6,
    stagger = 0.05,
    animateFrom = 'bottom',
    scaleOnHover = true,
    hoverScale = 0.95,
    blurToFocus = true,
    colorShiftOnHover = false
}) => {
    const columns = useMedia(MEDIA_QUERIES, COLUMN_COUNTS, DEFAULT_COLUMNS);
    const [containerRef, { width }] = useMeasure();
    const [imagesReady, setImagesReady] = useState(false);

    // Memoize `items` dependency for preload to avoid unnecessary effects if items array is unstable but content same
    // (Assuming items might be stable enough or using IDs, but simple check helps)
    useEffect(() => {
        if (items.length > 0) {
            preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
        }
    }, [items]);

    const getInitialPosition = (item, containerRect) => {
        // Accessing containerRef.current in render/effect is fine, but check validity
        // const containerRect = containerRef.current?.getBoundingClientRect(); // REMOVED to avoid thrashing
        if (!containerRect) return { x: item.x, y: item.y };

        let direction = animateFrom;

        if (animateFrom === 'random') {
            const directions = ['top', 'bottom', 'left', 'right'];
            direction = directions[Math.floor(Math.random() * directions.length)];
        }

        switch (direction) {
            case 'top':
                return { x: item.x, y: -200 };
            case 'bottom':
                return { x: item.x, y: window.innerHeight + 200 };
            case 'left':
                return { x: -200, y: item.y };
            case 'right':
                return { x: window.innerWidth + 200, y: item.y };
            case 'center':
                return {
                    x: containerRect.width / 2 - item.w / 2,
                    y: containerRect.height / 2 - item.h / 2
                };
            default:
                return { x: item.x, y: item.y + 100 };
        }
    };

    const grid = useMemo(() => {
        if (!width || !items.length) return [];

        const colHeights = new Array(columns).fill(0);
        const columnWidth = width / columns;

        return items.map(child => {
            const col = colHeights.indexOf(Math.min(...colHeights));
            const x = columnWidth * col;
            // Safety check for height
            const h = (child.height || 200) / 2;
            const y = colHeights[col];

            colHeights[col] += h;

            return { ...child, x, y, w: columnWidth, h };
        });
    }, [columns, items, width]);

    const hasMounted = useRef(false);

    useLayoutEffect(() => {
        if (!imagesReady || grid.length === 0) return;

        // Use a context or selector cleaner to optimize GSAP selections if possible, 
        // but here we just ensure we target correctly.
        const ctx = gsap.context(() => {
            grid.forEach((item, index) => {
                const selector = `[data-key="${item.id}"]`;
                const animationProps = {
                    x: item.x,
                    y: item.y,
                    width: item.w,
                    height: item.h
                };

                if (!hasMounted.current) {
                    const containerRect = containerRef.current?.getBoundingClientRect();
                    const initialPos = getInitialPosition(item, containerRect);
                    const initialState = {
                        opacity: 0,
                        x: initialPos.x,
                        y: initialPos.y,
                        width: item.w,
                        height: item.h,
                        ...(blurToFocus && { filter: 'blur(10px)' })
                    };

                    gsap.fromTo(selector, initialState, {
                        opacity: 1,
                        ...animationProps,
                        ...(blurToFocus && { filter: 'blur(0px)' }),
                        duration: 0.8,
                        ease: 'power3.out',
                        delay: index * stagger
                    });
                } else {
                    gsap.to(selector, {
                        ...animationProps,
                        duration: duration,
                        ease: ease,
                        overwrite: 'auto'
                    });
                }
            });
        }, containerRef); // Scope GSAP to container

        hasMounted.current = true;

        return () => ctx.revert(); // Cleanup GSAP context
    }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

    // Memoize handlers to keep props stable if passed down (though here they are used in-render)
    // Actually, they are attached to DOM elements so useCallback is good practice.

    const handleMouseEnter = (e, item) => {
        const element = e.currentTarget;
        const selector = `[data-key="${item.id}"]`;

        if (scaleOnHover) {
            gsap.to(selector, {
                scale: hoverScale,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        }

        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay');
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0.3,
                    duration: 0.3,
                    overwrite: 'auto'
                });
            }
        }
    };

    const handleMouseLeave = (e, item) => {
        const element = e.currentTarget;
        const selector = `[data-key="${item.id}"]`;

        if (scaleOnHover) {
            gsap.to(selector, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: 'auto'
            });
        }

        if (colorShiftOnHover) {
            const overlay = element.querySelector('.color-overlay');
            if (overlay) {
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.3,
                    overwrite: 'auto'
                });
            }
        }
    };

    return (
        <div ref={containerRef} className="list">
            {grid.map(item => {
                return (
                    <div
                        key={item.id}
                        data-key={item.id}
                        className="item-wrapper"
                        onClick={() => item.url && window.open(item.url, '_blank', 'noopener')}
                        onMouseEnter={e => handleMouseEnter(e, item)}
                        onMouseLeave={e => handleMouseLeave(e, item)}
                    >
                        <div className="item-img">
                            <img src={item.img} alt="" loading="lazy" decoding="async" />
                            {colorShiftOnHover && (
                                <div
                                    className="color-overlay"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(45deg, rgba(255,0,150,0.5), rgba(0,150,255,0.5))',
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        borderRadius: '8px'
                                    }}
                                />
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
});

export default Masonry;
