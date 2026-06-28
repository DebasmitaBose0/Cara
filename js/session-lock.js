// Automated Inactivity Logout Monitor
document.addEventListener("DOMContentLoaded", () => {
    let timeout;
    const maxInactivity = 15 * 60 * 1000; // 15 Minutes

    const resetTimer = () => {
        clearTimeout(timeout);
        timeout = setTimeout(lockSession, maxInactivity);
    };

    const lockSession = () => {
        var consent = window.CaraCookieConsent ? window.CaraCookieConsent.getConsent() : null
        if (consent && !consent.functional) return
        localStorage.removeItem("cara_user_session");
        localStorage.removeItem("cara_user_token");
    };

    // User activity listeners
    ["click", "mousemove", "keypress", "scroll", "touchstart"].forEach(event => {
        document.addEventListener(event, resetTimer);
    });

    resetTimer();
});
