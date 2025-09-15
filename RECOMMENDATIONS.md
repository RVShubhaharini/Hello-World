# Mood-Based Recommendations Feature

## Overview
The MoodVibe Journal now includes a comprehensive recommendation system that provides personalized music, movie, activity, and quote suggestions based on your current mood.

## Features

### 🎵 Music Recommendations
- **Spotify Integration**: Real-time music recommendations using Spotify Web API
- **Mood-Based Filtering**: Songs are selected based on musical characteristics that match your mood:
  - **Happy**: Upbeat pop, dance music with high valence and energy
  - **Calm**: Ambient, acoustic music with low energy and high relaxation
  - **Energetic**: Rock, electronic music with high energy and tempo
  - **Sad**: Blues, soul music with lower valence for emotional processing
  - **Excited**: High-energy pop and dance music
  - **Peaceful**: Ambient, classical music for tranquility
  - **Anxious**: Calming ambient and meditation music
  - **Grateful**: Folk, acoustic music for reflection

### 🎬 Movie Recommendations
- **TMDB Integration**: Real-time movie recommendations using The Movie Database API
- **Genre-Based Filtering**: Movies are selected based on genres that complement your mood:
  - **Happy**: Comedy, Family, Animation, Adventure
  - **Calm**: Drama, History, Fantasy, Romance
  - **Energetic**: Action, Adventure, Thriller, Science Fiction
  - **Sad**: Drama, History, Romance, Fantasy
  - **Excited**: Action, Adventure, Comedy, Animation
  - **Peaceful**: Drama, Fantasy, Romance, History
  - **Anxious**: Thriller, Horror, Mystery, Drama
  - **Grateful**: Drama, History, Romance, Comedy

### 💡 Activity Suggestions
- Curated activities tailored to each mood
- Practical suggestions for mood enhancement
- Self-care and wellness focused recommendations

### 💬 Inspirational Quotes
- Motivational and uplifting quotes for each mood
- Wisdom from various sources to provide perspective
- Mood-appropriate messaging for emotional support

## How to Use

1. **Select a Mood**: Go to the Journal tab and select a date with a mood entry
2. **Access Recommendations**: Click the "Recommendations" tab
3. **Choose Data Source**: 
   - **Offline Mode**: Curated recommendations (default)
   - **Live Mode**: Real-time data from Spotify and TMDB APIs
4. **Explore Content**: Browse through Music, Movies, Activities, and Quotes tabs
5. **Refresh**: Click the refresh button to get new suggestions

## Technical Implementation

### Services
- **Spotify Service** (`src/lib/spotifyService.ts`): Handles Spotify Web API integration
- **Movie Service** (`src/lib/movieService.ts`): Handles TMDB API integration
- **Recommendations** (`src/lib/recommendations.ts`): Static recommendation data

### Components
- **RecommendationPanel** (`src/components/RecommendationPanel.tsx`): Main recommendation interface
- **Integration**: Seamlessly integrated into the main Index page

### API Configuration
To enable live recommendations, you'll need to:

1. **Spotify API**:
   - Create a Spotify app at [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Get your Client ID and Client Secret
   - Update `src/lib/spotifyService.ts` with your credentials

2. **TMDB API**:
   - Create an account at [The Movie Database](https://www.themoviedb.org/settings/api)
   - Get your API key
   - Update `src/lib/movieService.ts` with your API key

## Fallback System
The app gracefully handles API failures by:
- Falling back to mock data when APIs are unavailable
- Providing curated static recommendations as backup
- Showing appropriate user feedback for connection issues

## Future Enhancements
- User preference learning
- Playlist creation and sharing
- Social features for sharing recommendations
- Integration with more streaming platforms
- Personalized recommendation algorithms
- Mood-based activity tracking

## Usage Tips
- Try both offline and live modes to see the difference
- Use the refresh button to get new suggestions
- Explore different tabs for varied content types
- Combine recommendations with your mood journaling for better self-awareness
