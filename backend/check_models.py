import os
from google import genai
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)
print("START_LIST")
for m in client.models.list():
    print(f"MODEL: {m.name}")
print("END_LIST")
