from typing import Dict, List, Optional
import json
import requests
from app.core.config import settings
from app.core.translate_assistant import TranslateAssistant
import pandas as pd
import re
import isodate

class PlayerContentService:
    def __init__(self):
        self._load_player_images()
        self._load_mlb_hr_data()
        self.translator = TranslateAssistant(settings.GOOGLE_API_KEY)
    
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

    async def get_player_news(
        self,
        player_name: str,
        limit: int = 10,
        max_chars_title_en: Optional[int] = 50,
        max_chars_title_ja: Optional[int] = 30,
        max_chars_title_es: Optional[int] = 45,
        max_chars_summary_en: Optional[int] = 50,
        max_chars_summary_ja: Optional[int] = 65,
        max_chars_summary_es: Optional[int] = 65
    ) -> List[Dict]:
        """Get news about a player with optional translation"""
        results = []
        try:
            API_KEY = settings.GOOGLE_API_KEY
            SEARCH_ENGINE_ID = settings.GOOGLE_SEARCH_ENGINE_ID
            BASE_URL = "https://www.googleapis.com/customsearch/v1"
            
            num_requests = (min(limit, 100) + 9) // 10
            
            for i in range(num_requests):
                start_index = (i * 10) + 1
                
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
                    
                    if not all(result.values()):
                        continue

                    # Translate title
                    translated = await self.translator.translate(
                        result['title'],
                        'news_title',
                        max_chars_title_en,
                        max_chars_title_ja,
                        max_chars_title_es
                    )
                    result['title_en'] = translated['translatedEnText']
                    result['title_ja'] = translated['translatedJaText']
                    result['title_es'] = translated['translatedEsText']
                        
                    # Translate snippet
                    translated = await self.translator.translate(
                        result['snippet'],
                        'news_summary',
                        max_chars_summary_en,
                        max_chars_summary_ja,
                        max_chars_summary_es
                    )
                    result['snippet_en'] = translated['translatedEnText']
                    result['snippet_ja'] = translated['translatedJaText']
                    result['snippet_es'] = translated['translatedEsText']
                    
                    results.append(result)
                    if len(results) >= limit:
                        break
                
                if len(results) >= limit:
                    break
            
            return results[:limit]
            
        except Exception as e:
            print(f"Error getting player news: {e}")
            return []

    async def get_player_videos(
        self,
        player_name: str,
        limit: int = 10,
        min_duration: int = 20,
        max_duration: int = 350,
        max_chars_title_en: Optional[int] = 50,
        max_chars_title_ja: Optional[int] = 30,
        max_chars_title_es: Optional[int] = 45,
        max_chars_description_en: Optional[int] = 50,
        max_chars_description_ja: Optional[int] = 65,
        max_chars_description_es: Optional[int] = 65
    ) -> List[Dict]:
        """Get YouTube videos about a player with optional translation"""
        try:
            API_KEY = settings.GOOGLE_API_KEY
            BASE_URL = "https://www.googleapis.com/youtube/v3/search"
            
            params = {
                'part': 'snippet',
                'q': f"{player_name} mlb highlights",
                'maxResults': 20,
                'key': API_KEY,
                'type': 'video',
                'order': 'date'
            }
            
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
            
            # Process and filter videos with translation if needed
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
                        video_info = {
                            'video_id': video_id,
                            'title': item['snippet']['title'],
                            'description': item['snippet']['description'],
                            'thumbnail': item['snippet']['thumbnails']['high']['url'],
                            'duration_seconds': duration_seconds,
                            'embed_code': f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>'
                        }
                        
                        if not all(video_info.values()):
                            continue
                        
                        # Translate title
                        translated = await self.translator.translate(
                            video_info['title'],
                            'news_title',
                            max_chars_title_en,
                            max_chars_title_ja,
                            max_chars_title_es
                        )
                        video_info['title_en'] = translated['translatedEnText']
                        video_info['title_ja'] = translated['translatedJaText']
                        video_info['title_es'] = translated['translatedEsText']

                        # Translate description
                        translated = await self.translator.translate(
                            video_info['description'],
                            'news_summary',
                            max_chars_description_en,
                            max_chars_description_ja,
                            max_chars_description_es
                        )
                        video_info['description_en'] = translated['translatedEnText']
                        video_info['description_ja'] = translated['translatedJaText']
                        video_info['description_es'] = translated['translatedEsText']
                        
                        processed_videos.append(video_info)
                        if len(processed_videos) >= limit:
                            break
            
            return processed_videos[:limit]
            
        except Exception as e:
            print(f"Error getting player videos: {e}")
            return []

    async def search_news(
        self,
        query: str,
        limit: int = 10,
        max_chars_title_en: Optional[int] = 50,
        max_chars_title_ja: Optional[int] = 30,
        max_chars_title_es: Optional[int] = 45,
        max_chars_summary_en: Optional[int] = 50,
        max_chars_summary_ja: Optional[int] = 65,
        max_chars_summary_es: Optional[int] = 65
    ) -> List[Dict]:
        """Search news with optional translation"""
        results = []
        try:
            API_KEY = settings.GOOGLE_API_KEY
            SEARCH_ENGINE_ID = settings.GOOGLE_SEARCH_ENGINE_ID
            BASE_URL = "https://www.googleapis.com/customsearch/v1"
            
            num_requests = (min(limit, 100) + 9) // 10
            
            for i in range(num_requests):
                start_index = (i * 10) + 1
                
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
                    
                    if not all(result.values()):
                        continue
                    
                    # Translate title
                    translated = await self.translator.translate(
                        result['title'],
                        'news_title',
                        max_chars_title_en,
                        max_chars_title_ja,
                        max_chars_title_es
                    )
                    result['title_en'] = translated['translatedEnText']
                    result['title_ja'] = translated['translatedJaText']
                    result['title_es'] = translated['translatedEsText']
                        
                    # Translate snippet
                    translated = await self.translator.translate(
                        result['snippet'],
                        'news_summary',
                        max_chars_summary_en,
                        max_chars_summary_ja,
                        max_chars_summary_es
                    )
                    result['snippet_en'] = translated['translatedEnText']
                    result['snippet_ja'] = translated['translatedJaText']
                    result['snippet_es'] = translated['translatedEsText']
                    
                    results.append(result)
                    if len(results) >= limit:
                        break
                
                if len(results) >= limit:
                    break
            
            return results[:limit]
            
        except Exception as e:
            print(f"Error searching news: {e}")
            return []

    async def get_player_hr_videos(
        self, 
        player_name: str, 
        limit: int = 10,
        max_chars_title_en: Optional[int] = 50,
        max_chars_title_ja: Optional[int] = 30,
        max_chars_title_es: Optional[int] = 45
    ) -> List[Dict]:
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

                    # Translate title
                    translated = await self.translator.translate(
                        hr_info['title'],
                        'news_title',
                        max_chars_title_en,
                        max_chars_title_ja,
                        max_chars_title_es
                    )
                    hr_info['title_en'] = translated['translatedEnText']
                    hr_info['title_ja'] = translated['translatedJaText']
                    hr_info['title_es'] = translated['translatedEsText']

                    player_hrs.append(hr_info)

                    if len(player_hrs) >= limit:
                        break
            
            return player_hrs[:limit]
            
        except Exception as e:
            print(f"Error getting player home run videos: {e}")
            return []

    async def search_videos(
        self,
        query: str,
        limit: int = 10,
        min_duration: int = 60,
        max_duration: int = 1200,
        max_chars_title_en: Optional[int] = 50,
        max_chars_title_ja: Optional[int] = 30,
        max_chars_title_es: Optional[int] = 45,
        max_chars_description_en: Optional[int] = 50,
        max_chars_description_ja: Optional[int] = 65,
        max_chars_description_es: Optional[int] = 65
    ) -> List[Dict]:
        """
        Search videos with custom query using YouTube API
        Args:
            query: Search query string
            limit: Maximum number of results to return
            min_duration: Minimum video duration in seconds
            max_duration: Maximum video duration in seconds
            target_language: Optional target language code for translation
            max_chars_title: Optional maximum characters for translated title
            max_chars_description: Optional maximum characters for translated description
        Returns:
            List of video information
        """
        API_KEY = settings.GOOGLE_API_KEY
        BASE_URL = "https://www.googleapis.com/youtube/v3/search"
        
        params = {
            'part': 'snippet',
            'q': f"{query} mlb",
            'maxResults': limit,
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
                        video_info = {
                            'video_id': video_id,
                            'title': item['snippet']['title'],
                            'description': item['snippet']['description'],
                            'thumbnail': item['snippet']['thumbnails']['high']['url'],
                            'duration_seconds': duration_seconds,
                            'embed_code': f'<iframe width="560" height="315" src="https://www.youtube.com/embed/{video_id}" frameborder="0" allowfullscreen></iframe>'
                        }
                        
                        if not all(video_info.values()):
                            continue
                        
                        # Translate title
                        translated = await self.translator.translate(
                            video_info['title'],
                            'news_title',
                            max_chars_title_en,
                            max_chars_title_ja,
                            max_chars_title_es
                        )
                        video_info['title_en'] = translated['translatedEnText']
                        video_info['title_ja'] = translated['translatedJaText']
                        video_info['title_es'] = translated['translatedEsText']
                            
                        # Translate description
                        translated = await self.translator.translate(
                            video_info['description'],
                            'news_summary',
                            max_chars_description_en,
                            max_chars_description_ja,
                            max_chars_description_es
                        )
                        video_info['description_en'] = translated['translatedEnText']
                        video_info['description_ja'] = translated['translatedJaText']
                        video_info['description_es'] = translated['translatedEsText']
                        
                        processed_videos.append(video_info)
                        if len(processed_videos) >= limit:
                            break
            
            return processed_videos[:limit]
            
        except Exception as e:
            print(f"Error searching videos: {e}")
            return []