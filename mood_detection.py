from flask import Flask, jsonify
import cv2
from deepface import DeepFace
import time
import collections
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

@app.route('/detect_mood', methods=['GET'])
def detect_mood():
    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        return jsonify({"error": "Camera not detected"}), 500

    DETECTION_TIME = 10  # Capture frames for 10 seconds
    start_time = time.time()
    emotion_counter = collections.Counter()

    print("Detecting mood... Please wait.")

    while time.time() - start_time < DETECTION_TIME:
        ret, frame = cap.read()
        if not ret or frame is None:
            print("Warning: Empty frame received.")
            continue

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        try:
            result = DeepFace.analyze(frame_rgb, actions=['emotion'], enforce_detection=False)

            if isinstance(result, list) and len(result) > 0 and 'dominant_emotion' in result[0]:  
                detected_emotion = result[0]['dominant_emotion']
            elif isinstance(result, dict) and 'dominant_emotion' in result:
                detected_emotion = result['dominant_emotion']
            else:
                detected_emotion = "Unknown"

            emotion_counter[detected_emotion] += 1

        except Exception as e:
            print(f"Error in emotion detection: {e}")

    cap.release()

    dominant_emotion = emotion_counter.most_common(1)[0][0] if emotion_counter else "Neutral"

    return jsonify({"mood": dominant_emotion})

if __name__ == '__main__':
    app.run(debug=True)
