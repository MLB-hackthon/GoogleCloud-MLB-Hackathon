import pytest
from fastapi.testclient import TestClient

def test_get_player_images(client: TestClient):
    """Test getting player images"""
    response = client.get("/api/v1/content/images/New York Yankees/Aaron Judge")
    assert response.status_code == 200
    assert "images" in response.json()

def test_get_player_news(client: TestClient):
    """Test getting player news"""
    response = client.get("/api/v1/content/news/Aaron Judge?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert "news" in data
    assert len(data["news"]) == 2
    
    # Test first news item has all required fields
    news_item = data["news"]["0"]
    assert all(key in news_item for key in [
        "url", "domain", "title", "snippet", "image_url",
        "title_en", "title_ja", "title_es",
        "snippet_en", "snippet_ja", "snippet_es"
    ])
    
    # Test limit parameter
    response = client.get("/api/v1/content/news/Aaron Judge?limit=5")
    assert response.status_code == 200
    assert len(response.json()["news"]) <= 5

def test_search_news(client: TestClient):
    """Test searching news"""
    response = client.get("/api/v1/content/search/news?query=MLB playoffs?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    
    # Test first news item has all required fields
    news_item = data[0]
    assert all(key in news_item for key in [
        "url", "domain", "title", "snippet", "image_url",
        "title_en", "title_ja", "title_es",
        "snippet_en", "snippet_ja", "snippet_es"
    ])

def test_get_player_hr_videos(client: TestClient):
    """Test getting player home run videos"""
    response = client.get("/api/v1/content/videos/Aaron Judge/homeruns?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert "videos" in data
    
    # Test first video has all required fields
    video = data["videos"][0]
    assert all(key in video for key in [
        "play_id", "title", "video_url", "exit_velocity", 
        "launch_angle", "hit_distance", "season",
        "title_en", "title_ja", "title_es"
    ])

def test_get_player_videos(client: TestClient):
    """Test getting player videos"""
    response = client.get("/api/v1/content/videos/Aaron Judge?limit=2")
    assert response.status_code == 200
    data = response.json()
    assert "videos" in data
    
    # Test first video has all required fields
    video = data["videos"][0]
    assert all(key in video for key in [
        "video_id", "title", "description", "thumbnail", 
        "duration_seconds", "embed_code",
        "title_en", "title_ja", "title_es",
        "description_en", "description_ja", "description_es"
    ])
    
    # Test with parameters
    response = client.get(
        "/api/v1/content/videos/Aaron Judge?limit=2&min_duration=30&max_duration=300"
    )
    assert response.status_code == 200
    videos = response.json()["videos"]
    assert len(videos) <= 2
    for video in videos:
        assert 30 <= video["duration_seconds"] <= 300

def test_search_videos(client: TestClient):
    """Test searching videos"""
    response = client.get(
        "/api/v1/content/search/videos?query=MLB highlights&limit=2"
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) <= 2
    
    # Test first video has all required fields
    video = data[0]
    assert all(key in video for key in [
        "video_id", "title", "description", "thumbnail", 
        "duration_seconds", "embed_code",
        "title_en", "title_ja", "title_es",
        "description_en", "description_ja", "description_es"
    ])

def test_invalid_limit_parameters(client: TestClient):
    """Test invalid limit parameters return appropriate errors"""
    # Test news endpoint with invalid limit
    response = client.get("/api/v1/content/news/Aaron Judge?limit=101")
    assert response.status_code == 422

    # Test videos endpoint with invalid max_results
    response = client.get("/api/v1/content/videos/Aaron Judge?limit=51")
    assert response.status_code == 422

def test_character_limit_validation(client: TestClient):
    """Test character limit validation for translations"""
    # Test with invalid character limits for news
    response = client.get(
        "/api/v1/content/news/Aaron Judge?max_chars_title_en=0"
    )
    assert response.status_code == 422
    
    response = client.get(
        "/api/v1/content/news/Aaron Judge?max_chars_summary_ja=0"
    )
    assert response.status_code == 422
    
    # Test with invalid character limits for videos
    response = client.get(
        "/api/v1/content/videos/Aaron Judge?max_chars_title_es=0"
    )
    assert response.status_code == 422
    
    response = client.get(
        "/api/v1/content/videos/Aaron Judge?max_chars_description_en=0"
    )
    assert response.status_code == 422

def test_translation_length_constraints(client: TestClient):
    """Test that translations respect maximum character limits"""
    max_title_en = 50
    max_summary_ja = 65
    
    response = client.get(
        f"/api/v1/content/news/Aaron Judge?limit=2&max_chars_title_en={max_title_en}&max_chars_summary_ja={max_summary_ja}"
    )
    assert response.status_code == 200
    data = response.json()
    
    for news_item in list(data["news"].values()):
        assert len(news_item["title_en"]) <= max_title_en + 2
        assert len(news_item["snippet_ja"]) <= max_summary_ja + 2