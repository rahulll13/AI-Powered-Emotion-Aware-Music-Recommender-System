import cv2 # type: ignore
from deepface import DeepFace # type: ignore

# Load the pre-trained face detector from OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Start the webcam feed
cap = cv2.VideoCapture(0)

while True:
    # Read a frame from the webcam
    ret, frame = cap.read()
    if not ret:
        break

    # Convert the frame to grayscale for face detection
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = face_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

    for (x, y, w, h) in faces:
        try:
            # Analyze the face region for emotion
            # We pass the full color frame, not just the face, 
            # as DeepFace handles its own preprocessing
            analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
            
            # Note: DeepFace.analyze can find multiple faces. 
            # For simplicity, we'll take the first result.
            if isinstance(analysis, list):
                dominant_emotion = analysis[0]['dominant_emotion']
            else:
                dominant_emotion = analysis['dominant_emotion']

            # Draw a rectangle around the face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
            
            # Put the detected emotion text above the rectangle
            cv2.putText(frame, dominant_emotion, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)

        except Exception as e:
            # If DeepFace can't find a face or detect emotion, just skip
            pass

    # Display the resulting frame
    cv2.imshow('Real-time Emotion Detection', frame)

    # Press 'q' to exit the loop
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the webcam and close all windows
cap.release()
cv2.destroyAllWindows()