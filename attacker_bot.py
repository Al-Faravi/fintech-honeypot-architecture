# attacker_bot.py
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin  # রিলেটিভ লিংক ফিক্স করার জন্য
import time

TARGET_URL = "http://localhost:3000"

print("\n🤖 [Bot] Starting automated scan on target...")
print(f"🤖 [Bot] Target URL: {TARGET_URL}\n")

try:
    print("🤖 [Bot] Fetching HTML source code...")
    response = requests.get(TARGET_URL)
    soup = BeautifulSoup(response.text, 'html.parser')

    links = soup.find_all('a')
    print(f"🤖 [Bot] Found {len(links)} link(s) on the page. Extracting...\n")

    for link in links:
        href = link.get('href')
        if href:
            # 🚨 Relative URL কে Absolute URL এ কনভার্ট করা হচ্ছে
            full_url = urljoin(TARGET_URL, href)
            
            print(f"💥 [Bot] Exploiting link: {full_url}")
            time.sleep(1) # নাট্যরূপ দেওয়ার জন্য ১ সেকেন্ড বিরতি
            
            try:
                # লিংকে রিকোয়েস্ট পাঠানো
                attack_res = requests.get(full_url)
                
                if attack_res.status_code == 200:
                    print("🎯 [Bot] Access Granted / Data Stolen!")
                    print(f"📂 [Bot] Snippet: {attack_res.text[:150]}...\n")
                elif attack_res.status_code == 403:
                    # আমাদের Active Defense এর কারণে ব্লক হলে এটি দেখাবে
                    print("🛑 [Bot] FATAL ERROR: 403 Forbidden!")
                    print(f"🛡️ [Bot] System Response: {attack_res.text}\n")
                else:
                    print(f"❌ [Bot] Failed. Status code: {attack_res.status_code}\n")
            except Exception as req_err:
                print(f"❌ [Bot] Connection Error: {req_err}\n")

except Exception as e:
    print(f"Error: {e}")