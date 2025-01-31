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
        "/api/v1/content/videos/Aaron Judge?max_results=5&min_duration=30&max_duration=300"
    )
    assert response.status_code == 200
    videos = response.json()["videos"]
    assert len(videos) <= 5
    for video in videos:
        assert 30 <= video["duration_seconds"] <= 300

def test_search_videos(client: TestClient):
    """Test searching videos"""
    response = client.get(
        "/api/v1/content/search/videos?query=MLB highlights&max_results=5"
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
    response = client.get("/api/v1/content/videos/Aaron Judge?max_results=51")
    assert response.status_code == 422 