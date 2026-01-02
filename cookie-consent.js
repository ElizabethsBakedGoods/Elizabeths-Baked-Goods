// Cookie Consent Banner Script
(function() {
    // Check if user has already consented
    function hasConsented() {
        return localStorage.getItem('cookieConsent') === 'accepted';
    }

    // Mark consent as accepted
    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        hideBanner();
    }

    // Hide the banner
    function hideBanner() {
        const banner = document.getElementById('cookie-consent-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    // Create and show the banner
    function showBanner() {
        if (hasConsented()) {
            return;
        }

        // Create banner HTML
        const bannerHTML = `
            <div id="cookie-consent-banner" style="
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #2c2c2c;
                color: #fff;
                padding: 20px;
                z-index: 9999;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.2);
                font-family: 'Open Sans', sans-serif;
            ">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: space-between;">
                    <p style="margin: 0; flex: 1; min-width: 250px; font-size: 14px; line-height: 1.6;">
                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. By continuing to use this site, you agree to our use of cookies. You can manage your preferences or learn more in our <a href="/privacy-policy.html" style="color: #d93535; text-decoration: underline;" target="_blank">Privacy Policy</a>.
                    </p>
                    <button id="cookie-accept-btn" style="
                        background-color: #d93535;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 5px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 14px;
                        white-space: nowrap;
                        transition: background-color 0.3s ease;
                    " onmouseover="this.style.backgroundColor='#b72a2a'" onmouseout="this.style.backgroundColor='#d93535'">
                        Accept
                    </button>
                </div>
            </div>
        `;

        // Inject banner into page
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Add click handler to accept button
        const acceptBtn = document.getElementById('cookie-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
        }
    }

    // Show banner when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBanner);
    } else {
        showBanner();
    }
})();
