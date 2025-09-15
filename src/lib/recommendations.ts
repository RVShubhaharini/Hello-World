// Mood-based recommendation data structure
export interface MusicRecommendation {
  id: string;
  title: string;
  artist: string;
  album: string;
  spotifyUrl: string;
  previewUrl?: string;
  imageUrl: string;
  duration: number;
  popularity: number;
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
}

export interface MoodRecommendations {
  music: MusicRecommendation[];
  movies: MovieRecommendation[];
  activities: string[];
  quotes: string[];
}

// Comprehensive mood-based recommendations
export const moodRecommendations: Record<string, MoodRecommendations> = {
  happy: {
    music: [
      {
        id: "1",
        title: "Happy",
        artist: "Pharrell Williams",
        album: "Girl",
        spotifyUrl: "https://open.spotify.com/track/60nZcImufyMA1MKQY3dcC",
        previewUrl: "https://p.scdn.co/mp3-preview/example1",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example1",
        duration: 233,
        popularity: 85
      },
      {
        id: "2",
        title: "Can't Stop the Feeling!",
        artist: "Justin Timberlake",
        album: "Trolls (Original Motion Picture Soundtrack)",
        spotifyUrl: "https://open.spotify.com/track/1WkMMavIMc4JZ8cfMmxHkI",
        previewUrl: "https://p.scdn.co/mp3-preview/example2",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example2",
        duration: 236,
        popularity: 82
      },
      {
        id: "3",
        title: "Good as Hell",
        artist: "Lizzo",
        album: "Cuz I Love You",
        spotifyUrl: "https://open.spotify.com/track/6KgBpzTuTRPebChN0VTyzV",
        previewUrl: "https://p.scdn.co/mp3-preview/example3",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example3",
        duration: 163,
        popularity: 78
      }
    ],
    movies: [
      {
        id: "1",
        title: "The Secret Life of Walter Mitty",
        year: 2013,
        genre: ["Adventure", "Comedy", "Drama"],
        rating: 7.3,
        description: "A day-dreamer escapes his anonymous life by disappearing into a world of fantasies filled with heroism, romance and action.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example1.jpg",
        streamingPlatforms: ["Netflix", "Amazon Prime"],
        mood: "happy"
      },
      {
        id: "2",
        title: "La La Land",
        year: 2016,
        genre: ["Comedy", "Drama", "Musical"],
        rating: 8.0,
        description: "A jazz pianist and an aspiring actress fall in love while pursuing their dreams in Los Angeles.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example2.jpg",
        streamingPlatforms: ["Netflix", "Hulu"],
        mood: "happy"
      }
    ],
    activities: [
      "Take a walk in nature and appreciate the beauty around you",
      "Call a friend or family member to share your joy",
      "Try a new hobby or creative activity",
      "Dance to your favorite upbeat songs",
      "Write down three things you're grateful for today"
    ],
    quotes: [
      "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
      "The secret of happiness is to find a congenial work. - Pearl S. Buck",
      "Joy is the simplest form of gratitude. - Karl Barth"
    ]
  },
  
  calm: {
    music: [
      {
        id: "4",
        title: "Weightless",
        artist: "Marconi Union",
        album: "Weightless (Ambient Transmission Vol. 2)",
        spotifyUrl: "https://open.spotify.com/track/2qhjWqVFiH5ELy4jWck1B",
        previewUrl: "https://p.scdn.co/mp3-preview/example4",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example4",
        duration: 485,
        popularity: 65
      },
      {
        id: "5",
        title: "Clair de Lune",
        artist: "Claude Debussy",
        album: "Debussy: Clair de Lune",
        spotifyUrl: "https://open.spotify.com/track/1E1UQQXG8EjYvddXcM7Llo",
        previewUrl: "https://p.scdn.co/mp3-preview/example5",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example5",
        duration: 298,
        popularity: 70
      }
    ],
    movies: [
      {
        id: "3",
        title: "The Grand Budapest Hotel",
        year: 2014,
        genre: ["Adventure", "Comedy", "Crime"],
        rating: 8.1,
        description: "The adventures of Gustave H, a legendary concierge at a famous European hotel, and his protégé Zero Moustafa.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example3.jpg",
        streamingPlatforms: ["Disney+", "Amazon Prime"],
        mood: "calm"
      },
      {
        id: "4",
        title: "Lost in Translation",
        year: 2003,
        genre: ["Drama"],
        rating: 7.7,
        description: "A faded movie star and a neglected young woman form an unlikely bond after crossing paths in Tokyo.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example4.jpg",
        streamingPlatforms: ["Netflix"],
        mood: "calm"
      }
    ],
    activities: [
      "Practice deep breathing or meditation",
      "Read a book in a quiet, comfortable spot",
      "Take a warm bath with essential oils",
      "Do some gentle yoga or stretching",
      "Listen to calming nature sounds"
    ],
    quotes: [
      "Peace comes from within. Do not seek it without. - Buddha",
      "The present moment is the only time over which we have dominion. - Thích Nhất Hạnh",
      "Calm mind brings inner strength and self-confidence. - Dalai Lama"
    ]
  },

  energetic: {
    music: [
      {
        id: "6",
        title: "Eye of the Tiger",
        artist: "Survivor",
        album: "Eye of the Tiger",
        spotifyUrl: "https://open.spotify.com/track/2HHtWyy5CgaQbC7XSoOb0e",
        previewUrl: "https://p.scdn.co/mp3-preview/example6",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example6",
        duration: 245,
        popularity: 88
      },
      {
        id: "7",
        title: "Thunder",
        artist: "Imagine Dragons",
        album: "Evolve",
        spotifyUrl: "https://open.spotify.com/track/1zB4vmk8tFRmM9UULNzbLB",
        previewUrl: "https://p.scdn.co/mp3-preview/example7",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example7",
        duration: 187,
        popularity: 84
      }
    ],
    movies: [
      {
        id: "5",
        title: "Mad Max: Fury Road",
        year: 2015,
        genre: ["Action", "Adventure", "Sci-Fi"],
        rating: 7.6,
        description: "In a post-apocalyptic wasteland, Max teams up with a mysterious woman to escape from a tyrannical warlord.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example5.jpg",
        streamingPlatforms: ["HBO Max", "Amazon Prime"],
        mood: "energetic"
      },
      {
        id: "6",
        title: "Baby Driver",
        year: 2017,
        genre: ["Action", "Crime", "Music"],
        rating: 7.6,
        description: "After being coerced into working for a crime boss, a young getaway driver finds himself taking part in a heist doomed to fail.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example6.jpg",
        streamingPlatforms: ["Netflix", "Amazon Prime"],
        mood: "energetic"
      }
    ],
    activities: [
      "Go for a high-intensity workout or run",
      "Dance to your favorite energetic songs",
      "Try a new sport or physical activity",
      "Clean and organize your space with enthusiasm",
      "Take on a challenging project or goal"
    ],
    quotes: [
      "Energy and persistence conquer all things. - Benjamin Franklin",
      "The way to get started is to quit talking and begin doing. - Walt Disney",
      "Success is the sum of small efforts repeated day in and day out. - Robert Collier"
    ]
  },

  sad: {
    music: [
      {
        id: "8",
        title: "Someone You Loved",
        artist: "Lewis Capaldi",
        album: "Divinely Uninspired To A Hellish Extent",
        spotifyUrl: "https://open.spotify.com/track/7qEHsqek33rTcFNT9PFqLf",
        previewUrl: "https://p.scdn.co/mp3-preview/example8",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example8",
        duration: 182,
        popularity: 80
      },
      {
        id: "9",
        title: "Fix You",
        artist: "Coldplay",
        album: "X&Y",
        spotifyUrl: "https://open.spotify.com/track/7LVHVU3tWfcxj5aiPFEW4Q",
        previewUrl: "https://p.scdn.co/mp3-preview/example9",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example9",
        duration: 294,
        popularity: 85
      }
    ],
    movies: [
      {
        id: "7",
        title: "The Pursuit of Happyness",
        year: 2006,
        genre: ["Biography", "Drama"],
        rating: 8.0,
        description: "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example7.jpg",
        streamingPlatforms: ["Netflix", "Amazon Prime"],
        mood: "sad"
      },
      {
        id: "8",
        title: "Inside Out",
        year: 2015,
        genre: ["Animation", "Adventure", "Comedy"],
        rating: 8.1,
        description: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions conflict on how best to navigate a new city.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example8.jpg",
        streamingPlatforms: ["Disney+"],
        mood: "sad"
      }
    ],
    activities: [
      "Allow yourself to feel and process your emotions",
      "Reach out to a trusted friend or family member",
      "Write in a journal about your feelings",
      "Watch a comforting movie or TV show",
      "Practice self-care activities like taking a warm bath"
    ],
    quotes: [
      "The way sadness works is one of the strange riddles of the world. - Lemony Snicket",
      "Tears are words that need to be written. - Paulo Coelho",
      "The sun will rise and we will try again. - Twenty One Pilots"
    ]
  },

  excited: {
    music: [
      {
        id: "10",
        title: "Don't Stop Me Now",
        artist: "Queen",
        album: "Jazz",
        spotifyUrl: "https://open.spotify.com/track/5T8EDUDqKcs6OSOwEsfqG7",
        previewUrl: "https://p.scdn.co/mp3-preview/example10",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example10",
        duration: 211,
        popularity: 90
      },
      {
        id: "11",
        title: "Uptown Funk",
        artist: "Mark Ronson ft. Bruno Mars",
        album: "Uptown Special",
        spotifyUrl: "https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS",
        previewUrl: "https://p.scdn.co/mp3-preview/example11",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example11",
        duration: 269,
        popularity: 92
      }
    ],
    movies: [
      {
        id: "9",
        title: "The Greatest Showman",
        year: 2017,
        genre: ["Biography", "Drama", "Musical"],
        rating: 7.6,
        description: "Celebrates the birth of show business and tells of a visionary who rose from nothing to create a spectacle that became a worldwide sensation.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example9.jpg",
        streamingPlatforms: ["Disney+", "Amazon Prime"],
        mood: "excited"
      },
      {
        id: "10",
        title: "Spider-Man: Into the Spider-Verse",
        year: 2018,
        genre: ["Animation", "Action", "Adventure"],
        rating: 8.4,
        description: "Teen Miles Morales becomes Spider-Man of his reality, crossing his path with five counterparts from other dimensions.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example10.jpg",
        streamingPlatforms: ["Netflix", "Amazon Prime"],
        mood: "excited"
      }
    ],
    activities: [
      "Plan something fun to look forward to",
      "Share your excitement with others",
      "Try something new and adventurous",
      "Create a vision board for your goals",
      "Celebrate your achievements, big or small"
    ],
    quotes: [
      "Excitement is the more practical synonym for happiness. - Tom Bilyeu",
      "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
      "Life is either a daring adventure or nothing at all. - Helen Keller"
    ]
  },

  peaceful: {
    music: [
      {
        id: "12",
        title: "Weightless",
        artist: "Marconi Union",
        album: "Weightless (Ambient Transmission Vol. 2)",
        spotifyUrl: "https://open.spotify.com/track/2qhjWqVFiH5ELy4jWck1B",
        previewUrl: "https://p.scdn.co/mp3-preview/example12",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example12",
        duration: 485,
        popularity: 65
      },
      {
        id: "13",
        title: "River Flows in You",
        artist: "Yiruma",
        album: "First Love",
        spotifyUrl: "https://open.spotify.com/track/7hS0UD3IUuVUhdwDwpZ8hT",
        previewUrl: "https://p.scdn.co/mp3-preview/example13",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example13",
        duration: 199,
        popularity: 75
      }
    ],
    movies: [
      {
        id: "11",
        title: "My Neighbor Totoro",
        year: 1988,
        genre: ["Animation", "Family", "Fantasy"],
        rating: 8.2,
        description: "When two girls move to the country to be near their ailing mother, they have adventures with the wondrous forest spirits who live nearby.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example11.jpg",
        streamingPlatforms: ["HBO Max"],
        mood: "peaceful"
      },
      {
        id: "12",
        title: "The Secret Garden",
        year: 1993,
        genre: ["Drama", "Family", "Fantasy"],
        rating: 7.3,
        description: "A young, recently-orphaned girl is sent to England to live with her uncle at his huge house, where she discovers a magical garden.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example12.jpg",
        streamingPlatforms: ["Amazon Prime"],
        mood: "peaceful"
      }
    ],
    activities: [
      "Spend time in nature, perhaps in a garden or park",
      "Practice mindfulness or meditation",
      "Read poetry or inspirational books",
      "Take a leisurely walk without any destination",
      "Engage in gentle, creative activities like drawing or writing"
    ],
    quotes: [
      "Peace is not absence of conflict, it is the ability to handle conflict by peaceful means. - Ronald Reagan",
      "The mind is everything. What you think you become. - Buddha",
      "In the midst of movement and chaos, keep stillness inside of you. - Deepak Chopra"
    ]
  },

  anxious: {
    music: [
      {
        id: "14",
        title: "Weightless",
        artist: "Marconi Union",
        album: "Weightless (Ambient Transmission Vol. 2)",
        spotifyUrl: "https://open.spotify.com/track/2qhjWqVFiH5ELy4jWck1B",
        previewUrl: "https://p.scdn.co/mp3-preview/example14",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example14",
        duration: 485,
        popularity: 65
      },
      {
        id: "15",
        title: "Breathe (In the Air)",
        artist: "Pink Floyd",
        album: "The Dark Side of the Moon",
        spotifyUrl: "https://open.spotify.com/track/2ctvdKmETyOzPb2GiJJT57",
        previewUrl: "https://p.scdn.co/mp3-preview/example15",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example15",
        duration: 163,
        popularity: 78
      }
    ],
    movies: [
      {
        id: "13",
        title: "The Secret Life of Walter Mitty",
        year: 2013,
        genre: ["Adventure", "Comedy", "Drama"],
        rating: 7.3,
        description: "A day-dreamer escapes his anonymous life by disappearing into a world of fantasies filled with heroism, romance and action.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example13.jpg",
        streamingPlatforms: ["Netflix", "Amazon Prime"],
        mood: "anxious"
      },
      {
        id: "14",
        title: "Inside Out",
        year: 2015,
        genre: ["Animation", "Adventure", "Comedy"],
        rating: 8.1,
        description: "After young Riley is uprooted from her Midwest life and moved to San Francisco, her emotions conflict on how best to navigate a new city.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example14.jpg",
        streamingPlatforms: ["Disney+"],
        mood: "anxious"
      }
    ],
    activities: [
      "Practice deep breathing exercises (4-7-8 technique)",
      "Try progressive muscle relaxation",
      "Write down your worries and then let them go",
      "Take a warm bath or shower",
      "Listen to calming music or nature sounds"
    ],
    quotes: [
      "Anxiety is the dizziness of freedom. - Søren Kierkegaard",
      "You have been assigned this mountain to show others it can be moved. - Mel Robbins",
      "This too shall pass. - Persian adage"
    ]
  },

  grateful: {
    music: [
      {
        id: "16",
        title: "What a Wonderful World",
        artist: "Louis Armstrong",
        album: "What a Wonderful World",
        spotifyUrl: "https://open.spotify.com/track/29U7stRjqHU6rMiS8BfaI9",
        previewUrl: "https://p.scdn.co/mp3-preview/example16",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example16",
        duration: 139,
        popularity: 82
      },
      {
        id: "17",
        title: "Count on Me",
        artist: "Bruno Mars",
        album: "Doo-Wops & Hooligans",
        spotifyUrl: "https://open.spotify.com/track/7l1qvxWjxcKpB9PCtBuTbU",
        previewUrl: "https://p.scdn.co/mp3-preview/example17",
        imageUrl: "https://i.scdn.co/image/ab67616d0000b273example17",
        duration: 183,
        popularity: 75
      }
    ],
    movies: [
      {
        id: "15",
        title: "It's a Wonderful Life",
        year: 1946,
        genre: ["Drama", "Family", "Fantasy"],
        rating: 8.6,
        description: "An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example15.jpg",
        streamingPlatforms: ["Amazon Prime"],
        mood: "grateful"
      },
      {
        id: "16",
        title: "The Pursuit of Happyness",
        year: 2006,
        genre: ["Biography", "Drama"],
        rating: 8.0,
        description: "A struggling salesman takes custody of his son as he's poised to begin a life-changing professional career.",
        imageUrl: "https://image.tmdb.org/t/p/w500/example16.jpg",
        streamingPlatforms: ["Netflix", "Amazon Prime"],
        mood: "grateful"
      }
    ],
    activities: [
      "Write a gratitude letter to someone who has impacted your life",
      "Keep a gratitude journal and write three things you're thankful for daily",
      "Practice random acts of kindness",
      "Spend quality time with loved ones",
      "Reflect on your personal growth and achievements"
    ],
    quotes: [
      "Gratitude turns what we have into enough. - Anonymous",
      "Be thankful for what you have; you'll end up having more. - Oprah Winfrey",
      "The unthankful heart discovers no mercies; but the thankful heart will find, in every hour, some heavenly blessings to be thankful for. - Henry Ward Beecher"
    ]
  }
};

// Function to get recommendations for a specific mood
export const getRecommendationsForMood = (mood: string): MoodRecommendations | null => {
  return moodRecommendations[mood] || null;
};

// Function to get random recommendations from a mood category
export const getRandomRecommendations = (mood: string, count: number = 3) => {
  const recommendations = getRecommendationsForMood(mood);
  if (!recommendations) return null;

  return {
    music: recommendations.music.sort(() => 0.5 - Math.random()).slice(0, count),
    movies: recommendations.movies.sort(() => 0.5 - Math.random()).slice(0, count),
    activities: recommendations.activities.sort(() => 0.5 - Math.random()).slice(0, count),
    quotes: recommendations.quotes.sort(() => 0.5 - Math.random()).slice(0, 1)
  };
};

