# BanRakshak

## हाम्रो प्रयास (Our Initiative)

बन रक्षक एउटा श्रव्य निगरानी प्रणाली हो जसले वन संरक्षण र वन्यजन्तु संरक्षणमा मद्दत गर्दछ। यसले वास्तविक समयमा अडियो डेटा संकलन गरेर मेसिन लर्निङ मोडेलको प्रयोगले विश्लेषण गर्दछ र कुनै पनि शंकास्पद गतिविधिहरू जस्तै अवैध काठ कटानी वा चोरी सिकारी पत्ता लगाउँदछ।

BanRakshak is an audio surveillance system designed to aid in forest conservation and wildlife protection. It collects real-time audio data, analyzes it using a machine learning model, and detects suspicious activities such as illegal logging or poaching.

## Our Approach

Our system is built on a combination of real-time audio processing, machine learning, and a user-friendly web interface for monitoring and alerts.

### 1. Real-time Audio Surveillance

- **Hardware:** We use a Raspberry Pi equipped with a microphone to capture audio from the forest environment continuously.
- **Data Collection:** The `record_sound.py` script records audio clips and saves them for processing.

### 2. Machine Learning for Audio Classification

- **Model:** We have trained a multi-class audio classifier (`multi_class_audio_classifier.h5`) to distinguish between different sounds, such as chainsaws, gunshots, animals, and human activity.
- **Inference:** The `run_inference.py` script uses the trained model to analyze the recorded audio and identify potential threats.

### 3. Instant Alerts and Notifications

- **Real-time Alerts:** When a threat is detected, the system sends an immediate alert to the backend server.
- **GPS Tracking:** The `read_gps.py` script provides the location of the detected event, which is crucial for a rapid response.

### 4. Web-Based Dashboard

- **Frontend:** We have developed a React-based frontend to provide a comprehensive dashboard for monitoring the forest.
- **Backend:** A FastAPI server (`server.py`) handles communication between the Raspberry Pi client and the frontend, serving real-time data and alerts.

## Getting Started

To get the BanRakshak system up and running, follow these steps.

### Prerequisites

- **Hardware:**
  - Raspberry Pi (for the client)
  - Microphone
  - GPS Module
- **Software:**
  - Python 3.x
  - Node.js and npm
  - Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/BanRakshak.git
   cd BanRakshak
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   python server.py
   ```

2. **Start the Frontend Development Server:**
   ```bash
   cd ../frontend
   npm run dev
   ```

3. **Run the Raspberry Pi Client:**
   - Ensure the `controller.py` script on the Raspberry Pi is configured with the correct server IP address.
   - Run the client:
     ```bash
     python controller.py
     ```

## Project Structure

```
BanRakshak/
├── backend/
│   ├── server.py           # FastAPI server for handling alerts and data
│   ├── pi_client.py        # Client script for testing connection
│   └── requirements.txt    # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── Components/     # UI components
│   │   └── Pages/          # Different pages of the dashboard
│   ├── package.json        # Node.js dependencies
│   └── vite.config.js      # Vite configuration
├── pipeline/
│   ├── controller.py       # Main script for the Raspberry Pi
│   ├── run_inference.py    # Script for running the ML model
│   ├── record_sound.py     # Script for recording audio
│   ├── read_gps.py         # Script for reading GPS data
│   └── *.h5, *.pkl         # ML model and label binarizer
└── Training/
    └── AudioClassifier.ipynb # Jupyter notebook for training the model
```

## Codebase Overview

### Backend

-   **`server.py`**: A FastAPI application that uses WebSockets for real-time communication. It receives data from the Raspberry Pi, prints it to the console, and broadcasts it to all connected clients (like the web dashboard).
-   **`pi_client.py`**: This script contains two client implementations. One is a simple client for sending fake data to test the server. The other is a multi-threaded client that handles audio recording, inference, and WebSocket communication, designed to run on the Raspberry Pi.
-   **`index.html`**: A basic HTML page that connects to the WebSocket server and displays the live event feed in a table.

### Pipeline

-   **`run_inference.py`**: This is the core of the audio analysis. It loads a pre-trained Keras model, a label binarizer, and the YAMNet model. The `run_inference` function processes audio waveforms in sliding windows, using the models to classify sounds and identify potential threats. It also includes logic to handle uncertainty in the predictions.

## Contributing

We welcome contributions to BanRakshak! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.