import json
import os
import threading
from playwright.sync_api import sync_playwright

TARGET_URL = "https://www.iceinmyarea.org/"
USER_DATA_DIR = "./playwright_profile"
os.makedirs(USER_DATA_DIR, exist_ok=True)

done = threading.Event()
def main():
    with sync_playwright() as p:
        browser = p.chromium.launch_persistent_context(
            headless=False,
            user_data_dir=USER_DATA_DIR,
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},)

        # Stealth: remove webdriver flag
        

        page = browser.new_page()
        page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => false });
        """)

        buffer = ""

        def on_websocket(ws):
            print("WebSocket opened:", ws.url)

            def on_frame(frame):
                # Convert to string if needed
                text = frame.decode() if isinstance(frame, bytes) else str(frame)

                # Firebase may send multiple messages separated by newline
                base_json = open("icescrape_json.txt", "a")
                for line in text.splitlines():
                    line = line.strip()
                    base_json.write(line + "\n")
            ws.on("framereceived", on_frame)


        page.on("websocket", on_websocket)

        page.goto(TARGET_URL)
        page.wait_for_load_state("networkidle")

        print("Page loaded, waiting for Firebase payload...")

        # Block until payload arrives
        done.wait(timeout=300)

        browser.close()

if __name__ == "__main__":
    main()