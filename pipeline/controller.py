import os, json, time, warnings, datetime, queue, asyncio, websockets, uuid
from threading import Thread
from record_sound import record_sound
from run_inference import run_inference

warnings.filterwarnings("ignore")

# ───────────── CONFIG ─────────────────────────────────────────
SERVER_URI = "ws://192.168.102.198:8000/ws"
CHUNK_SEC  = 5
AUDIO_QUEUE  = queue.Queue(maxsize=1)        # keep ONLY the latest chunk
RESULT_QUEUE = queue.Queue()
LOG_PATH   = "logs.txt"
os.makedirs("outputs", exist_ok=True)
print("✔ outputs/ folder ready")
# ───────────────────────────────────────────────────────────────


# 1️⃣  Recorder thread ---------------------------------------------------
def record_loop():
    while True:
        t0 = time.time()
        audio, sr = record_sound()           # ← blocks ~5 s
        try:
            AUDIO_QUEUE.put_nowait((audio, sr))
        except queue.Full:
            AUDIO_QUEUE.get_nowait()         # drop stale
            AUDIO_QUEUE.put_nowait((audio, sr))
        # No extra sleep; keeps pace with microphone
        print(f"[RECORD] {time.time()-t0:.2f}s")   # optional timing


# 2️⃣  Inference thread --------------------------------------------------
def inference_loop():
    while True:
        audio, sr = AUDIO_QUEUE.get()        # wait for fresh chunk
        t0 = time.time()
        cls, conf = run_inference(audio, sr) # your model fn

        result = {
            "id":        str(uuid.uuid4()),
            "timestamp": datetime.datetime.utcnow()
                          .isoformat(timespec="milliseconds") + "Z",
            "latitude":  "27.712623 N",      # TODO: real GPS thread
            "longitude": "85.342602 E",
            "speed":     "NA",
            "class":     cls,
            "confidence": float(conf)
        }
        RESULT_QUEUE.put(result)
        print(f"[INFER ] {time.time()-t0:.2f}s -> {cls} {conf:.2f}")


# 3️⃣  WebSocket sender (runs inside its own event-loop thread) ----------
async def ws_sender():
    while True:
        try:
            async with websockets.connect(SERVER_URI) as ws, \
                       open(LOG_PATH, "a", buffering=1) as logf:
                print("WS connected ✅")
                while True:
                    # get() is blocking; run it in thread-pool so event-loop stays alive
                    result = await asyncio.get_event_loop().run_in_executor(
                        None, RESULT_QUEUE.get
                    )
                    await ws.send(json.dumps(result))
                    logf.write(json.dumps(result) + "\n")
        except Exception as e:
            print("WS error:", e, "— retrying in 3 s")
            await asyncio.sleep(3)

def start_ws_thread():
    asyncio.run(ws_sender())


# ───────────── Launch threads ─────────────────────────────────
Thread(target=record_loop,    daemon=True).start()
Thread(target=inference_loop, daemon=True).start()
Thread(target=start_ws_thread,daemon=True).start()

# Keep main thread alive
while True:
    time.sleep(10)
