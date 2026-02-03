import React from 'react';

export const HomeIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z"
            fill="#FFD700"
            stroke="#8B4513"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
        <path
            d="M9 14H15V21H9V14Z"
            fill="#CD853F"
        />
    </svg>
);

export const EventsIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3Z"
            fill="#FFD700"
            stroke="#8B4513"
            strokeWidth="1.5"
        />
        <path
            d="M7 8H17M7 12H17M7 16H14"
            stroke="#8B4513"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
        <circle cx="5" cy="8" r="0.5" fill="#8B4513" />
        <circle cx="5" cy="12" r="0.5" fill="#8B4513" />
        <circle cx="5" cy="16" r="0.5" fill="#8B4513" />
    </svg>
);

export const ItineraryIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 5.02944 7.02944 1 12 1C16.9706 1 21 5.02944 21 10Z"
            fill="#FFD700"
            stroke="#8B4513"
            strokeWidth="1.5"
        />
        <circle
            cx="12"
            cy="10"
            r="3"
            fill="#8B4513"
        />
        <path
            d="M8 15L12 19L16 15"
            stroke="#8B4513"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const SponsorIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M20 6H4C2.9 6 2 6.9 2 8V16C2 17.1 2.9 18 4 18H20C21.1 18 22 17.1 22 16V8C22 6.9 21.1 6 20 6Z"
            fill="#FFD700"
            stroke="#8B4513"
            strokeWidth="1.5"
        />
        <circle
            cx="12"
            cy="12"
            r="3"
            fill="#8B4513"
        />
        <circle
            cx="12"
            cy="12"
            r="1.5"
            fill="#FFD700"
        />
        <path
            d="M6 10V14M18 10V14"
            stroke="#8B4513"
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

export const AboutIcon = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle
            cx="12"
            cy="12"
            r="10"
            fill="#FFD700"
            stroke="#8B4513"
            strokeWidth="1.5"
        />
        <path
            d="M12 16V12"
            stroke="#8B4513"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <circle
            cx="12"
            cy="8"
            r="1"
            fill="#8B4513"
        />
    </svg>
);
