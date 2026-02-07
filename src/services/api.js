// API Service for Envision Backend

const API_BASE_URL = 'http://localhost:5000/api';

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
            return events;
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
