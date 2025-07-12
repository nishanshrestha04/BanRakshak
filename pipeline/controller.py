import time
from record_sound import record_sound
from threading import Thread, Lock
from run_inference import run_inference
import warnings
import requests
import json
from read_gps import read_gps
import requests
import json
from datetime import datetime
from tensorflow.keras.models import load_model
import os
import numpy as np

warnings.filterwarnings("ignore")
counter = 0
lock = Lock()
latest_audio = None
sample_rate = None

OUTPUT_DIR = "outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)
print(f"Ensured output directory '{OUTPUT_DIR}' exists.")

print("Loading Keras Model")
keras_model = load_model('multi_class_audio_classifier.h5')
print("Keras Model Loaded SucessFully.")


def collect_input():
    global latest_audio, sample_rate, counter
    while True:
        data, sample_rate = record_sound(counter)  # 5s chunk
        counter += 1
        with lock:
            latest_audio = data  # overwrite old one


def run_model_loop():
    global latest_audio
    while True:
        time.sleep(0.1)
        with lock:
            if latest_audio is not None:
                data = latest_audio
                latest_audio = None
            else:
                data = None

        if data is not None:
            # --- START: MODIFICATION FOR TIMING ---
            start_time = time.perf_counter()

            classes, percentages, key_pairs = run_inference(
                data, keras_model, sample_rate)

            end_time = time.perf_counter()
            inference_time = end_time - start_time
            # --- END: MODIFICATION FOR TIMING ---

            post_val = read_gps()
            if post_val is None:
                post_val = {}
                post_val['time'] = str(datetime.now())
                post_val['date'] = str(datetime.now())
                post_val['latitude'] = "27.712623 N"
                post_val['longitude'] = "85.342602 E"
                post_val['speed'] = "NA"
            post_val['classes'] = classes
            post_val['confidence'] = percentages

            # requests.post("", json.dumps(post_val))
            # Print the results
            print(f"Inference time: {inference_time:.4f} seconds")  # New line
            # print("Inference Output: ", classes)
            # print("Inference Probs: ", percentages)
            for key in key_pairs.keys():
                print(
                    f"{key} = {key_pairs[key]:.2f}%")
            print(f"Time: {post_val['time']}")
            print(f"Date: {post_val['date']}")
            print(f"Latitude: {post_val['latitude']}")
            print(f"Longitude: {post_val['longitude']}")
            print(f"Speed: {post_val['speed']}")
            print("-" * 20)  # Added a separator for readability


Thread(target=collect_input, daemon=True).start()
Thread(target=run_model_loop, daemon=True).start()

while True:
    time.sleep(1)
