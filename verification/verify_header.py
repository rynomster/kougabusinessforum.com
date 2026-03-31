import os
from playwright.sync_api import sync_playwright

def run_cuj(page):
    # Use filepath for static files
    abs_path = os.path.abspath("index.html")
    page.goto(f"file://{abs_path}")
    page.wait_for_timeout(1000)

    # Check for Contact link in HEADER nav
    header_nav = page.locator("nav.nav")
    contact_link = header_nav.get_by_role("link", name="Contact", exact=True)
    if contact_link.is_visible():
        print("✓ Contact link is visible in header")
    else:
        print("✗ Contact link is NOT visible in header")
        exit(1)

    # Check that standalone Membership link is GONE from HEADER nav
    membership_link = header_nav.get_by_role("link", name="Membership", exact=True)
    if membership_link.is_visible():
        print("✗ Standalone Membership link is still visible in header")
        exit(1)
    else:
        print("✓ Standalone Membership link is gone from header")

    # Check 'Join Now' button in header
    join_now = header_nav.get_by_role("link", name="Join Now")
    if join_now.is_visible():
        href = join_now.get_attribute("href")
        if href == "membership.html":
            print(f"✓ Join Now button points to {href}")
        else:
            print(f"✗ Join Now button points to {href}")
            exit(1)
    else:
        print("✗ Join Now button is NOT visible in header")
        exit(1)

    # Take screenshot
    page.screenshot(path="/home/jules/verification/screenshots/header_verify.png")
    page.wait_for_timeout(1000)

if __name__ == "__main__":
    os.makedirs("/home/jules/verification/videos", exist_ok=True)
    os.makedirs("/home/jules/verification/screenshots", exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            record_video_dir="/home/jules/verification/videos"
        )
        page = context.new_page()
        try:
            run_cuj(page)
        finally:
            context.close()
            browser.close()
