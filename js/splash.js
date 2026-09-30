// Splash Screen Manager
class SplashScreen {
  constructor(duration = 2000) {
    this.duration = duration;
    this.splashElement = document.getElementById('splash-screen');
  }

  start() {
    // Logo appears and is visible for the specified duration
    setTimeout(() => {
      this.fade();
    }, this.duration);
  }

  fade() {
    // Fade out the splash screen
    if (this.splashElement) {
      this.splashElement.classList.add('fade-out');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (this.splashElement && this.splashElement.parentNode) {
          this.splashElement.parentNode.removeChild(this.splashElement);
        }
      }, 1000); // Match the transition duration in CSS
    }
  }
}

// Initialize splash screen when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const splash = new SplashScreen(2000); // 2 second display duration
  splash.start();
});
