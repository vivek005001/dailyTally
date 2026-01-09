// Supabase Configuration Template
// Copy this file to config.js and fill in your actual Supabase credentials
// You can find these in your Supabase project settings under API

const SUPABASE_CONFIG = {
    url: 'YOUR_SUPABASE_PROJECT_URL', // Example: https://xxxxxxxxxxxxx.supabase.co
    anonKey: 'YOUR_SUPABASE_ANON_KEY' // Your project's anon/public key
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}
