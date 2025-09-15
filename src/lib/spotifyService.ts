// Spotify Web API integration service
export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
  }>;
  album: {
    id: string;
    name: string;
    images: Array<{
      url: string;
      height: number;
      width: number;
    }>;
  };
  external_urls: {
    spotify: string;
  };
  preview_url: string | null;
  duration_ms: number;
  popularity: number;
}

export interface SpotifyRecommendations {
  tracks: SpotifyTrack[];
}

// Mood to Spotify seed parameters mapping
const moodToSpotifyParams: Record<string, {
  seed_genres: string[];
  target_valence: number; // 0.0 to 1.0 (musical positivity)
  target_energy: number; // 0.0 to 1.0 (perceptual measure of intensity)
  target_danceability: number; // 0.0 to 1.0 (suitability for dancing)
  target_tempo?: number; // BPM
  limit: number;
}> = {
  happy: {
    seed_genres: ['pop', 'happy', 'dance'],
    target_valence: 0.8,
    target_energy: 0.7,
    target_danceability: 0.8,
    target_tempo: 120,
    limit: 10
  },
  calm: {
    seed_genres: ['ambient', 'chill', 'acoustic'],
    target_valence: 0.6,
    target_energy: 0.3,
    target_danceability: 0.4,
    target_tempo: 80,
    limit: 10
  },
  energetic: {
    seed_genres: ['rock', 'electronic', 'work-out'],
    target_valence: 0.7,
    target_energy: 0.9,
    target_danceability: 0.7,
    target_tempo: 140,
    limit: 10
  },
  sad: {
    seed_genres: ['blues', 'soul', 'indie'],
    target_valence: 0.2,
    target_energy: 0.4,
    target_danceability: 0.3,
    target_tempo: 70,
    limit: 10
  },
  excited: {
    seed_genres: ['pop', 'dance', 'electronic'],
    target_valence: 0.9,
    target_energy: 0.8,
    target_danceability: 0.9,
    target_tempo: 130,
    limit: 10
  },
  peaceful: {
    seed_genres: ['ambient', 'new-age', 'classical'],
    target_valence: 0.5,
    target_energy: 0.2,
    target_danceability: 0.2,
    target_tempo: 60,
    limit: 10
  },
  anxious: {
    seed_genres: ['ambient', 'chill', 'meditation'],
    target_valence: 0.4,
    target_energy: 0.2,
    target_danceability: 0.3,
    target_tempo: 70,
    limit: 10
  },
  grateful: {
    seed_genres: ['folk', 'acoustic', 'singer-songwriter'],
    target_valence: 0.7,
    target_energy: 0.5,
    target_danceability: 0.5,
    target_tempo: 90,
    limit: 10
  }
};

class SpotifyService {
  private clientId: string;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    // In a real app, you'd get this from environment variables
    this.clientId = 'your_spotify_client_id_here';
  }

  // Get client credentials token (for public data access)
  private async getClientCredentialsToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${this.clientId}:your_client_secret_here`)}`
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) {
        throw new Error('Failed to get Spotify token');
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Error getting Spotify token:', error);
      throw error;
    }
  }

  // Get recommendations based on mood
  async getRecommendationsByMood(mood: string): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getClientCredentialsToken();
      const params = moodToSpotifyParams[mood];
      
      if (!params) {
        throw new Error(`No Spotify parameters defined for mood: ${mood}`);
      }

      const queryParams = new URLSearchParams({
        seed_genres: params.seed_genres.join(','),
        target_valence: params.target_valence.toString(),
        target_energy: params.target_energy.toString(),
        target_danceability: params.target_danceability.toString(),
        limit: params.limit.toString()
      });

      if (params.target_tempo) {
        queryParams.append('target_tempo', params.target_tempo.toString());
      }

      const response = await fetch(
        `https://api.spotify.com/v1/recommendations?${queryParams}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data: SpotifyRecommendations = await response.json();
      return data.tracks;
    } catch (error) {
      console.error('Error getting Spotify recommendations:', error);
      // Return empty array on error to gracefully handle failures
      return [];
    }
  }

  // Search for tracks by query
  async searchTracks(query: string, limit: number = 10): Promise<SpotifyTrack[]> {
    try {
      const token = await this.getClientCredentialsToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      console.error('Error searching Spotify tracks:', error);
      return [];
    }
  }

  // Get track details by ID
  async getTrack(trackId: string): Promise<SpotifyTrack | null> {
    try {
      const token = await this.getClientCredentialsToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/tracks/${trackId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting Spotify track:', error);
      return null;
    }
  }

  // Convert Spotify track to our recommendation format
  convertToRecommendation(track: SpotifyTrack) {
    return {
      id: track.id,
      title: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      album: track.album.name,
      spotifyUrl: track.external_urls.spotify,
      previewUrl: track.preview_url,
      imageUrl: track.album.images[0]?.url || 'https://via.placeholder.com/300x300/1db954/ffffff?text=🎵',
      duration: Math.floor(track.duration_ms / 1000),
      popularity: track.popularity
    };
  }
}

// Export singleton instance
export const spotifyService = new SpotifyService();

// Utility function to get mood-based recommendations
export const getSpotifyRecommendationsForMood = async (mood: string) => {
  try {
    const tracks = await spotifyService.getRecommendationsByMood(mood);
    return tracks.map(track => spotifyService.convertToRecommendation(track));
  } catch (error) {
    console.error('Error getting Spotify recommendations:', error);
    return [];
  }
};

// Mock data for when Spotify API is not available
export const getMockSpotifyRecommendations = (mood: string) => {
  const mockTracks: Record<string, any[]> = {
    happy: [
      {
        id: "mock1",
        title: "Happy",
        artist: "Pharrell Williams",
        album: "Girl",
        spotifyUrl: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcC",
        previewUrl: null,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example1",
        duration: 233,
        popularity: 85
      }
    ],
    calm: [
      {
        id: "mock2",
        title: "Weightless",
        artist: "Marconi Union",
        album: "Weightless (Ambient Transmission Vol. 2)",
        spotifyUrl: "https://open.spotify.com/track/2qhjWqVFiH5ELy4jWck1B",
        previewUrl: null,
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example2",
        duration: 485,
        popularity: 65
      }
    ]
  };

  return mockTracks[mood] || [];
};

