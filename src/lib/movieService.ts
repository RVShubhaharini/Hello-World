// Movie recommendation service using The Movie Database (TMDB) API
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  poster_path: string | null;
  backdrop_path: string | null;
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface MovieRecommendation {
  id: string;
  title: string;
  year: number;
  genre: string[];
  rating: number;
  description: string;
  imageUrl: string;
  streamingPlatforms: string[];
  mood: string;
  tmdbId: number;
}

// Mood to genre mapping for movie recommendations
const moodToGenres: Record<string, number[]> = {
  happy: [35, 10751, 16, 12], // Comedy, Family, Animation, Adventure
  calm: [18, 36, 14, 10749], // Drama, History, Fantasy, Romance
  energetic: [28, 12, 53, 878], // Action, Adventure, Thriller, Science Fiction
  sad: [18, 36, 10749, 14], // Drama, History, Romance, Fantasy
  excited: [28, 12, 35, 16], // Action, Adventure, Comedy, Animation
  peaceful: [18, 14, 10749, 36], // Drama, Fantasy, Romance, History
  anxious: [53, 27, 9648, 18], // Thriller, Horror, Mystery, Drama
  grateful: [18, 36, 10749, 35] // Drama, History, Romance, Comedy
};

// Genre ID to name mapping
const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Streaming platforms (mock data - in real app, you'd use a service like JustWatch)
const streamingPlatforms = ['Netflix', 'Amazon Prime', 'Disney+', 'HBO Max', 'Hulu', 'Apple TV+'];

class MovieService {
  private apiKey: string;
  private baseUrl: string = 'https://api.themoviedb.org/3';

  constructor() {
    // In a real app, you'd get this from environment variables
    this.apiKey = 'your_tmdb_api_key_here';
  }

  // Get movies by genre and mood
  async getMoviesByMood(mood: string, page: number = 1): Promise<MovieRecommendation[]> {
    try {
      const genreIds = moodToGenres[mood];
      if (!genreIds) {
        throw new Error(`No genres defined for mood: ${mood}`);
      }

      // Get movies from multiple genres
      const allMovies: TMDBMovie[] = [];
      
      for (const genreId of genreIds.slice(0, 2)) { // Limit to 2 genres to avoid too many requests
        const movies = await this.getMoviesByGenre(genreId, page);
        allMovies.push(...movies);
      }

      // Remove duplicates and convert to our format
      const uniqueMovies = this.removeDuplicateMovies(allMovies);
      return uniqueMovies.slice(0, 10).map(movie => this.convertToRecommendation(movie, mood));
    } catch (error) {
      console.error('Error getting movies by mood:', error);
      return [];
    }
  }

  // Get movies by genre
  private async getMoviesByGenre(genreId: number, page: number = 1): Promise<TMDBMovie[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&sort_by=popularity.desc&page=${page}&vote_count.gte=100`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: TMDBResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error getting movies by genre:', error);
      return [];
    }
  }

  // Search movies by query
  async searchMovies(query: string, page: number = 1): Promise<MovieRecommendation[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${encodeURIComponent(query)}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: TMDBResponse = await response.json();
      return data.results.slice(0, 10).map(movie => this.convertToRecommendation(movie, 'search'));
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }

  // Get trending movies
  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week'): Promise<MovieRecommendation[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/trending/movie/${timeWindow}?api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      const data: TMDBResponse = await response.json();
      return data.results.slice(0, 10).map(movie => this.convertToRecommendation(movie, 'trending'));
    } catch (error) {
      console.error('Error getting trending movies:', error);
      return [];
    }
  }

  // Get movie details by ID
  async getMovieDetails(movieId: number): Promise<TMDBMovie | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/movie/${movieId}?api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting movie details:', error);
      return null;
    }
  }

  // Remove duplicate movies
  private removeDuplicateMovies(movies: TMDBMovie[]): TMDBMovie[] {
    const seen = new Set<number>();
    return movies.filter(movie => {
      if (seen.has(movie.id)) {
        return false;
      }
      seen.add(movie.id);
      return true;
    });
  }

  // Convert TMDB movie to our recommendation format
  private convertToRecommendation(movie: TMDBMovie, mood: string): MovieRecommendation {
    const genres = movie.genre_ids.map(id => genreMap[id] || 'Unknown').filter(Boolean);
    const year = new Date(movie.release_date).getFullYear();
    
    return {
      id: movie.id.toString(),
      title: movie.title,
      year: year,
      genre: genres,
      rating: Math.round(movie.vote_average * 10) / 10,
      description: movie.overview,
      imageUrl: movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750/6366f1/ffffff?text=🎬',
      streamingPlatforms: this.getRandomStreamingPlatforms(),
      mood: mood,
      tmdbId: movie.id
    };
  }

  // Get random streaming platforms (mock implementation)
  private getRandomStreamingPlatforms(): string[] {
    const numPlatforms = Math.floor(Math.random() * 3) + 1; // 1-3 platforms
    const shuffled = [...streamingPlatforms].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numPlatforms);
  }
}

// Export singleton instance
export const movieService = new MovieService();

// Utility function to get mood-based movie recommendations
export const getMovieRecommendationsForMood = async (mood: string) => {
  try {
    return await movieService.getMoviesByMood(mood);
  } catch (error) {
    console.error('Error getting movie recommendations:', error);
    return [];
  }
};

// Mock data for when TMDB API is not available
export const getMockMovieRecommendations = (mood: string): MovieRecommendation[] => {
  const mockMovies: Record<string, MovieRecommendation[]> = {
    happy: [
      {
        id: "mock1",
        title: "The Secret Life of Walter Mitty",
        year: 2013,
        genre: ["Adventure", "Comedy", "Drama"],
        rating: 7.3,
        description: "A day-dreamer escapes his anonymous life by disappearing into a world of fantasies filled with heroism, romance and action.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example1.jpg",
        streamingPlatforms: ["Netflix", "Amazon Prime"],
        mood: "happy",
        tmdbId: 1
      }
    ],
    calm: [
      {
        id: "mock2",
        title: "The Grand Budapest Hotel",
        year: 2014,
        genre: ["Adventure", "Comedy", "Crime"],
        rating: 8.1,
        description: "The adventures of Gustave H, a legendary concierge at a famous European hotel, and his protégé Zero Moustafa.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example2.jpg",
        streamingPlatforms: ["Disney+", "Amazon Prime"],
        mood: "calm",
        tmdbId: 2
      }
    ]
  };

  return mockMovies[mood] || [];
};

