import { useState, useEffect, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Events.css';
import mainBg from '../assets/main-bg.png';
import { fetchEvents } from '../services/api';
import { EventCard } from '../components/EventCard';

// Category mapping for filtering - Moved outside to prevent recreation
const CATEGORIES = [
    'All Categories',
    'Details'
];

export default function Events() {
    console.log('Events Component Rendering...'); // DEBUG LOG
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get('category');
    const validInitialCategory = CATEGORIES.includes(initialCategory) ? initialCategory : 'All Categories';

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    // Restoring missing state
    const [searchQuery, setSearchQuery] = useState('');
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(validInitialCategory);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        const loadEvents = async () => {
            try {
                setLoading(true);
                const data = await fetchEvents();
                console.log('Raw Events Data:', data); // DEBUG LOG
                if (isMounted) {
                    // Fix: Ensure data is an array AND filter out null/undefined items
                    const validEvents = Array.isArray(data)
                        ? data.filter(e => e && typeof e === 'object' && e.id)
                        : [];

                    console.log('Valid Events:', validEvents); // DEBUG LOG
                    setEvents(validEvents);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError('Failed to load events. Please make sure the backend server is running.');
                    console.error('Error loading events:', err);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadEvents();

        return () => {
            isMounted = false;
        };
    }, []);

    const handleCategorySelect = useCallback((category) => {
        setSelectedCategory(category);
        setShowCategoryDropdown(false);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, []);

    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1); // Reset to page 1 on search change
    }, []);

    const toggleDropdown = useCallback(() => {
        setShowCategoryDropdown(prev => !prev);
    }, []);

    // Filter events based on search and category - Memoized
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // Safe access using optional chaining and fallbacks
            const eventName = event.name || '';
            const eventDesc = event.description || '';

            // Search filter (event name or description)
            const matchesSearch = searchQuery === '' ||
                eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                eventDesc.toLowerCase().includes(searchQuery.toLowerCase());

            // Category filter
            // Map 'Details' UI category to BOTH 'Technical' and 'Non-Technical' backend types
            // Since everything is now 'Details', selecting it should show everything (except maybe Mega Events if they were separate?)
            // Assuming we just want to match the label map.

            // If selectedCategory is 'Details', we match both types.
            // If 'All Categories', match everything.

            const matchesCategory = selectedCategory === 'All Categories' ||
                (selectedCategory === 'Details' && (event.type === 'Technical' || event.type === 'Non-Technical'));

            return matchesSearch && matchesCategory;
        });
    }, [events, searchQuery, selectedCategory]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const currentEvents = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const lastPageIndex = firstPageIndex + ITEMS_PER_PAGE;
        return filteredEvents.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, filteredEvents]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        // Scroll to top of grid or just slightly up
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    return (
        <div className="events-root" style={{ backgroundImage: `url(${mainBg})` }}>
            <div className="events-overlay"></div>

            {/* Top Navigation Bar */}
            <nav className="events-nav">
                <Link to="/" className="nav-btn back-btn">
                    <svg viewBox="0 0 24 24" className="icon"><path fill="currentColor" d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path></svg>
                    Go to Home
                </Link>
                <div className="nav-right">

                    <Link to="/profile" className="nav-btn dashboard-btn">
                        Dashboard
                        <svg viewBox="0 0 24 24" className="icon arrow-right"><path fill="currentColor" d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"></path></svg>
                    </Link>
                </div>
            </nav>

            {/* Main Content Glass Container */}
            <div className="events-glass-container">
                <h1 className="events-title">Events</h1>
                <p className="events-subtitle">20+ Events, Infinite Possibilities – Ignite Your Passion, Unleash Your Talent!</p>

                {/* Info Card */}
                <div className="events-info-card">
                    <div className="info-main-text">
                        Register <span className="highlight-text">₹000</span> and participate in <span className="highlight-text">events</span>
                    </div>
                    <div className="info-sub-text">— no extra charges later!</div>
                    <div className="info-divider"></div>
                    <div className="info-contacts">
                        <div className="contact-item">
                            <span className="phone-icon">📞</span> add number
                        </div>
                        <div className="contact-item">
                            <span className="phone-icon">📞</span> add number
                        </div>
                        <div className="contact-item">
                            <span className="phone-icon">📞</span> add number
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="events-filters">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search epic quests here..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <svg viewBox="0 0 24 24" className="search-icon"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
                    </div>

                    <div className="filter-buttons">
                        <div className="category-dropdown-container">
                            <button
                                className={`filter-btn ${showCategoryDropdown ? 'active' : ''}`}
                                onClick={toggleDropdown}
                            >
                                <span className="icon">✨</span> {selectedCategory}
                            </button>
                            {showCategoryDropdown && (
                                <div className="category-dropdown-menu">
                                    {CATEGORIES.map((cat) => (
                                        <div
                                            key={cat}
                                            className="category-item"
                                            onClick={() => handleCategorySelect(cat)}
                                        >
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button className="filter-btn">
                            <span className="icon">📖</span> Rule Book
                        </button>
                        <button className="filter-btn">
                            <span className="icon">🕒</span> Schedule
                        </button>
                    </div>
                </div>

                {/* Events Grid */}
                {loading ? (
                    <div className="events-loading">
                        <div className="loading-spinner"></div>
                        <p>Loading events...</p>
                    </div>
                ) : error ? (
                    <div className="events-error">
                        <p>{error}</p>
                        <button onClick={loadEvents} className="retry-btn">Try Again</button>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="events-grid-empty">
                        <p>No events found matching your criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className="events-bento-grid">
                            {currentEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="pagination-container">
                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    &lt;
                                </button>

                                {[...Array(totalPages)].map((_, index) => {
                                    const pageNum = index + 1;
                                    // Logic for showing limited page numbers if needed, 
                                    // for now showing all as total pages likely small
                                    return (
                                        <button
                                            key={pageNum}
                                            className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                            onClick={() => handlePageChange(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    className="pagination-btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    &gt;
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
