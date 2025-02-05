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
                'https://storage.googleapis.com/gcp-mlb-hackathon-2025/datasets/2016-mlb-homeruns.csv',
                'https://storage.googleapis.com/gcp-mlb-hackathon-2025/datasets/2017-mlb-homeruns.csv',
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
        """Get news about a player with batch translation"""
        results = {}
        results_idx = 0
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

                    results[results_idx] = result
                    results_idx += 1
                    if results_idx >= limit:
                        break

            # Prepare batch translation tasks
            translation_tasks = []
            for idx in results.keys():
                # Add title translation task
                translation_tasks.append({
                    "id": f"title_{idx}",
                    "text": results[idx].get('title'),
                    "type": "news_title",
                    "max_chars_en": max_chars_title_en,
                    "max_chars_ja": max_chars_title_ja,
                    "max_chars_es": max_chars_title_es
                })
                
                # Add summary translation task
                translation_tasks.append({
                    "id": f"summary_{idx}",
                    "text": results[idx].get('snippet'),
                    "type": "news_summary",
                    "max_chars_en": max_chars_summary_en,
                    "max_chars_ja": max_chars_summary_ja,
                    "max_chars_es": max_chars_summary_es
                })

            # Process batch translation
            translated_results = await self.translator.translate_batch(translation_tasks)
            
            # Map translations back to results
            for idx in results.keys():
                title_key = f"title_{idx}"
                summary_key = f"summary_{idx}"
                
                if title_key in translated_results and summary_key in translated_results:
                    results[idx]['title_en'] = translated_results[title_key]['translatedEnText']
                    results[idx]['title_ja'] = translated_results[title_key]['translatedJaText']
                    results[idx]['title_es'] = translated_results[title_key]['translatedEsText']
                    results[idx]['snippet_en'] = translated_results[summary_key]['translatedEnText']
                    results[idx]['snippet_ja'] = translated_results[summary_key]['translatedJaText']
                    results[idx]['snippet_es'] = translated_results[summary_key]['translatedEsText']
                else:
                    results[idx]['title_en'] = "Not Translated"
                    results[idx]['title_ja'] = "Not Translated"
                    results[idx]['title_es'] = "Not Translated"
                    results[idx]['snippet_en'] = "Not Translated"
                    results[idx]['snippet_ja'] = "Not Translated"
                    results[idx]['snippet_es'] = "Not Translated"
            
            return results
            
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
        """Get YouTube videos about a player with batch translation"""
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
            
            # Process and filter videos with batch translation
            processed_videos = []
            translation_tasks = []
            
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
                        
                        # Add title translation task
                        translation_tasks.append({
                            "id": f"title_{video_id}",
                            "text": video_info['title'],
                            "type": "news_title",
                            "max_chars_en": max_chars_title_en,
                            "max_chars_ja": max_chars_title_ja,
                            "max_chars_es": max_chars_title_es
                        })
                        
                        # Add description translation task
                        translation_tasks.append({
                            "id": f"desc_{video_id}",
                            "text": video_info['description'],
                            "type": "news_summary",
                            "max_chars_en": max_chars_description_en,
                            "max_chars_ja": max_chars_description_ja,
                            "max_chars_es": max_chars_description_es
                        })
                        
                        processed_videos.append(video_info)
                        if len(processed_videos) >= limit:
                            break

            # Process batch translation
            translated_results = await self.translator.translate_batch(translation_tasks)
            
            # Map translations back to videos
            for video in processed_videos:
                title_key = f"title_{video['video_id']}"
                desc_key = f"desc_{video['video_id']}"
                
                if title_key in translated_results and desc_key in translated_results:
                    video['title_en'] = translated_results[title_key]['translatedEnText']
                    video['title_ja'] = translated_results[title_key]['translatedJaText']
                    video['title_es'] = translated_results[title_key]['translatedEsText']
                    video['description_en'] = translated_results[desc_key]['translatedEnText']
                    video['description_ja'] = translated_results[desc_key]['translatedJaText']
                    video['description_es'] = translated_results[desc_key]['translatedEsText']
                else:
                    video['title_en'] = "Not Translated"
                    video['title_ja'] = "Not Translated"
                    video['title_es'] = "Not Translated"
                    video['description_en'] = "Not Translated"
                    video['description_ja'] = "Not Translated"
                    video['description_es'] = "Not Translated"
            
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
        """Search news with batch translation"""
        results = []
        translation_tasks = []
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
                    
                    # Add title translation task
                    translation_tasks.append({
                        "id": f"title_{len(results)}",
                        "text": result['title'],
                        "type": "news_title",
                        "max_chars_en": max_chars_title_en,
                        "max_chars_ja": max_chars_title_ja,
                        "max_chars_es": max_chars_title_es
                    })
                    
                    # Add snippet translation task
                    translation_tasks.append({
                        "id": f"snippet_{len(results)}",
                        "text": result['snippet'],
                        "type": "news_summary",
                        "max_chars_en": max_chars_summary_en,
                        "max_chars_ja": max_chars_summary_ja,
                        "max_chars_es": max_chars_summary_es
                    })
                    
                    results.append(result)
                    if len(results) >= limit:
                        break
                
                if len(results) >= limit:
                    break
            
            # Process batch translation
            translated_results = await self.translator.translate_batch(translation_tasks)
            
            # Map translations back to results
            for idx, result in enumerate(results):
                title_key = f"title_{idx}"
                snippet_key = f"snippet_{idx}"
                
                if title_key in translated_results and snippet_key in translated_results:
                    result['title_en'] = translated_results[title_key]['translatedEnText']
                    result['title_ja'] = translated_results[title_key]['translatedJaText']
                    result['title_es'] = translated_results[title_key]['translatedEsText']
                    result['snippet_en'] = translated_results[snippet_key]['translatedEnText']
                    result['snippet_ja'] = translated_results[snippet_key]['translatedJaText']
                    result['snippet_es'] = translated_results[snippet_key]['translatedEsText']
                else:
                    result['title_en'] = "Not Translated"
                    result['title_ja'] = "Not Translated"
                    result['title_es'] = "Not Translated"
                    result['snippet_en'] = "Not Translated"
                    result['snippet_ja'] = "Not Translated"
                    result['snippet_es'] = "Not Translated"
            
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
        """Get home run videos for a specific player with batch translation"""
        try:
            # Filter home runs by player name
            player_hrs = []
            translation_tasks = []

            for _, row in self.all_mlb_hrs.iterrows():
                title_idx = row['title'].lower().find("homer")
                if player_name.lower() in row['title'].lower()[:title_idx]:
                    hr_info = {
                        'play_id': row['play_id'],
                        'title': row['title'],
                        'video_url': row['video'],
                        'exit_velocity': row['ExitVelocity'],
                        'launch_angle': row['LaunchAngle'],
                        'hit_distance': row['HitDistance'],
                        'season': row['season']
                    }

                    # Add title translation task
                    translation_tasks.append({
                        "id": f"title_{row['play_id']}",
                        "text": hr_info['title'],
                        "type": "news_title",
                        "max_chars_en": max_chars_title_en,
                        "max_chars_ja": max_chars_title_ja,
                        "max_chars_es": max_chars_title_es
                    })

                    player_hrs.append(hr_info)
                    if len(player_hrs) >= limit:
                        break

            # Process batch translation
            translated_results = await self.translator.translate_batch(translation_tasks)
            
            # Map translations back to videos
            for hr in player_hrs:
                title_key = f"title_{hr['play_id']}"
                
                if title_key in translated_results:
                    hr['title_en'] = translated_results[title_key]['translatedEnText']
                    hr['title_ja'] = translated_results[title_key]['translatedJaText']
                    hr['title_es'] = translated_results[title_key]['translatedEsText']
                else:
                    hr['title_en'] = "Not Translated"
                    hr['title_ja'] = "Not Translated"
                    hr['title_es'] = "Not Translated"
            
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
        """Search videos with batch translation"""
        try:
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
            translation_tasks = []
            
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
                        
                        # Add title translation task
                        translation_tasks.append({
                            "id": f"title_{video_id}",
                            "text": video_info['title'],
                            "type": "news_title",
                            "max_chars_en": max_chars_title_en,
                            "max_chars_ja": max_chars_title_ja,
                            "max_chars_es": max_chars_title_es
                        })
                        
                        # Add description translation task
                        translation_tasks.append({
                            "id": f"desc_{video_id}",
                            "text": video_info['description'],
                            "type": "news_summary",
                            "max_chars_en": max_chars_description_en,
                            "max_chars_ja": max_chars_description_ja,
                            "max_chars_es": max_chars_description_es
                        })
                        
                        processed_videos.append(video_info)
                        if len(processed_videos) >= limit:
                            break

            # Process batch translation
            translated_results = await self.translator.translate_batch(translation_tasks)
            
            # Map translations back to videos
            for video in processed_videos:
                title_key = f"title_{video['video_id']}"
                desc_key = f"desc_{video['video_id']}"
                
                if title_key in translated_results and desc_key in translated_results:
                    video['title_en'] = translated_results[title_key]['translatedEnText']
                    video['title_ja'] = translated_results[title_key]['translatedJaText']
                    video['title_es'] = translated_results[title_key]['translatedEsText']
                    video['description_en'] = translated_results[desc_key]['translatedEnText']
                    video['description_ja'] = translated_results[desc_key]['translatedJaText']
                    video['description_es'] = translated_results[desc_key]['translatedEsText']
                else:
                    video['title_en'] = "Not Translated"
                    video['title_ja'] = "Not Translated"
                    video['title_es'] = "Not Translated"
                    video['description_en'] = "Not Translated"
                    video['description_ja'] = "Not Translated"
                    video['description_es'] = "Not Translated"
            
            return processed_videos[:limit]
            
        except Exception as e:
            print(f"Error searching videos: {e}")
            return []