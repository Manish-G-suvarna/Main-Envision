try {
    await import('./routes/paymentRoutes.js');
    console.log('Payment setup successfully');
} catch (error) {
    console.error('Failed to load payment routes:', error);
}
