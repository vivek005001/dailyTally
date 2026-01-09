// Supabase Configuration
// Replace these values with your actual Supabase project credentials
// You can find these in your Supabase project settings under API

const SUPABASE_CONFIG = {
    url: 'https://exkdujvkgaqdolvhvqtl.supabase.co', // Example: https://xxxxxxxxxxxxx.supabase.co
    anonKey: 'sb_publishable_qM7J2BWnVIyb9WheKdyluA_Ab9YHiFF' // Your project's anon/public key
};

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}
