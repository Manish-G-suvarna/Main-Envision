import { useRef, memo } from "react";

export const BentoTilt = memo(({ children, className = "" }) => {
    const itemRef = useRef(null);
    const contentRef = useRef(null);

    const handleMouseMove = (event) => {
        if (!itemRef.current || !contentRef.current) return;

        const { left, top, width, height } =
            itemRef.current.getBoundingClientRect();

        const relativeX = (event.clientX - left) / width;
        const relativeY = (event.clientY - top) / height;

        const tiltX = (relativeY - 0.5) * 5;
        const tiltY = (relativeX - 0.5) * -5;

        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.98, .98, .98)`;

        // Direct DOM update to avoid re-renders
        contentRef.current.style.transform = newTransform;
    };

    const handleMouseLeave = () => {
        if (contentRef.current) {
            contentRef.current.style.transform = "";
        }
    };

    return (
        <div
            ref={itemRef}
            className="relative transition-all duration-300"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <div
                ref={contentRef}
                className={className}
                style={{ transition: 'transform 0.1s ease-out' }}
            >
                {children}
            </div>
        </div>
    );
});
