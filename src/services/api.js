// API Service for Envision Backend
// Complete API integration with authentication, events, orders, and payments

const API_BASE_URL = 'http://localhost:5000/api';

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

/**
 * Get JWT token from localStorage
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Make authenticated API call
 */
async function apiCall(endpoint, options = {}) {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// =====================================================
// AUTHENTICATION APIs
// =====================================================

/**
 * Register new user
 * POST /api/auth/register
 */
export async function registerUser(userData) {
    try {
        const response = await apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                college: userData.college,
                password: userData.password,
            }),
        });

        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
}

/**
 * Login user
 * POST /api/auth/login
 */
export async function loginUser(email, password) {
    try {
        const response = await apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
            }),
        });

        if (response.token) {
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
}

/**
 * Verify JWT token
 * POST /api/auth/verify
 */
export async function verifyToken() {
    try {
        const response = await apiCall('/auth/verify', {
            method: 'POST',
        });
        return response;
    } catch (error) {
        console.error('Error verifying token:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        throw error;
    }
}

/**
 * Get user profile
 * GET /api/auth/profile
 */
export async function getUserProfile() {
    try {
        const response = await apiCall('/auth/profile', {
            method: 'GET',
        });
        return response.user;
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
}

/**
 * Update user profile
 * PUT /api/auth/update-profile
 */
export async function updateUserProfile(profileData) {
    try {
        const response = await apiCall('/auth/update-profile', {
            method: 'PUT',
            body: JSON.stringify({
                name: profileData.name,
                phone: profileData.phone,
                college: profileData.college,
            }),
        });

        if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
        }

        return response;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

/**
 * Change user password
 * PUT /api/auth/change-password
 */
export async function changePassword(currentPassword, newPassword) {
    try {
        const response = await apiCall('/auth/change-password', {
            method: 'PUT',
            body: JSON.stringify({
                currentPassword,
                newPassword,
            }),
        });
        return response;
    } catch (error) {
        console.error('Error changing password:', error);
        throw error;
    }
}

/**
 * Logout user
 * Clears local storage
 */
export function logoutUser() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
}

// =====================================================
// EVENTS APIs
// =====================================================

/**
 * Fetch all events from the backend
 * GET /api/events
 */
export async function fetchEvents() {
    try {
        const response = await fetch(`${API_BASE_URL}/events`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const events = await response.json();
        return events;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
}

/**
 * Get single event by ID
 */
export async function getEventById(eventId) {
    try {
        const events = await fetchEvents();
        return events.find(e => e.id === eventId);
    } catch (error) {
        console.error('Error fetching event:', error);
        throw error;
    }
}

// =====================================================
// TEAM APIs
// =====================================================

/**
 * Fetch team members
 * GET /api/team
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

// =====================================================
// ORDERS APIs
// =====================================================

/**
 * Create new order
 * POST /api/orders
 */
export async function createOrder(orderData) {
    try {
        const result = await apiCall('/orders', {
            method: 'POST',
            body: JSON.stringify({
                name: orderData.name,
                email: orderData.email,
                phone: orderData.phone,
                college: orderData.college,
                teamName: orderData.teamName || null,
                teamSize: orderData.teamSize || 1,
                cartItems: orderData.cartItems,
            }),
        });

        // Save order to localStorage for reference
        if (result.order) {
            localStorage.setItem('lastOrder', JSON.stringify(result.order));
        }

        return result;
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

/**
 * Get order by ID
 * GET /api/orders/:orderId
 */
export async function getOrder(orderId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.order;
    } catch (error) {
        console.error('Error fetching order:', error);
        throw error;
    }
}

/**
 * Get user's orders (all registrations)
 * Note: Backend needs to implement this endpoint
 * GET /api/orders/user/:userId
 */
export async function getUserOrders(userId) {
    try {
        const response = await apiCall(`/orders/user/${userId}`, {
            method: 'GET',
        });
        return response.orders || [];
    } catch (error) {
        console.error('Error fetching user orders:', error);
        throw error;
    }
}

// =====================================================
// PAYMENT APIs (Razorpay)
// =====================================================

/**
 * Create Razorpay payment order
 * POST /api/payment/create-order
 * Backend will fetch the amount from database (secure)
 */
export async function createPaymentOrder(orderId) {
    try {
        const response = await apiCall('/payment/create-order', {
            method: 'POST',
            body: JSON.stringify({
                orderId,
            }),
        });
        return response;
    } catch (error) {
        console.error('Error creating payment order:', error);
        throw error;
    }
}

/**
 * Verify payment signature
 * POST /api/payment/verify-payment
 */
export async function verifyPayment(paymentDetails) {
    try {
        const response = await apiCall('/payment/verify-payment', {
            method: 'POST',
            body: JSON.stringify({
                orderId: paymentDetails.orderId,
                razorpayPaymentId: paymentDetails.razorpayPaymentId,
                razorpayOrderId: paymentDetails.razorpayOrderId,
                razorpaySignature: paymentDetails.razorpaySignature,
            }),
        });

        // Clear cart after successful payment
        if (response.success) {
            localStorage.removeItem('cart');
        }

        return response;
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw error;
    }
}

/**
 * Check payment status
 * GET /api/payment/status/:orderId
 */
export async function getPaymentStatus(orderId) {
    try {
        const response = await apiCall(`/payment/status/${orderId}`, {
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.error('Error fetching payment status:', error);
        throw error;
    }
}

/**
 * Initialize Razorpay payment modal
 */
export async function initiateRazorpayPayment(orderData) {
    try {
        // Create payment order first
        const paymentOrder = await createPaymentOrder(
            orderData.orderId,
            orderData.totalAmount
        );

        // Load Razorpay script if not already loaded
        if (!window.Razorpay) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.head.appendChild(script);

            await new Promise((resolve) => {
                script.onload = resolve;
            });
        }

        // Razorpay options
        const options = {
            key: paymentOrder.razorpayKeyId,
            amount: paymentOrder.orderAmount * 100, // Convert to paise
            order_id: paymentOrder.orderId,
            name: 'ENVISION 2026',
            description: 'Event Registration Payment',
            image: '/logo.png',
            handler: async (response) => {
                // Verify payment on backend
                return {
                    success: true,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpayOrderId: response.razorpay_order_id,
                    razorpaySignature: response.razorpay_signature,
                };
            },
            prefill: {
                name: orderData.name,
                email: orderData.email,
                contact: orderData.phone,
            },
            theme: {
                color: '#ff9d00',
            },
        };

        return new Promise((resolve, reject) => {
            const razorpay = new window.Razorpay(options);

            razorpay.on('payment.failed', (response) => {
                reject(new Error(response.error.description));
            });

            razorpay.open();
            resolve(true);
        });
    } catch (error) {
        console.error('Error initiating Razorpay payment:', error);
        throw error;
    }
}

// =====================================================
// CART MANAGEMENT (Local State)
// =====================================================

/**
 * Add event to cart
 */
export function addToCart(event) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if event already in cart
        if (cart.find(item => item.id === event.id)) {
            console.warn('Event already in cart');
            return cart;
        }

        cart.push(event);
        localStorage.setItem('cart', JSON.stringify(cart));

        // Dispatch custom event for real-time updates
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: cart }));

        return cart;
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

/**
 * Remove event from cart
 */
export function removeFromCart(eventId) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const filtered = cart.filter(item => item.id !== eventId);
        localStorage.setItem('cart', JSON.stringify(filtered));

        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: filtered }));

        return filtered;
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

/**
 * Get cart items
 */
export function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (error) {
        console.error('Error getting cart:', error);
        return [];
    }
}

/**
 * Clear cart
 */
export function clearCart() {
    localStorage.removeItem('cart');
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: [] }));
}

/**
 * Calculate cart total
 */
export function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.fee || 0), 0);
}

/**
 * Get cart item count
 */
export function getCartCount() {
    return getCart().length;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
    return !!getAuthToken();
}

/**
 * Get current user
 */
export function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch {
        return null;
    }
}

/**
 * Health check
 */
export async function healthCheck() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
    } catch {
        return false;
    }
}
