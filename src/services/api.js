// API Service for Envision Backend

const API_BASE_URL = 'http://localhost:3000/api/v1';

/**
 * Fetch all events from the backend
 */
export async function fetchEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Safe JSON parsing
        const text = await response.text();
        try {
            const events = JSON.parse(text);
            return events.map(event => ({
                ...event,
                name: event.event_name,
                // Ensure other fields match if needed, but name is the critical one missing
                // Also keeping event_name just in case
            }));
        } catch (e) {
            console.error('Failed to parse events JSON:', text);
            throw new Error('Invalid JSON response from server');
        }
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

/**
 * Fetch team members
 */
export async function fetchTeamMembers() {
    try {
        const response = await fetch(`${API_BASE_URL}/team`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const team = await response.json();
        return team;
    } catch (error) {
        console.error('Error fetching team:', error);
        throw error;
    }
}
