// Cookie Consent Banner Script - GDPR & Privacy Compliant
(function() {
    // Check if user has already made a choice
    function hasChoice() {
        return localStorage.getItem('cookieConsent') !== null;
    }

    // Mark consent as accepted
    function acceptCookies() {
        localStorage.setItem('cookieConsent', 'accepted');
        hideBanner();
    }

    // Mark consent as declined
    function declineCookies() {
        localStorage.setItem('cookieConsent', 'declined');
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
        if (hasChoice()) {
            return;
        }

        // Create banner HTML with Accept, Decline, and Manage Preferences
        const bannerHTML = `
            <div id="cookie-consent-banner" style="
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #f5f5f5;
                color: #333;
                padding: 20px;
                z-index: 9999;
                box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
                font-family: 'Open Sans', sans-serif;
                border-top: 3px solid #d93535;
            ">
                <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 20px; flex-wrap: wrap; justify-content: space-between;">
                    <p style="margin: 0; flex: 1; min-width: 280px; font-size: 14px; line-height: 1.6; color: #333;">
                        We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. You can accept all cookies, decline, or manage your preferences. Learn more in our <a href="https://elizabethsbakedgoods.com/privacy-policy.html" style="color: #d93535; text-decoration: none; font-weight: bold;" target="_blank">Privacy Policy</a>.
                    </p>
                    <div style="display: flex; gap: 12px; white-space: nowrap; align-items: center;">
                        <a id="manage-preferences-link" href="https://elizabethsbakedgoods.com/privacy-policy.html" style="
                            color: #d93535;
                            text-decoration: none;
                            font-weight: 600;
                            font-size: 14px;
                            cursor: pointer;
                            padding: 8px 12px;
                            transition: color 0.3s ease;
                        " target="_blank">
                            Manage Preferences
                        </a>
                        <button id="cookie-decline-btn" style="
                            background-color: #f0f0f0;
                            color: #333;
                            border: 1px solid #d93535;
                            padding: 10px 18px;
                            border-radius: 5px;
                            font-weight: 600;
                            cursor: pointer;
                            font-size: 14px;
                            white-space: nowrap;
                            transition: all 0.3s ease;
                        ">
                            Decline
                        </button>
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
                        ">
                            Accept All
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Inject banner into page
        document.body.insertAdjacentHTML('beforeend', bannerHTML);

        // Add click handler to accept button
        const acceptBtn = document.getElementById('cookie-accept-btn');
        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptCookies);
            acceptBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#b72a2a';
            });
            acceptBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#d93535';
            });
        }

        // Add click handler to decline button
        const declineBtn = document.getElementById('cookie-decline-btn');
        if (declineBtn) {
            declineBtn.addEventListener('click', declineCookies);
            declineBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#e0e0e0';
                this.style.borderColor = '#b72a2a';
            });
            declineBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '#f0f0f0';
                this.style.borderColor = '#d93535';
            });
        }

        // Add hover effect to manage preferences link
        const manageLink = document.getElementById('manage-preferences-link');
        if (manageLink) {
            manageLink.addEventListener('mouseenter', function() {
                this.style.color = '#b72a2a';
            });
            manageLink.addEventListener('mouseleave', function() {
                this.style.color = '#d93535';
            });
        }
    }

    // Show banner when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', showBanner);
    } else {
        showBanner();
    }
})();
