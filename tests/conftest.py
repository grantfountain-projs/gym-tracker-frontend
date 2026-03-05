import pytest
import os
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright, expect

load_dotenv()

TEST_EMAIL = os.getenv("TEST_EMAIL")
TEST_PASSWORD = os.getenv("TEST_PASSWORD")
BASE_URL = "http://localhost:5173"

@pytest.fixture(scope="session")
def browser():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=250)
        yield browser
        browser.close()

@pytest.fixture
def page(browser):
    page = browser.new_page()
    yield page
    page.close()

@pytest.fixture
def authenticated_page(page):
    response = page.request.post("http://localhost:3000/auth/login", data={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    print(response.json())
    token = response.json()["token"]
    page.goto(f"{BASE_URL}/login")
    page.evaluate(f"localStorage.setItem('token', '{token}')")
    yield page, token

@pytest.fixture
def active_workout_page(authenticated_page):
    page, token = authenticated_page

    workout_response = page.request.post(
        "http://localhost:3000/workouts",
        headers={"Authorization": f"Bearer {token}"},
        data={"date": "2026-03-04"}
    )
    workout_id = workout_response.json()["workout"]["id"]
    page.goto(f"{BASE_URL}/active-workout/{workout_id}")
    yield page, workout_id