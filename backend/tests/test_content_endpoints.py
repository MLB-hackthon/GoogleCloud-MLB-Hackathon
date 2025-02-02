import pytest
from fastapi.testclient import TestClient

def test_get_player_images(client: TestClient):
    """Test getting player images"""
    response = client.get("/api/v1/content/images/New York Yankees/Aaron Judge")
    assert response.status_code == 200
    assert "images" in response.json()

def test_get_player_news(client: TestClient):
    """Test getting player news"""
    response = client.get("/api/v1/content/news/Aaron Judge")
    assert response.status_code == 200
    assert "news" in response.json()
    
    # Test limit parameter
    response = client.get("/api/v1/content/news/Aaron Judge?limit=5")
    assert response.status_code == 200
    assert len(response.json()["news"]) <= 5

def test_search_news(client: TestClient):
    """Test searching news"""
    response = client.get("/api/v1/content/search/news?query=MLB playoffs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_player_hr_videos(client: TestClient):
    """Test getting player home run videos"""
    response = client.get("/api/v1/content/videos/Aaron Judge/homeruns")
    assert response.status_code == 200
    assert "videos" in response.json()

def test_get_player_videos(client: TestClient):
    """Test getting player videos"""
    response = client.get("/api/v1/content/videos/Aaron Judge")
    assert response.status_code == 200
    assert "videos" in response.json()
    
    # Test with parameters
    response = client.get(
        "/api/v1/content/videos/Aaron Judge?limit=5&min_duration=30&max_duration=300"
    )
    assert response.status_code == 200
    videos = response.json()["videos"]
    assert len(videos) <= 5
    for video in videos:
        assert 30 <= video["duration_seconds"] <= 300

def test_search_videos(client: TestClient):
    """Test searching videos"""
    response = client.get(
        "/api/v1/content/search/videos?query=MLB highlights&limit=5"
    )
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) <= 5

def test_invalid_limit_parameters(client: TestClient):
    """Test invalid limit parameters return appropriate errors"""
    # Test news endpoint with invalid limit
    response = client.get("/api/v1/content/news/Aaron Judge?limit=101")
    assert response.status_code == 422

    # Test videos endpoint with invalid max_results
    response = client.get("/api/v1/content/videos/Aaron Judge?limit=51")
    assert response.status_code == 422

def test_get_player_news_with_translation(client: TestClient):
    """Test getting player news with Japanese translation"""
    response = client.get(
        "/api/v1/content/news/Aaron Judge?target_language=Japanese&max_chars_title=50&max_chars_summary=200&limit=2"
    )
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert "news" in data
    assert len(data["news"]) > 0
    assert len(data["news"]) <= 2  # Verify limit constraint
    
    # Check first news item structure
    news_item = data["news"][0]
    assert all(key in news_item for key in ["url", "title", "snippet"])
    assert isinstance(news_item["title"], str)
    assert isinstance(news_item["snippet"], str)

    assert len(news_item["title"]) <= 50  # Verify title length constraint
    assert len(news_item["snippet"]) <= 200  # Verify summary length constraint

def test_search_news_with_translation(client: TestClient):
    """Test searching news with Japanese translation"""
    response = client.get(
        "/api/v1/content/search/news?query=MLB playoffs&target_language=Japanese&max_chars_title=50&max_chars_summary=200&limit=2"
    )
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert isinstance(data, list)
    assert len(data) > 0
    assert len(data) <= 2  # Verify limit constraint
    
    # Check first news item structure
    news_item = data[0]
    assert all(key in news_item for key in ["url", "title", "snippet"])
    assert isinstance(news_item["title"], str)
    assert isinstance(news_item["snippet"], str)
    assert len(news_item["title"]) <= 50
    assert len(news_item["snippet"]) <= 200

def test_get_player_videos_with_translation(client: TestClient):
    """Test getting player videos with Japanese translation"""
    response = client.get(
        "/api/v1/content/videos/Shohei Ohtani?target_language=Japanese&max_chars_title=50&max_chars_description=300&limit=2"
    )
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert "videos" in data
    assert len(data["videos"]) > 0
    assert len(data["videos"]) <= 2  # Verify limit constraint
    
    # Check first video item structure
    video = data["videos"][0]
    assert all(key in video for key in [
        "video_id", "title", "description", 
        "thumbnail", "duration_seconds", "embed_code"
    ])
    assert isinstance(video["title"], str)
    assert isinstance(video["description"], str)
    assert len(video["title"]) <= 50
    assert len(video["description"]) <= 300

def test_search_videos_with_translation(client: TestClient):
    """Test searching videos with Japanese translation"""
    response = client.get(
        "/api/v1/content/search/videos?query=MLB highlights&target_language=Japanese&max_chars_title=50&max_chars_description=300&limit=2"
    )
    assert response.status_code == 200
    data = response.json()
    
    # Verify response structure
    assert isinstance(data, list)
    assert len(data) > 0
    assert len(data) <= 2  # Verify limit constraint
    
    # Check first video item structure
    video = data[0]
    assert all(key in video for key in [
        "video_id", "title", "description", 
        "thumbnail", "duration_seconds", "embed_code"
    ])
    assert isinstance(video["title"], str)
    assert isinstance(video["description"], str)
    assert len(video["title"]) <= 50
    assert len(video["description"]) <= 300



