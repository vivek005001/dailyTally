# Shop Daily Dashboard - Vercel Deployment Guide

## Prerequisites
- Git repository for your project
- Vercel account (free tier works)
- Supabase project with tables created

## Deployment Steps

### 1. Prepare Your Repository

**Initialize Git** (if not already done):
```bash
cd /Users/vivek/Downloads/Tal
git init
git add .
git commit -m "Initial commit"
```

**Push to GitHub/GitLab** (optional but recommended):
```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/shop-dashboard.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

**Option A: Using Vercel CLI**

Install Vercel CLI:
```bash
npm install -g vercel
```

Deploy:
```bash
cd /Users/vivek/Downloads/Tal
vercel
```

**Option B: Using Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your Git repository
4. Click "Deploy"

### 3. Set Environment Variables in Vercel

After deployment, add your Supabase credentials:

1. Go to your project in Vercel dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | `https://exkdujvkgaqdolvhvqtl.supabase.co` |
| `SUPABASE_ANON_KEY` | `sb_publishable_qM7J2BWnVIyb9WheKdyluA_Ab9YHiFF` |

4. Click "Save"
5. **Redeploy** your project for changes to take effect

### 4. Update config.js for Production

Your `config.js` is already set up and will work on Vercel as-is. The file is included in `.gitignore` for security, but you can also:

**Alternative: Use Vercel's Environment Variables**

If you want to use Vercel's environment variables, you would need to add a build step. For a simple static site, keeping `config.js` is easier.

### 5. Verify Deployment

1. Visit your Vercel URL (e.g., `https://your-project.vercel.app`)
2. Check browser console for connection status
3. Test adding a sale
4. Verify data saves to Supabase

## Important Files

### `.env.local` (Local Development)
Contains your actual Supabase credentials for local testing. **Never commit this file.**

### `.env.example` (Template)
Template showing required environment variables. Safe to commit.

### `config.example.js` (Template)
Example config file for reference. Safe to commit.

### `config.js` (Active Config)
Your actual credentials. Excluded from Git via `.gitignore`.

### `.gitignore`
Prevents sensitive files from being committed:
- `.env.local`
- `config.js`
- `node_modules/`

## Security Best Practices

### ✅ What's Safe
- Supabase **anon/public key** (in config.js) - designed for client-side use
- Deploying with config.js included in build

### ⚠️ Never Expose
- Supabase **service role key** - keep server-side only
- Database passwords
- Admin credentials

### 🔒 Additional Security (Optional)

For production, consider:

1. **Enable RLS policies** in Supabase (already done)
2. **Add authentication** to restrict access
3. **Use custom domain** for professional appearance
4. **Enable HTTPS** (automatic with Vercel)

## Vercel Configuration

### Custom Domain (Optional)

1. Go to project **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. SSL automatically configured

### Performance

Vercel automatically provides:
- ✅ Global CDN
- ✅ HTTPS/SSL
- ✅ Automatic compression
- ✅ Caching

## Troubleshooting

### Issue: "Supabase not defined"
**Solution:** Make sure `config.js` is deployed with your project

### Issue: Database connection fails
**Solution:** 
1. Check Supabase credentials are correct
2. Verify RLS policies allow public access
3. Check browser console for specific errors

### Issue: 404 errors
**Solution:** Vercel serves `index.html` automatically. Make sure it's in the root directory.

## Updating Your Deployment

**Automatic Updates:**
If connected to Git, Vercel auto-deploys on `git push`

**Manual Updates:**
```bash
vercel --prod
```

## Local Development

Keep using:
```bash
python3 -m http.server 8000
```

Or install a better dev server:
```bash
npx http-server -p 8000
```

---

## Quick Commands Summary

```bash
# Initialize Git
git init
git add .
git commit -m "Initial commit"

# Deploy to Vercel
vercel

# Or deploy to production
vercel --prod

# Local development
python3 -m http.server 8000
```

Your shop dashboard is now ready for production! 🚀
