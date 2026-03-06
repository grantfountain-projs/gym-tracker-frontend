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
    page.get_by_role("button", name="+ Add Exercise").click()
    expect(page.get_by_role("button", name="+ Add Exercise")).not_to_be_visible()
    expect(page.get_by_role("button", name="Cancel")).to_be_visible()
    expect(page.get_by_role("button", name="Name")).to_be_visible()
    expect(page.get_by_role("button", name="Muscle Group")).to_be_visible()
    expect(page.get_by_role("button", name="↑ Asc")).to_be_visible()
    expect(page.locator('[data-testid="exercise-list"]')).to_be_visible()
    page.get_by_text("Leg Curl").click()
    expect(page.locator('[data-testid="exercise-card-exercise-name"]')).to_have_text("Leg Curl")
    expect(page.locator('[data-testid="exercise-card-muscle-group"]')).to_have_text("Muscle Group: Legs")
    expect(page.get_by_text("No sets logged yet")).to_be_visible()
    expect(page.get_by_role("button", name="+ Add Set")).to_be_visible()

def test_create_new_exercise(active_workout_page, temp_exercise):
    page, workout_id = active_workout_page
    exercise_name = temp_exercise
    page.get_by_role("button", name="+ Add Exercise").click()
    expect(page.get_by_text("+ Create New Exercise")).to_be_visible()
    page.get_by_text("+ Create New Exercise").click()
    expect(page.get_by_role("button", name="Back")).to_be_visible()
    expect(page.get_by_role("button", name="Create")).to_be_visible()

    page.locator('[data-testid="create-exercise-name-input"]').click()
    page.locator('[data-testid="create-exercise-name-input"]').fill(exercise_name)
    page.get_by_role("combobox").select_option("Shoulders")
    page.get_by_role("button", name="Create").click()

    expect(page.locator('[data-testid="exercise-card-exercise-name"]')).to_have_text(exercise_name)
    expect(page.locator('[data-testid="exercise-card-muscle-group"]')).to_have_text("Muscle Group: Shoulders")
    
def test_remove_exercise_from_workout(active_workout_page):
    # setup
    page, workout_id = active_workout_page
    page.get_by_role("button", name="+ Add Exercise").click()
    page.get_by_text("Leg Curl").click()
    page.get_by_role("button", name="+ Add Set").click()
    page.locator('[data-testid="set-reps-input"]').fill("10")
    page.locator('[data-testid="set-weight-input"]').fill("135")
    page.locator('[data-testid="set-rpe-input"]').press("Backspace")
    page.locator('[data-testid="set-rpe-input"]').fill("8")
    page.get_by_role("button", name="Log Set").click()
    expect(page.locator('[data-testid="edit-set-button"]')).to_be_visible()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()

    # click remove button and confirm the exercise was deleted
    page.locator('[data-testid="exercise-card"]').filter(has_text="Leg Curl").locator('[data-testid="delete-exercise-button"]').click()
    expect(page.locator('[data-testid="volume-display"]')).to_have_text("0 lbs")

def test_add_set(active_workout_page):
    page, workout_id = active_workout_page
    page.get_by_role("button", name="+ Add Exercise").click()
    page.get_by_text("Leg Curl").click()
    page.get_by_role("button", name="+ Add Set").click()
    expect(page.get_by_role("button", name="+ Add Set")).not_to_be_visible()
    expect(page.locator('[data-testid="set-reps"]')).to_have_text("Reps")
    expect(page.locator('[data-testid="set-weight"]')).to_have_text("Weight (lbs)")
    expect(page.locator('[data-testid="set-rpe"]')).to_have_text("Rate of Perceived Exertion (RPE) 1-10")
    expect(page.get_by_role("button", name="Cancel")).to_be_visible()
    expect(page.get_by_role("button", name="Log Set")).to_be_visible()

    page.locator('[data-testid="set-reps-input"]').fill("10")
    page.locator('[data-testid="set-weight-input"]').fill("135")
    page.locator('[data-testid="set-rpe-input"]').press("Backspace")
    page.locator('[data-testid="set-rpe-input"]').fill("8")
    page.get_by_role("button", name="Log Set").click()

    expect(page.get_by_role("button", name="+ Add Set")).to_be_visible()
    expect(page.locator('[data-testid="sets-display"]')).to_contain_text("#1")
    expect(page.locator('[data-testid="sets-display"]')).to_contain_text("135.0 lbs x 10 reps")
    expect(page.locator('[data-testid="volume-display"]')).to_have_text("1350 lbs")

def test_duplicate_existing_set(active_workout_page):
    # setup
    page, workout_id = active_workout_page
    page.get_by_role("button", name="+ Add Exercise").click()
    page.get_by_text("Leg Curl").click()
    page.get_by_role("button", name="+ Add Set").click()
    page.locator('[data-testid="set-reps-input"]').fill("10")
    page.locator('[data-testid="set-weight-input"]').fill("135")
    page.locator('[data-testid="set-rpe-input"]').press("Backspace")
    page.locator('[data-testid="set-rpe-input"]').fill("8")
    page.get_by_role("button", name="Log Set").click()

    # duplicate and test
    expect(page.locator('[data-testid="duplicate-set-button"]')).to_be_visible()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()
    expect(page.locator('[data-testid="sets-display"]')).to_contain_text("#3")
    expect(page.locator('[data-testid="sets-display"]').filter(has_text="#3")).to_contain_text("135.0 lbs x 10 reps")
    expect(page.locator('[data-testid="volume-display"]')).to_have_text("4050 lbs")

def test_edit_existing_set(active_workout_page):
    # setup
    page, workout_id = active_workout_page
    page.get_by_role("button", name="+ Add Exercise").click()
    page.get_by_text("Leg Curl").click()
    page.get_by_role("button", name="+ Add Set").click()
    page.locator('[data-testid="set-reps-input"]').fill("10")
    page.locator('[data-testid="set-weight-input"]').fill("135")
    page.locator('[data-testid="set-rpe-input"]').press("Backspace")
    page.locator('[data-testid="set-rpe-input"]').fill("8")
    page.get_by_role("button", name="Log Set").click()
    expect(page.locator('[data-testid="edit-set-button"]')).to_be_visible()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()
    page.locator('[data-testid="set-row"]').filter(has_text="#3").locator('[data-testid="edit-set-button"]').click()

    # confirm initial edit form is as expected
    expect(page.locator('[data-testid="edit-set-reps"]')).to_have_text("Reps")
    expect(page.locator('[data-testid="edit-set-weight"]')).to_have_text("Weight (lbs)")
    expect(page.locator('[data-testid="edit-set-rpe"]')).to_have_text("Rate of Perceived Exertion (RPE) 1-10")
    expect(page.locator('[data-testid="edit-set-reps-input"]')).to_have_value("10")
    expect(page.locator('[data-testid="edit-set-weight-input"]')).to_have_value("135.0")
    expect(page.locator('[data-testid="edit-set-rpe-input"]')).to_have_value("8")
    expect(page.get_by_role("button", name="Cancel")).to_be_visible()
    expect(page.get_by_role("button", name="Save")).to_be_visible()

    # update the edit form
    page.locator('[data-testid="edit-set-reps-input"]').fill("12")
    page.locator('[data-testid="edit-set-weight-input"]').fill("155")
    page.locator('[data-testid="edit-set-rpe-input"]').press("Backspace")
    page.locator('[data-testid="edit-set-rpe-input"]').fill("10")
    page.get_by_role("button", name="Save").click()

    # confirm changes are reflected in set row
    expect(page.locator('[data-testid="sets-display"]').filter(has_text="#3")).to_contain_text("155.0 lbs x 12 reps")
    expect(page.locator('[data-testid="volume-display"]')).to_have_text("4560 lbs")


def test_delete_existing_set(active_workout_page):
    # setup
    page, workout_id = active_workout_page
    page.get_by_role("button", name="+ Add Exercise").click()
    page.get_by_text("Leg Curl").click()
    page.get_by_role("button", name="+ Add Set").click()
    page.locator('[data-testid="set-reps-input"]').fill("10")
    page.locator('[data-testid="set-weight-input"]').fill("135")
    page.locator('[data-testid="set-rpe-input"]').press("Backspace")
    page.locator('[data-testid="set-rpe-input"]').fill("8")
    page.get_by_role("button", name="Log Set").click()
    expect(page.locator('[data-testid="edit-set-button"]')).to_be_visible()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()
    page.locator('[data-testid="set-row"]').filter(has_text="#1").locator('[data-testid="duplicate-set-button"]').click()
    page.locator('[data-testid="set-row"]').filter(has_text="#3").locator('[data-testid="delete-set-button"]').click()

    # test that the 3rd set was deleted
    expect(page.locator('[data-testid="sets-display"]').filter(has_text="#3")).not_to_be_visible()
    expect(page.locator('[data-testid="volume-display"]')).to_have_text("2700 lbs")
    

def test_end_workout(active_workout_page):
    page, workout_id = active_workout_page
    page.locator('[data-testid="workout-name"]').click()
    page.locator('[data-testid="workout-name-input"]').fill("New Test Workout")
    page.locator('[data-testid="workout-name-input"]').press("Enter")
    page.get_by_role("button", name="+ Add Exercise").click()
    page.get_by_text("Leg Curl").click()
    page.get_by_role("button", name="+ Add Set").click()
    page.locator('[data-testid="set-reps-input"]').fill("10")
    page.locator('[data-testid="set-weight-input"]').fill("135")
    page.locator('[data-testid="set-rpe-input"]').press("Backspace")
    page.locator('[data-testid="set-rpe-input"]').fill("8")
    page.get_by_role("button", name="Log Set").click()
    expect(page.get_by_role("button", name="End Workout")).to_be_visible()

    page.get_by_role("button", name="Start").click()
    expect(page.locator('[data-testid="timer-display"]')).to_have_text("0:03")
    page.get_by_role("button", name="End Workout").click()
    expect(page.locator('[data-testid="completed-workout-text"]')).to_have_text("Workout Complete!")
    expect(page.locator('[data-testid="completed-workout-name"]')).to_have_text("New Test Workout")
    expect(page.locator('[data-testid="completed-workout-duration"]')).to_contain_text("0:03")
    expect(page.locator('[data-testid="completed-workout-volume"]')).to_contain_text("1350 lbs")
    expect(page.locator('[data-testid="completed-workout-exercises"]')).to_contain_text("1")
    expect(page.locator('[data-testid="completed-workout-total-sets"]')).to_contain_text("1")
    expect(page.locator('[data-testid="completed-workout-muscle-groups"]')).to_contain_text("Legs")
    expect(page.get_by_role("button", name="Back to Home")).to_be_visible()

    page.get_by_role("button", name="Back to Home").click()
    expect(page.get_by_text("5G FITNESS")).to_be_visible()