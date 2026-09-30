// Initialize splash screen
document.addEventListener('DOMContentLoaded', function() {
    const splashScreen = document.getElementById('splash-screen');
    
    // Alert to absolutely confirm this is running
    alert('SPLASH SCREEN STARTING - You should see this alert!');
    
    console.log('[Splash] DOMContentLoaded fired');
    console.log('[Splash] splash-screen element found:', !!splashScreen);
    
    if (splashScreen) {
        // Make it extremely obvious
        splashScreen.style.display = 'flex !important';
        splashScreen.style.opacity = '1 !important';
        splashScreen.style.visibility = 'visible !important';
        
        console.log('[Splash] Made splash screen visible');
        console.log('[Splash] Will fade out in 4 seconds');
        
        // Wait 4 seconds, then fade out
        setTimeout(() => {
            console.log('[Splash] Now fading out...');
            splashScreen.classList.add('fade-out');

            // Remove from DOM after fade completes
            setTimeout(() => {
                console.log('[Splash] Removing from DOM');
                if (splashScreen.parentNode) {
                    splashScreen.parentNode.removeChild(splashScreen);
                }
            }, 1000);
        }, 4000);
    } else {
        console.error('[Splash] CRITICAL: splash-screen element NOT FOUND!');
        alert('ERROR: splash-screen element not found in DOM!');
    }
});
