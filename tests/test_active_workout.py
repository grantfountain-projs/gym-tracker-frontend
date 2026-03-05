import pytest
import os
from playwright.sync_api import sync_playwright, expect



def test_active_workout_page_loads(active_workout_page):
    page, workout_id = active_workout_page
    expect(page.get_by_role("button", name="Start")).to_be_visible()
    expect(page.get_by_role("button", name="+ Add Exercise")).to_be_visible()
    expect(page.get_by_role("button", name="End Workout")).to_be_visible()
    expect(page.locator('[data-testid="workout-name"]')).to_be_visible()
    expect(page.locator('[data-testid="workout-name"]')).to_have_text("Unnamed Workout")
    expect(page.locator('[data-testid="timer-display"]')).to_be_visible()
    expect(page.locator('[data-testid="timer-display"]')).to_have_text("0:00")
    expect(page.locator('[data-testid="volume-display"]')).to_be_visible()
    expect(page.locator('[data-testid="volume-display"]')).to_have_text("0 lbs")

def test_rename_active_workout(active_workout_page):
    page, workout_id = active_workout_page
    page.locator('[data-testid="workout-name"]').click()
    page.locator('[data-testid="workout-name-input"]').fill("New Test Workout")
    page.locator('[data-testid="workout-name-input"]').press("Enter")
    expect(page.locator('[data-testid="workout-name"]')).to_have_text("New Test Workout")

def test_active_workout_timer(active_workout_page):
    page, workout_id = active_workout_page
    page.get_by_role("button", name="Start").click()
    expect(page.get_by_role("button", name="Start")).not_to_be_visible()
    expect(page.get_by_role("button", name="Pause")).to_be_visible()
    page.get_by_role("button", name="Pause").click()
    expect(page.get_by_role("button", name="Pause")).not_to_be_visible()
    expect(page.get_by_role("button", name="Start")).to_be_visible()
    page.get_by_role("button", name="Start").click()
    expect(page.get_by_role("button", name="Start")).not_to_be_visible()
    expect(page.get_by_role("button", name="Pause")).to_be_visible()
    expect(page.locator('[data-testid="timer-display"]')).not_to_have_text("0:00")

def test_add_existing_exercise(active_workout_page):
    page, workout_id = active_workout_page
    