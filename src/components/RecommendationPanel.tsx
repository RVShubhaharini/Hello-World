import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  Music, 
  Film, 
  Lightbulb, 
  Quote, 
  ExternalLink, 
  Play, 
  RefreshCw,
  Heart,
  Star,
  Clock,
  Wifi,
  WifiOff,
  Loader2
} from 'lucide-react';
import { getRecommendationsForMood, getRandomRecommendations, MoodRecommendations } from '@/lib/recommendations';
import { getSpotifyRecommendationsForMood, getMockSpotifyRecommendations } from '@/lib/spotifyService';
import { getMovieRecommendationsForMood, getMockMovieRecommendations } from '@/lib/movieService';
import { useToast } from '@/hooks/use-toast';

interface RecommendationPanelProps {
  mood: string;
  moodEmoji: string;
}

const RecommendationPanel: React.FC<RecommendationPanelProps> = ({ mood, moodEmoji }) => {
  const [recommendations, setRecommendations] = useState<MoodRecommendations | null>(
    getRecommendationsForMood(mood)
  );
  const [useLiveData, setUseLiveData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load recommendations when mood changes
  useEffect(() => {
    loadRecommendations();
  }, [mood, useLiveData]);

  const loadRecommendations = async () => {
    if (useLiveData) {
      setIsLoading(true);
      try {
        const [spotifyRecs, movieRecs] = await Promise.all([
          getSpotifyRecommendationsForMood(mood),
          getMovieRecommendationsForMood(mood)
        ]);

        // If live data fails, fall back to mock data
        const musicRecs = spotifyRecs.length > 0 ? spotifyRecs : getMockSpotifyRecommendations(mood);
        const moviesRecs = movieRecs.length > 0 ? movieRecs : getMockMovieRecommendations(mood);
        
        const staticRecs = getRecommendationsForMood(mood);
        if (staticRecs) {
          setRecommendations({
            ...staticRecs,
            music: musicRecs,
            movies: moviesRecs
          });
        }
      } catch (error) {
        console.error('Error loading live recommendations:', error);
        // Fall back to static recommendations
        setRecommendations(getRecommendationsForMood(mood));
        toast({
          title: "Using Offline Recommendations",
          description: "Live data unavailable, showing curated suggestions.",
          variant: "default"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setRecommendations(getRecommendationsForMood(mood));
    }
  };

  const handleRefreshRecommendations = () => {
    if (useLiveData) {
      loadRecommendations();
    } else {
      const newRecommendations = getRandomRecommendations(mood, 3);
      if (newRecommendations) {
        setRecommendations(newRecommendations);
      }
    }
    
    toast({
      title: "Recommendations Refreshed! ✨",
      description: "Here are some fresh suggestions for your mood.",
    });
  };

  const handlePlayMusic = (title: string, artist: string) => {
    toast({
      title: "🎵 Music Preview",
      description: `Playing preview of "${title}" by ${artist}`,
    });
  };

  const handleWatchMovie = (title: string) => {
    toast({
      title: "🎬 Movie Suggestion",
      description: `"${title}" would be perfect for your current mood!`,
    });
  };

  if (!recommendations) {
    return (
      <Card className="p-6 glass-effect border-0">
        <div className="text-center space-y-4">
          <div className="text-4xl">🤔</div>
          <h3 className="text-lg font-caveat font-semibold gradient-text">
            No recommendations available
          </h3>
          <p className="text-muted-foreground">
            We don't have recommendations for this mood yet.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass-effect border-0">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{moodEmoji}</div>
            <div>
              <h3 className="text-xl font-caveat font-semibold gradient-text">
                Perfect for your {mood} mood
              </h3>
              <p className="text-sm text-muted-foreground">
                {useLiveData ? 'Live recommendations' : 'Curated suggestions'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <WifiOff className="h-4 w-4 text-muted-foreground" />
              <Switch
                checked={useLiveData}
                onCheckedChange={setUseLiveData}
                disabled={isLoading}
              />
              <Wifi className="h-4 w-4 text-primary" />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshRecommendations}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Tabs for different recommendation types */}
        <Tabs defaultValue="music" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="music" className="flex items-center space-x-2">
              <Music className="h-4 w-4" />
              <span>Music</span>
            </TabsTrigger>
            <TabsTrigger value="movies" className="flex items-center space-x-2">
              <Film className="h-4 w-4" />
              <span>Movies</span>
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Activities</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center space-x-2">
              <Quote className="h-4 w-4" />
              <span>Quotes</span>
            </TabsTrigger>
          </TabsList>

          {/* Music Recommendations */}
          <TabsContent value="music" className="space-y-4">
            <div className="space-y-3">
              {recommendations.music.map((song) => (
                <Card key={song.id} className="p-4 border-accent/20 hover:border-primary/30 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={song.imageUrl}
                        alt={song.album}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48/6366f1/ffffff?text=🎵';
                        }}
                      />
                      <Button
                        size="sm"
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
                        onClick={() => handlePlayMusic(song.title, song.artist)}
                      >
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{song.title}</h4>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {song.popularity}%
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(song.spotifyUrl, '_blank')}
                      className="flex items-center space-x-1"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Movie Recommendations */}
          <TabsContent value="movies" className="space-y-4">
            <div className="space-y-3">
              {recommendations.movies.map((movie) => (
                <Card key={movie.id} className="p-4 border-accent/20 hover:border-primary/30 transition-colors">
                  <div className="flex items-start space-x-4">
                    <img
                      src={movie.imageUrl}
                      alt={movie.title}
                      className="w-16 h-24 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x96/6366f1/ffffff?text=🎬';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{movie.title}</h4>
                          <p className="text-xs text-muted-foreground">{movie.year}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          {movie.rating}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {movie.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {movie.genre.slice(0, 2).map((genre) => (
                          <Badge key={genre} variant="secondary" className="text-xs">
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          size="sm"
                          onClick={() => handleWatchMovie(movie.title)}
                          className="flex items-center space-x-1"
                        >
                          <Film className="h-3 w-3" />
                          <span>Watch</span>
                        </Button>
                        <div className="text-xs text-muted-foreground">
                          Available on: {movie.streamingPlatforms.join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Recommendations */}
          <TabsContent value="activities" className="space-y-4">
            <div className="space-y-3">
              {recommendations.activities.map((activity, index) => (
                <Card key={index} className="p-4 border-accent/20 hover:border-primary/30 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{activity}</p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Quote Recommendations */}
          <TabsContent value="quotes" className="space-y-4">
            <div className="space-y-3">
              {recommendations.quotes.map((quote, index) => (
                <Card key={index} className="p-6 border-accent/20 hover:border-primary/30 transition-colors">
                  <div className="text-center space-y-3">
                    <Quote className="h-8 w-8 text-primary mx-auto opacity-50" />
                    <blockquote className="text-sm italic text-foreground leading-relaxed">
                      "{quote}"
                    </blockquote>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="pt-4 border-t border-accent/20">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-2">
              {useLiveData ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span>Live data from Spotify & TMDB</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3" />
                  <span>Curated recommendations</span>
                </>
              )}
            </div>
            <div className="text-center">
              Toggle live data for real-time suggestions! ✨
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecommendationPanel;
