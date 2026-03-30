(() => {
    const localhostHosts = new Set(['localhost', '127.0.0.1']);
    const configuredBaseUrl = window.PORTFOLIO_API_BASE_URL || '';
    const normalizedConfiguredBaseUrl = configuredBaseUrl.trim().replace(/\/$/, '');
    const defaultBaseUrl = localhostHosts.has(window.location.hostname)
        ? 'http://localhost:3000/api'
        : 'https://portfolio-v9v2.onrender.com/api';

    window.PORTFOLIO_API_URL = normalizedConfiguredBaseUrl || defaultBaseUrl;
})();
