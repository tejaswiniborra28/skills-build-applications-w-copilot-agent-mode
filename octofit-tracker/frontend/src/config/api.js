/**
 * API Configuration for OctoFit Tracker
 * 
 * Environment Variables Required:
 * - VITE_CODESPACE_NAME: GitHub Codespaces name (e.g., "effective-garbanzo-vq957jp9rrhp4w4")
 *   Add to .env.local: VITE_CODESPACE_NAME=your-codespace-name
 * 
 * For localhost development (no Codespace name):
 * - Leave VITE_CODESPACE_NAME unset or empty in .env.local
 * - API will use http://localhost:8000/api/
 */

const codespaceName = import.meta.env.VITE_CODESPACE_NAME;

// Build API base URL
export const getApiBaseUrl = () => {
  if (codespaceName && codespaceName.trim()) {
    return `https://${codespaceName}-8000.app.github.dev/api`;
  }
  // Fallback to localhost
  return 'http://localhost:8000/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API endpoint builder
 * @param {string} endpoint - Endpoint path (e.g., 'users', 'activities')
 * @returns {string} Full API URL
 */
export const apiEndpoint = (endpoint) => {
  return `${API_BASE_URL}/${endpoint}`;
};

/**
 * Fetch helper with error handling
 */
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

/**
 * Log API configuration for debugging
 */
export const logApiConfig = () => {
  console.log('🔧 OctoFit API Configuration:');
  console.log(`  Base URL: ${API_BASE_URL}`);
  console.log(`  Codespace: ${codespaceName || 'None (localhost mode)'}`);
};
