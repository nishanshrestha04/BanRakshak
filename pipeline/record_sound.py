import numpy as np
import sounddevice as sd
from scipy.signal import resample
from scipy.io.wavfile import write


def record_sound(counter=1):
    duration = 5  # seconds
    sample_rate = 44100  # Hz
    device_index = 1  # Change this to your mic’s index from previous step

    print("Recording...")
    audio = sd.rec(int(duration * sample_rate), samplerate=sample_rate,
                   channels=1, dtype='float32', device=device_index)
    sd.wait()
    print("Recording complete.")

    audio = audio.squeeze(1)
    # resample to 16000
    # audio = resample(audio, int(len(audio) * 16000 / 44100))

    write(f"outputs/{counter}.wav", sample_rate, audio)
    print(f"Written file {counter}.wav")

    if __name__ != "__main__":
        return audio, sample_rate


if __name__ == "__main__":
    record_sound(1)
