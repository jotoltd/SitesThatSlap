#!/bin/bash

echo "🚀 Setting up Supabase for Sites That Slap..."

# Login to Supabase
echo "📱 Opening browser to login..."
npx supabase@latest login

# Link project
echo "🔗 Linking to project qwlezodyzpiqegoajvpg..."
npx supabase@latest link --project-ref qwlezodyzpiqegoajvpg

# Push schema
echo "📊 Pushing database schema..."
npx supabase@latest db push

echo "✅ Supabase setup complete!"
echo ""
echo "Next steps:"
echo "1. Go to Supabase Dashboard → Authentication → Users"
echo "2. Create users:"
echo "   - admin@jotoltd.com / admin123 (role: admin)"
echo "   - client@example.com / client123 (role: client)"
echo "3. Run: UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@jotoltd.com';"
