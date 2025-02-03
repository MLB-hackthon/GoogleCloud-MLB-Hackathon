from typing import Dict, Optional
import requests
from app.core.config import settings

class PlayerInfoService:
    def __init__(self):
        self.BASE_URL = "https://statsapi.mlb.com/api/v1"
        self.TEAM_ENDPOINT = f"{self.BASE_URL}/teams?sportId=1"
        self.PLAYER_ENDPOINT = f"{self.BASE_URL}/sports/1/players?season=2024"
        self.SINGLE_PLAYER_ENDPOINT = f"{self.BASE_URL}/people"
        self.HEADSHOT_ENDPOINT = f"https://securea.mlb.com/mlb/images/players/head_shot"
    
    def _get_team_id_by_name(self, team_name: str) -> Optional[int]:
        """
        Get MLB team ID by team name
        Args:
            team_name: Name of the team
        Returns:
            Team ID if found, None otherwise
        """
        try:
            response = requests.get(f"{self.TEAM_ENDPOINT}")
            response.raise_for_status()
            teams = response.json().get('teams', [])
            
            for team in teams:
                if team_name.lower() in team['name'].lower():
                    return team['id']
            return None
            
        except Exception as e:
            print(f"Error getting team ID: {e}")
            return None

    async def get_team_logo_by_name(self, team_name: str) -> Optional[str]:
        """
        Get team logo URL by team name
        Args:
            team_name: MLB team name
        Returns:
            Logo URL if found, None otherwise
        """
        try:
            team_id = self._get_team_id_by_name(team_name)
            if not team_id:
                return None
            # Using MLB's logo CDN
            return f"https://www.mlbstatic.com/team-logos/{team_id}.svg"
            
        except Exception as e:
            print(f"Error getting team logo: {e}")
            return None

    def _get_player_id_by_name(self, player_name: str) -> Optional[int]:
        """
        Get MLB player ID by player name
        Args:
            player_name: Name of the player
        Returns:
            Player ID if found, None otherwise
        """
        try:
            response = requests.get(f"{self.PLAYER_ENDPOINT}")
            response.raise_for_status()
            players = response.json().get('people', [])
            
            for player in players:
                if player_name.lower() in player['fullName'].lower():
                    return player['id']
            return None
            
        except Exception as e:
            print(f"Error getting player ID: {e}")
            return None

    async def get_player_info_by_name(self, player_name: str) -> Optional[Dict]:
        """
        Get player information by player name
        Args:
            player_name: MLB player name
        Returns:
            Dictionary containing player information if found, None otherwise
        """
        try:
            player_id = self._get_player_id_by_name(player_name)
            if not player_id:
                return None
            
            response = requests.get(f"{self.SINGLE_PLAYER_ENDPOINT}/{player_id}")
            response.raise_for_status()
            player_data = response.json().get('people', [])[0]
            
            return {
                'id': player_data.get('id'),
                'fullName': player_data.get('fullName'),
                'link': player_data.get('link'),
                'firstName': player_data.get('firstName'),
                'lastName': player_data.get('lastName'),
                'primaryNumber': player_data.get('primaryNumber'),
                'currentAge': player_data.get('currentAge'),
                'birthDate': player_data.get('birthDate'),
                'birthCity': player_data.get('birthCity'),
                'birthCountry': player_data.get('birthCountry'),
                'height': player_data.get('height'),
                'weight': player_data.get('weight'),
                'active': player_data.get('active'),
                'primaryPosition': {
                    'code': player_data.get('primaryPosition', {}).get('code'),
                    'name': player_data.get('primaryPosition', {}).get('name'),
                    'type': player_data.get('primaryPosition', {}).get('type'),
                    'abbreviation': player_data.get('primaryPosition', {}).get('abbreviation')
                },
                'useName': player_data.get('useName'),
                'useLastName': player_data.get('useLastName'),
                'boxscoreName': player_data.get('boxscoreName'),
                'nickName': player_data.get('nickName'),
                'pronunciation': player_data.get('pronunciation'),
                'mlbDebutDate': player_data.get('mlbDebutDate'),
                'batSide': {
                    'code': player_data.get('batSide', {}).get('code'),
                    'description': player_data.get('batSide', {}).get('description')
                },
                'pitchHand': {
                    'code': player_data.get('pitchHand', {}).get('code'),
                    'description': player_data.get('pitchHand', {}).get('description')
                },
                'nameSlug': player_data.get('nameSlug'),
                'strikeZoneTop': player_data.get('strikeZoneTop'),
                'strikeZoneBottom': player_data.get('strikeZoneBottom')
            }
            
        except Exception as e:
            print(f"Error getting player info: {e}")
            return None

    async def get_player_headshot_by_name(self, player_name: str) -> Optional[str]:
        """
        Get player headshot image URL by player name
        Args:
            player_name: MLB player name
        Returns:
            Headshot URL if found, None otherwise
        """
        try:
            player_id = self._get_player_id_by_name(player_name)
            if not player_id:
                return None
            # Using MLB's player headshot CDN
            return f"{self.HEADSHOT_ENDPOINT}/{player_id}.jpg"
            
        except Exception as e:
            print(f"Error getting player headshot: {e}")
            return None
