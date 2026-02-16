import { useRef, memo } from "react";
import { useNavigate } from "react-router-dom";

export const BentoCard = memo(({ src, title, description, category }) => {
    const hoverButtonRef = useRef(null);
    const overlayRef = useRef(null);
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (category) {
            const params = category === 'All Categories' ? '' : `?category=${encodeURIComponent(category)}`;
            navigate(`/events${params}`);
        }
    };

    const handleMouseMove = (event) => {
        if (!hoverButtonRef.current || !overlayRef.current) return;
        const rect = hoverButtonRef.current.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        overlayRef.current.style.opacity = '1';
        overlayRef.current.style.background = `radial-gradient(100px circle at ${x}px ${y}px, #656fe288, #00000026)`;
    };

    const handleMouseLeave = () => {
        if (overlayRef.current) {
            overlayRef.current.style.opacity = '0';
        }
    };

    return (
        <div className="relative size-full" onClick={handleCardClick} style={{ cursor: category ? 'pointer' : 'default' }}>
            <img
                src={src}
                alt="card-bg"
                className="absolute left-0 top-0 size-full object-cover object-center"
                loading="lazy"
            />
            <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
                <div>
                    <h1 className="bento-title special-font">{title}</h1>
                    {description && (
                        <p className="mt-3 max-w-64 text-xs md:text-base bento-desc">{description}</p>
                    )}
                </div>

                <div
                    ref={hoverButtonRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
                >
                    {/* Radial gradient hover effect */}
                    <div
                        ref={overlayRef}
                        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300"
                        style={{
                            // Initial state is handled by class/style, updates via JS
                            willChange: 'opacity, background'
                        }}
                    />
                    {/* Reusing the SVG from App.tsx/Task */}
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="relative z-20 text-[#ffd700]" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.368 19.102c.349 1.049 1.011 1.086 1.478.086l5.309-11.375c.467-1.002.034-1.434-.967-.967l-11.376 5.308c-1.001.467-.963 1.129.085 1.479l4.103 1.367 1.368 4.102z"></path>
                    </svg>
                    <p className="relative z-20 text-white/80 font-semibold tracking-widest">VIEW</p>
                </div>
            </div>
        </div>
    );
});

BentoCard.displayName = 'BentoCard';
