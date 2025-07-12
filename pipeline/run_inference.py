import os
import numpy as np
import tensorflow_hub as hub
import pickle
import joblib
from tensorflow.keras.models import load_model

print("Loading Label Binarizer")
label_binarizer = joblib.load('label_binarizer.pkl')
print("Loaded Sucessfully")

print("Loading YAMNet model...")
yamnet_model = hub.load('https://tfhub.dev/google/yamnet/1')
print("YAMNet loaded.")

print("Loading Keras Model")
keras_model = load_model('multi_class_audio_classifier.h5')
print("Keras Model Loaded SucessFully.")

def run_inference(waveform, sr=16000, window_size=2.0, hop_size=1.0,
                  confidence_threshold=0.6, unknown_threshold=0.4):
    """
    Aggregate softmax probabilities over sliding windows in an audio file,
    only including windows where max class probability >= confidence_threshold.
    Assign residual probability to 'unknown' class if confidence is low.
    """

    waveform = waveform.astype(np.float32)

    window_samples = int(window_size * sr)
    hop_samples = int(hop_size * sr)

    num_windows = max(1, (len(waveform) - window_samples) // hop_samples + 1)

    prob_sums = np.zeros(len(label_binarizer.classes_))
    confident_window_count = 0

    for i in range(num_windows):
        start_sample = i * hop_samples
        end_sample = start_sample + window_samples
        window_waveform = waveform[start_sample:end_sample]

        if len(window_waveform) < window_samples:
            window_waveform = np.pad(
                window_waveform, (0, window_samples - len(window_waveform)))

        scores, embeddings, _ = yamnet_model(window_waveform)
        mean_embedding = np.mean(embeddings.numpy(), axis=0).reshape(1, -1)

        probs = keras_model.predict(mean_embedding)[0]
        max_prob = np.max(probs)

        if max_prob >= confidence_threshold:
            prob_sums += probs
            confident_window_count += 1
        else:
            # Window considered uncertain; ignored in known class aggregation
            pass

    if confident_window_count > 0:
        avg_probs = prob_sums / confident_window_count
    else:
        avg_probs = np.zeros(len(label_binarizer.classes_))

    unknown_prob = 0.0
    # If too few confident windows or max avg prob low, assign unknown prob
    if confident_window_count < num_windows or np.max(avg_probs) < unknown_threshold:
        unknown_prob = 1.0 - np.sum(avg_probs)
        unknown_prob = max(0.0, unknown_prob)

    final_classes = list(label_binarizer.classes_) + ['unknown']
    final_percentages = list(avg_probs * 100) + [unknown_prob * 100]

    final_classes = [str(x) for x in final_classes]
    final_percentages = [float(x) for x in final_percentages]

    return final_classes, final_percentages
