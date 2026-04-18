import asyncio
from playwright.async_api import async_playwright

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Check Homepage
        await page.goto('http://localhost:8000/index.html')
        await page.screenshot(path='homepage_final.png', full_page=True)

        # Check Contact Page
        await page.goto('http://localhost:8000/contact.html')
        await page.screenshot(path='contact_final.png', full_page=True)

        await browser.close()

asyncio.run(run())
