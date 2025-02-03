from fastapi.testclient import TestClient

def test_get_player_info_success(client: TestClient):
    """Test getting player info for a valid player should return 200"""
    response = client.get("/api/v1/player/info/Yosver Zulueta")
    assert response.status_code == 200
    player_info = response.json()["info"]
    assert player_info["id"] == 691172

def test_get_player_info_not_found(client: TestClient):
    """Test getting player info for non-existent player should return 404"""
    response = client.get("/api/v1/player/info/NonExistentPlayer")
    assert response.status_code == 404
    assert "Player not found" in response.json()["detail"]

def test_get_player_headshot_success(client: TestClient):
    """Test getting player headshot for a valid player should return 200"""
    response = client.get("/api/v1/player/headshot/Yosver Zulueta")
    assert response.status_code == 200
    assert "headshot_url" in response.json()

def test_get_player_headshot_not_found(client: TestClient):
    """Test getting headshot for non-existent player should return 404"""
    response = client.get("/api/v1/player/headshot/NonExistentPlayer")
    assert response.status_code == 404
    assert "Player headshot not found" in response.json()["detail"]

def test_get_team_logo_success(client: TestClient):
    """Test getting team logo for a valid team should return 200"""
    response = client.get("/api/v1/player/team/logo/San Francisco Giants")
    assert response.status_code == 200
    assert "logo_url" in response.json()

def test_get_team_logo_not_found(client: TestClient):
    """Test getting logo for non-existent team should return 404"""
    response = client.get("/api/v1/player/team/logo/NonExistentTeam")
    assert response.status_code == 404
    assert "Team logo not found" in response.json()["detail"] 