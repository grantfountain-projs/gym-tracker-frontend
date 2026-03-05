import pytest
import os
from dotenv import load_dotenv
from playwright.sync_api import sync_playwright, expect

load_dotenv()

TEST_EMAIL = os.getenv("TEST_EMAIL")
TEST_PASSWORD = os.getenv("TEST_PASSWORD")

BASE_URL = "http://localhost:5173"

def test_login_form_is_visible(page):
    page.goto(f"{BASE_URL}/login")
    expect(page.get_by_label("Email Address")).to_be_visible()
    expect(page.get_by_label("Password")).to_be_visible()
    expect(page.get_by_role("button", name="Sign In")).to_be_visible()
    expect(page.locator('[data-testid="create-account-link"]')).to_be_visible()


def test_navigate_to_signup(page):
    page.goto(f"{BASE_URL}/login")
    page.locator('[data-testid="create-account-link"]').click()
    expect(page).to_have_url(f"{BASE_URL}/signup")


def test_invalid_credentials_shows_error(page):
    page.goto(f"{BASE_URL}/login")
    page.get_by_label("Email Address").fill("wrong@email.com")
    page.get_by_label("Password").fill("wrongpassword")
    page.get_by_role("button", name="Sign In").click()
    expect(page.locator('[data-testid="error-message"]')).to_be_visible()


def test_successful_login_redirects_to_dashboard(page):
    page.goto(f"{BASE_URL}/login")
    page.get_by_label("Email Address").fill(TEST_EMAIL)
    page.get_by_label("Password").fill(TEST_PASSWORD)
    page.get_by_role("button", name="Sign In").click()
    expect(page).to_have_url(f"{BASE_URL}/dashboard")


def test_already_logged_in_redirects_to_dashboard(page):
    response = page.request.post("http://localhost:3000/auth/login", data={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    token = response.json()["token"]
    page.goto(f"{BASE_URL}/login")
    page.evaluate(f"localStorage.setItem('token', '{token}')")
    page.goto(f"{BASE_URL}/login")
    expect(page).to_have_url(f"{BASE_URL}/dashboard")