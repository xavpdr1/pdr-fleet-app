// Initialize splash screen
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    console.log('[Splash] Page loaded, splash element:', !!splashScreen);

    if (splashScreen) {
        // Ensure it's visible
        splashScreen.style.display = 'flex';
        console.log('[Splash] Splash screen visible, waiting 3.5 seconds before fade...');
        
        // Wait 3.5 seconds, then fade out
        setTimeout(() => {
            console.log('[Splash] Adding fade-out class');
            splashScreen.classList.add('fade-out');

            // Remove from DOM after fade completes
            setTimeout(() => {
                console.log('[Splash] Removing splash screen from DOM');
                splashScreen.remove();
            }, 1000);
        }, 3500);
    } else {
        console.log('[Splash] ERROR: splash-screen element not found!');
    }
});
