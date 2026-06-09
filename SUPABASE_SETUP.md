# Supabase Setup Instructions

## Quick Setup (Run these commands)

```bash
# 1. Login to Supabase (opens browser)
npx supabase@latest login

# 2. Link your project
npx supabase@latest link --project-ref qwlezodyzpiqegoajvpg

# 3. Push database schema
npx supabase@latest db push
```

## Manual Setup (If CLI doesn't work)

1. Go to https://supabase.com/dashboard
2. Sign in and select project `qwlezodyzpiqegoajvpg`
3. Go to **SQL Editor** → **New Query**
4. Copy and paste the SQL from `supabase/migrations/001_initial_schema.sql`
5. Click **Run**

## Create Test Users

After schema is set up, create users in the Supabase Dashboard:

1. Go to **Authentication** → **Users** → **Add User**
2. Create these users:

**Admin User:**
- Email: `admin@jotoltd.com`
- Password: `admin123`
- Role: `admin`

**Client User:**
- Email: `client@example.com`
- Password: `client123`
- Role: `client`

3. Or run this SQL to create them:

```sql
-- Create admin user (run in Supabase SQL Editor)
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin@jotoltd.com',
  '{"name": "Admin", "role": "admin"}'::jsonb,
  NOW(),
  NOW()
);

-- Create client user
INSERT INTO auth.users (id, email, raw_user_meta_data, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'client@example.com',
  '{"name": "John Client", "role": "client"}'::jsonb,
  NOW(),
  NOW()
);
```

## Environment Variables

Make sure your `.env` file has these:

```
VITE_SUPABASE_URL=https://qwlezodyzpiqegoajvpg.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get your anon key from: Supabase Dashboard → Settings → API

## ⚠️ IMPORTANT: Email Confirmation Settings

For clients to login immediately when created by admin (without email confirmation):

1. Go to **Authentication** → **Providers** → **Email**
2. Turn OFF **"Confirm email"** toggle
3. Click **Save**

If email confirmation is enabled, clients will receive an email and must click the confirmation link before they can login.

### Email Settings (Optional)
To send actual confirmation emails, configure an email provider:
1. Go to **Authentication** → **Email Templates**
2. Customize the confirmation email template
3. Set up an SMTP provider (Resend, SendGrid, etc.) in **Settings** → **Authentication**
