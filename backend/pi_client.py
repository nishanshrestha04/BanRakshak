# pi_client.py
# ---------------------------------------------------------------
# pip install websockets
import asyncio, websockets, json, uuid, datetime as dt, random

URI = "ws://192.168.102.198:8000/ws"          # change to server address

def fake_detect() -> dict:
    return {
        "device_id": "pi-001",
        "top_class": random.choice(["chainsaw", "rain", "insects"]),
        "def_prob":  round(random.uniform(0.05, 0.95), 3)
    }

async def main():
    async with websockets.connect(URI) as ws:
        while True:
            msg = fake_detect()
            msg["clip_id"]   = uuid.uuid4().hex
            msg["timestamp"] = dt.datetime.utcnow().isoformat() + "Z"
            await ws.send(json.dumps(msg))
            await asyncio.sleep(1)   # next 1-second chunk

asyncio.run(main())
