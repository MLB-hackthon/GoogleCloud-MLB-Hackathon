from fastapi.testclient import TestClient

def test_send_message_without_user_id(client: TestClient):
    """Test sending message without user_id should return 400"""
    response = client.post("/api/v1/chat/send", json={"message": "test message"})
    assert response.status_code == 400
    assert "User ID is required" in response.json()["detail"]

def test_send_message_without_message(client: TestClient, test_user_id: str):
    """Test sending empty message should return 400"""
    response = client.post(
        "/api/v1/chat/send",
        json={},
        headers={"user_id": test_user_id}
    )
    assert response.status_code == 400
    assert "Message is required" in response.json()["detail"]

def test_send_valid_message(client: TestClient, test_user_id: str):
    """Test sending valid message should return 200 and start streaming"""
    response = client.post(
        "/api/v1/chat/send",
        json={"message": "Tell me about baseball"},
        headers={"user_id": test_user_id}
    )
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]

def test_end_session_without_user_id(client: TestClient):
    """Test ending session without user_id should return 400"""
    response = client.delete("/api/v1/chat/session")
    assert response.status_code == 400
    assert "User ID is required" in response.json()["detail"]

def test_end_valid_session(client: TestClient, test_user_id: str):
    """Test ending valid session should return success"""
    response = client.post(
        "/api/v1/chat/send",
        json={"message": "Tell me about baseball"},
        headers={"user_id": test_user_id}
    )
    
    response = client.delete(
        "/api/v1/chat/session",
        headers={"user_id": test_user_id}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "success" 