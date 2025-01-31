from typing import Dict, List, Optional
import json
import requests
from ..core.config import settings
import pandas as pd
import re
import isodate

class PlayerContentService:
    def __init__(self):
        self._load_player_images()
        self._load_mlb_hr_data()
    
    def _load_player_images(self):
        """Load player images from JSON file"""
        try:
            with open('data/player_embeds.json', 'r') as f:
                self.player_images = json.load(f)
        except FileNotFoundError:
            self.player_images = {}
    
    def _load_mlb_hr_data(self):
        """Load MLB home run data from CSV files"""
        try:
            mlb_hr_csvs_list = [
                'https://storage.googleapis.com/gcp-mlb-hackathon-2025/datasets/2024-mlb-homeruns.csv',
                'https://storage.googleapis.com/gcp-mlb-hackathon-2025/datasets/2024-postseason-mlb-homeruns.csv'
            ]
            
            # Create DataFrame to store all home run data
            dfs = []
            for csv_url in mlb_hr_csvs_list:
                df = pd.read_csv(csv_url)
                season = re.search(r'/datasets/(\d{4})', csv_url).group(1)
                df['season'] = season
                dfs.append(df)
            
            self.all_mlb_hrs = pd.concat(dfs, ignore_index=True)[
                ['season', 'play_id', 'title', 'ExitVelocity', 'LaunchAngle', 'HitDistance', 'video']
            ]
        except Exception as e:
            print(f"Error loading MLB home run data: {e}")
            self.all_mlb_hrs = pd.DataFrame()

    def get_player_images(self, team: str, player: str) -> List[str]:
        """Get Getty Images embeds for a player"""
        try:
            return self.player_images.get(team, {}).get(player, [])
        except Exception as e:
            print(f"Error getting player images: {e}")
            return []

    def get_player_news(self, player_name: str, limit: int = 10) -> List[Dict]:
        """
        Get news about a player using Google Custom Search
        Args:
            player_name: Name of the player
            limit: Number of results to return (default 10, max 100)
        """
        API_KEY = settings.GOOGLE_API_KEY
        SEARCH_ENGINE_ID = settings.GOOGLE_SEARCH_ENGINE_ID
        BASE_URL = "https://www.googleapis.com/customsearch/v1"
        
        processed_results = []
        # Calculate number of requests needed (10 results per request)
        num_requests = (min(limit, 100) + 9) // 10  # Round up division, max 100 results
        
        try:
            for i in range(num_requests):
                start_index = (i * 10) + 1  # Google's start index begins at 1
                
                params = {
                    'key': API_KEY,
                    'cx': SEARCH_ENGINE_ID,
                    'q': f"{player_name} mlb latest news",
                    'start': start_index
                }
                
                response = requests.get(BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()
                
                for item in data.get('items', []):
                    result = {
                        'url': item.get('link'),
                        'domain': item.get('displayLink'),
                        'title': item.get('title'),
                        'snippet': item.get('snippet'),
                        'image_url': (item.get('pagemap', {})
                                    .get('metatags', [{}])[0]
                                    .get('og:image'))
                    }
                    if all(result.values()):
                        processed_results.append(result)
                        
                    # Stop if we've reached the requested number of results
                    if len(processed_results) >= limit:
                        break
                
                # Stop pagination if we've reached the requested number of results
                if len(processed_results) >= limit:
                    break
            
            return processed_results[:limit]
            
        except Exception as e:
            print(f"Error getting player news: {e}")
            return []

    def get_player_videos(
        self,
        player_name: str,
        max_results: int = 10,
        min_duration: int = 60,
        max_duration: int = 350
    ) -> List[Dict]:
        """Get YouTube videos about a player"""
        API_KEY = settings.GOOGLE_API_KEY
        BASE_URL = "https://www.googleapis.com/youtube/v3/search"
        
        params = {
            'part': 'snippet',
            'q': f"{player_name} mlb highlights",
            'maxResults': max_results,
            'key': API_KEY,
            'type': 'video',
            'order': 'date'
        }
        
        try:
            response = requests.get(BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            video_ids = [item['id']['videoId'] for item in data.get('items', [])]
            
            # Get video durations
            videos_url = "https://www.googleapis.com/youtube/v3/videos"
            videos_params = {
                'part': 'contentDetails',
                'id': ','.join(video_ids),
                'key': API_KEY
            }
            
            videos_response = requests.get(videos_url, params=videos_params)
            videos_response.raise_for_status()
            videos_data = videos_response.json()
            
            # Process and filter videos
            processed_videos = []
            for item in data.get('items', []):
                video_id = item['id']['videoId']
                video_details = next(
                    (v for v in videos_data.get('items', []) 
                     if v['id'] == video_id), None
                )
                
                if video_details:
                    duration_str = video_details['contentDetails']['duration']
                    duration_seconds = int(isodate.parse_duration(duration_str).total_seconds())
                    
                    if min_duration <= duration_seconds <= max_duration:
                        processed_videos.append({
                            'video_id': video_id,
                            'title': item['snippet']['title'],
                            'description': item['snippet']['description'],
                            'thumbnail': item['snippet']['thumbnails']['high']['url'],
                            'duration_seconds': duration_seconds,
                            'embed_code': f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>'
                        })
            
            return processed_videos
            
        except Exception as e:
            print(f"Error getting player videos: {e}")
            return []

    def search_news(self, query: str, limit: int = 10) -> List[Dict]:
        """
        Get news using Google Custom Search with custom query
        Args:
            query: Search query string
            limit: Number of results to return (default 10, max 100)
        """
        API_KEY = settings.GOOGLE_API_KEY
        SEARCH_ENGINE_ID = settings.GOOGLE_SEARCH_ENGINE_ID
        BASE_URL = "https://www.googleapis.com/customsearch/v1"
        
        processed_results = []
        # Calculate number of requests needed (10 results per request)
        num_requests = (min(limit, 100) + 9) // 10  # Round up division, max 100 results
        
        try:
            for i in range(num_requests):
                start_index = (i * 10) + 1  # Google's start index begins at 1
                
                params = {
                    'key': API_KEY,
                    'cx': SEARCH_ENGINE_ID,
                    'q': query,
                    'start': start_index
                }
                
                response = requests.get(BASE_URL, params=params)
                response.raise_for_status()
                data = response.json()
                
                for item in data.get('items', []):
                    result = {
                        'url': item.get('link'),
                        'domain': item.get('displayLink'),
                        'title': item.get('title'),
                        'snippet': item.get('snippet'),
                        'image_url': (item.get('pagemap', {})
                                    .get('metatags', [{}])[0]
                                    .get('og:image'))
                    }
                    if all(result.values()):
                        processed_results.append(result)
                        
                    # Stop if we've reached the requested number of results
                    if len(processed_results) >= limit:
                        break
                
                # Stop pagination if we've reached the requested number of results
                if len(processed_results) >= limit:
                    break
            
            return processed_results[:limit]
            
        except Exception as e:
            print(f"Error searching news: {e}")
            return []

    def get_player_hr_videos(self, player_name: str) -> List[Dict]:
        """
        Get home run videos for a specific player
        Args:
            player_name: Name of the player
        Returns:
            List of dictionaries containing home run video information
        """
        try:
            # Filter home runs by player name
            player_hrs = []
            for _, row in self.all_mlb_hrs.iterrows():
                if player_name.lower() in row['title'].lower():
                    hr_info = {
                        'play_id': row['play_id'],
                        'title': row['title'],
                        'video_url': row['video'],
                        'exit_velocity': row['ExitVelocity'],
                        'launch_angle': row['LaunchAngle'],
                        'hit_distance': row['HitDistance'],
                        'season': row['season']
                    }
                    player_hrs.append(hr_info)
            return player_hrs
            
        except Exception as e:
            print(f"Error getting player home run videos: {e}")
            return []

    def search_videos(
        self,
        query: str,
        max_results: int = 10,
        min_duration: int = 60,
        max_duration: int = 1200
    ) -> List[Dict]:
        """
        Search videos with custom query using YouTube API
        Args:
            query: Search query string
            max_results: Maximum number of results to return
            min_duration: Minimum video duration in seconds
            max_duration: Maximum video duration in seconds
        Returns:
            List of video information
        """
        API_KEY = settings.GOOGLE_API_KEY
        BASE_URL = "https://www.googleapis.com/youtube/v3/search"
        
        params = {
            'part': 'snippet',
            'q': f"{query} mlb",
            'maxResults': max_results,
            'key': API_KEY,
            'type': 'video',
            'order': 'relevance'
        }
        
        try:
            response = requests.get(BASE_URL, params=params)
            response.raise_for_status()
            data = response.json()
            
            video_ids = [item['id']['videoId'] for item in data.get('items', [])]
            
            # Get video durations
            videos_url = "https://www.googleapis.com/youtube/v3/videos"
            videos_params = {
                'part': 'contentDetails',
                'id': ','.join(video_ids),
                'key': API_KEY
            }
            
            videos_response = requests.get(videos_url, params=videos_params)
            videos_response.raise_for_status()
            videos_data = videos_response.json()
            
            # Process and filter videos
            processed_videos = []
            for item in data.get('items', []):
                video_id = item['id']['videoId']
                video_details = next(
                    (v for v in videos_data.get('items', []) 
                     if v['id'] == video_id), None
                )
                
                if video_details:
                    duration_str = video_details['contentDetails']['duration']
                    duration_seconds = int(isodate.parse_duration(duration_str).total_seconds())
                    
                    if min_duration <= duration_seconds <= max_duration:
                        processed_videos.append({
                            'video_id': video_id,
                            'title': item['snippet']['title'],
                            'description': item['snippet']['description'],
                            'thumbnail': item['snippet']['thumbnails']['high']['url'],
                            'duration_seconds': duration_seconds,
                            'embed_code': f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>'
                        })
            
            return processed_videos
            
        except Exception as e:
            print(f"Error searching videos: {e}")
            return []