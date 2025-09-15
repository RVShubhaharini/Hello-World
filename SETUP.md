# MoodVibe Journal - Complete Setup Guide

## 🚀 Quick Start

Your mood tracking app is now ready with full authentication and cloud sync! Here's how to set it up:

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Supabase Account** (free tier available)
3. **Git** (optional, for version control)

## 🗄️ Database Setup (Supabase)

### Step 1: Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Wait for the project to be ready (2-3 minutes)

### Step 2: Set Up Database Tables
Run these SQL commands in your Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create mood_entries table
CREATE TABLE mood_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  mood TEXT NOT NULL,
  emoji TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Set up Row Level Security policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own mood entries" ON mood_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries" ON mood_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries" ON mood_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries" ON mood_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Step 3: Get Your Supabase Credentials
1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy your:
   - Project URL
   - Anon public key

## ⚙️ Environment Setup

### Step 1: Create Environment File
1. Copy `env.example` to `.env.local`
2. Fill in your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-ui-react @supabase/auth-ui-shared
```

## 🎯 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## ✨ Features Included

### 🔐 Authentication
- **Email/Password Sign Up & Sign In**
- **Password Reset**
- **Secure Session Management**
- **User Profile Management**

### 📊 Mood Tracking
- **Daily Mood Entries** with emojis and descriptions
- **Calendar View** of your mood history
- **Statistics Dashboard** with mood trends
- **Cloud Sync** - access from any device

### 🎵 Recommendations
- **Music Suggestions** based on your mood
- **Movie Recommendations** for your current vibe
- **Activity Ideas** to match your feelings
- **Inspirational Quotes** for each mood
- **Live Data Toggle** for real-time recommendations

### 🎨 Beautiful UI
- **Responsive Design** works on all devices
- **Floating Particles** that react to your mood
- **Smooth Animations** and transitions
- **Dark/Light Theme** support
- **Glass Morphism** design elements

## 🔧 Optional: Live API Integrations

### Spotify Integration
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add your credentials to `.env.local`:
```env
VITE_SPOTIFY_CLIENT_ID=your-client-id
VITE_SPOTIFY_CLIENT_SECRET=your-client-secret
```

### Movie Database Integration
1. Get API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Add to `.env.local`:
```env
VITE_TMDB_API_KEY=your-api-key
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Netlify
1. Build your project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## 📱 Usage

1. **Sign Up/Login** with your email
2. **Track Your Moods** daily in the Journal tab
3. **View Statistics** in the Stats tab
4. **Get Recommendations** in the Recommendations tab
5. **Manage Profile** in the Profile tab
6. **Sign Out** when done

## 🔒 Security Features

- **Row Level Security** in Supabase
- **JWT Authentication** tokens
- **Secure API endpoints**
- **User data isolation**
- **Password hashing** and validation

## 🆘 Troubleshooting

### Common Issues:

1. **"Cannot find module '@supabase/supabase-js'"**
   - Run: `npm install @supabase/supabase-js`

2. **"Invalid API key"**
   - Check your `.env.local` file
   - Verify Supabase credentials

3. **"Database connection failed"**
   - Check your Supabase project status
   - Verify database tables are created

4. **"Authentication failed"**
   - Check email/password
   - Verify email confirmation if required

## 🎉 You're All Set!

Your complete mood tracking app with authentication is ready! Users can now:
- Create accounts and sign in securely
- Save their mood data in the cloud
- Access their journal from any device
- Get personalized recommendations
- Track their emotional journey over time

Enjoy your beautiful, fully-featured mood journal! 🌟
