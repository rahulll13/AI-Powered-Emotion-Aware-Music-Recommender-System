# 🚀AI-Powered-Emotion-Aware-Music-Recommender-System


- EmotionMusic is a full-stack, intelligent web application designed to bridge the gap between human emotion and music discovery.
  
-  Moving beyond traditional genre- or history-based recommendations, this application uses real-time facial emotion recognition to analyze a user's current mood and generate a tailored playlist of music to match it.

- The project is a complete, end-to-end system featuring a modern, animated frontend built in React, a powerful backend API built in Flask (Python), and a secure, cloud-hosted MySQL database.
  
- It handles everything from user authentication and real-time AI analysis to fetching music from the YouTube API and saving user "favorites."
  

## 🌐Table of Contents


- Working demo

- Quick demo
  
- Overview
  
- Features

- Getting Started
  
  - Prerequisites
    
  - Installation
    
  - Running locally
    
- Screenshots
   
- Usage
  
  - Web UI
    
  - API
    
- Data & Model
  
  - Dataset (example)'
    
  - Training
    
  - Inference
    
- Configuration
  
- Tests
  
- Contributing
  
- License
  
- Contact
  
- Acknowledgements
  

## 🎮Working demo


- A brief video walkthrough of the application, demonstrating user registration, the Detection process, and the Music Recommendations.
  
- Click the thumbnail below to watch a full video walkthrough of the application.
  
[![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/landing%20page.png)](https://youtu.be/edyFVjffw9g)


## 🪄Quick Demo

# A quick demo of this application is available at:-

https://emotion-aware-nine-beta-78.vercel.app/


## 🪄Overview 


- EmotionMusic is a full-stack, intelligent web application designed to bridge the gap between human emotion and music discovery.
   
- Moving beyond traditional genre- or history-based recommendations, this application uses real-time facial emotion recognition to analyze a user's current mood and generate a tailored playlist of music to match it.

- It's built on a modern, decoupled architecture: a React frontend (for the user interface) and a Flask (Python) backend (for handling AI, user data, and external APIs).


## ✨Features


- Dynamic Landing Page: A fully animated, multi-section homepage with CSS-animated background and clear navigation.

- Full User Authentication: Secure signup, login, and password hashing (bcrypt).

- Protected Routes: Dashboard and Favorites pages are accessible only to logged-in users using JSON Web Tokens (JWT).

- Full Password Reset: A complete "Forgot Password" flow that sends a secure, timed email link to the user.

- Dual-Mode Emotion Detection:

- Live Webcam: Start your camera and get an instant emotion analysis from a snapshot.

- Image Upload: Upload a photo to detect emotion.

- AI Analysis: Uses deepface (TensorFlow) to draw a bounding box on the detected face and classify the emotion (Happy, Sad, Neutral, etc.).

- Personalized Recommendations: Fetches music from the YouTube API based on both the detected emotion and a user-selected language preference (English, Hindi, or Any).

- "My Favorites" System: Users can "like" songs, which are saved to their personal account and accessible on a dedicated "My Favorites" page.


## 🛠️ Tech Stack & Architecture


### Backend


- Framework: Python 3.11, Flask, Gunicorn (for production)

- Authentication: Flask-JWT-Extended (for stateless JWTs), Flask-Bcrypt (for password hashing)

- Database: MySQL with mysql-connector-python (using Connection Pooling)

- Services: Flask-Mail (for password resets), google-api-python-client (for YouTube Data API)

- File Handling: Flask's built-in request.files and os module for temporary image storage.
  

### AI / Data Science


- Core Library: deepface (for pre-trained emotion detection models)

- ML Backend: TensorFlow (tensorflow-cpu for deployment)

- Image/Video Handling: OpenCV (opencv-python-headless)

- Data Handling: NumPy


### Frontend


- Core: React 19 (JavaScript, JSX), HTML5, CSS3

- Styling: Tailwind CSS (for utility-first design)

- Animation: Framer Motion (for all UI and page animations)

- Routing: React Router v7 (for page navigation and protected routes)

- State Management: React Context API (for global auth state), localStorage (for token persistence)

- API Client: Axios (for all HTTP requests)

- Icons: Lucide-React
  

### Deployment & Infrastructure


- Backend API: Render (as a Web Service)

- Database: Railway (for the hosted MySQL database)

- Frontend: Netlify (for static site hosting)

- Version Control: GitHub
  
  
## Getting Started


- Follow these instructions to get a copy of the project up and running on your local machine for development and testing.


### Prerequisites


- we will need the following tools installed on your system:

- Node.js (which includes npm)

- Python 3.11+

- A pip package manager

- Git & GitHub
  

## ⚙️Local Installation and setup


### 1. Clone the repo:


```bash
git clone [https://github.com/your-username/emotion-music-recommender.git](https://github.com/your-username/emotion-music-recommender.git)
cd emotion-music-recommender
```


### 2. Set up the Backend (Python):


```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```


### 3. Set up the Frontend (React):

 
```bash
cd ../frontend
npm install
```


### 4. Initialize the database:


- Start your local MySQL server.

- Log in to your MySQL client (e.g., MySQL Command Line Client or MySQL Workbench).

- Run the following SQL commands one by one:
  

```bash
-- 1. Create the database
CREATE DATABASE music_recommender;

-- 2. Create the user
CREATE USER 'music_app_user'@'localhost' IDENTIFIED BY 'password';

-- 3. Grant privileges
GRANT ALL PRIVILEGES ON music_recommender.* TO 'music_app_user'@'localhost';
FLUSH PRIVILEGES;

-- 4. Select the database
USE music_recommender;

-- 5. Create the Users table
CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create the EmotionLogs table
CREATE TABLE EmotionLogs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    detected_emotion VARCHAR(20) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- 7. Create the UserFavorites table
CREATE TABLE UserFavorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    video_id VARCHAR(50) NOT NULL,
    song_title VARCHAR(255),
    channel_title VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```


### 5. Configure Environment Variables


### 1.Backend:


- In the backend folder, create a new file named .env.
  
- This is where you'll put your secret keys.
  
- Copy and paste this, adding your real values:
  
  
```bash
MYSQL_HOST=localhost
MYSQL_USER=music_app_user
MYSQL_PASSWORD=password
MYSQL_DB=music_recommender
JWT_SECRET_KEY=my-super-secret-key-12345
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-character-google-app-password
YOUTUBE_API_KEY=your-youtube-api-key
FRONTEND_URL=http://localhost:3000
```


### 2.frontend: 


- Open frontend/src/api.js.

- Make sure the API_URL is set to your local backend:
  
```bash
  // For local testing:
const API_URL = 'http://localhost:5000/api';
```


### 6. Running the application


- we must run the backend and frontend in two separate terminals.
  

### Terminal 1: Start the Backend (Flask)


```bash
cd backend
.\venv\Scripts\activate
python app.py
```


- Your backend will now be running at http://localhost:5000
  

### Terminal 2: Start the frontend (react)


```bash
cd frontend
npm start
```


### 7. Access the App


- Then open http://localhost:3000 in your browser (not 5000)
  
  
## 📸Screenshots


### 1. Landing Page


![AI Music Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/landing%20page.png)


### 2. Features 


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Features%20of%20app.png)


### 3. How It Works:


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/How%20does%20it%20works.png)


### 3. Why choose us?:


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Why%20choose%20.png)


### 4. Developer:


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Developer.png)


### 5. Create Account 


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/signup%20page.png)


### 6. Login Page


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/sign%20In%20page.png)


### 7. Forget Password


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Reset%20Password%20Working.png)


### 8. Reset password from the Gmail


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Password%20Reset%20Request.png)


### 9. Reset Password


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Reset%20Password.png)


### 10. Dashboard Page


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/dashboard.png)


### 11. Live Detection Result 


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Result%20using%20Live%20Detection.png)


### 12. Music Recommendation of live detection in English 


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Music%20Recommendation%20based%20on%20live%20detection%20in%20English.png)


### 12. Music Recommendation of live detection in Hindi


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Music%20Recommendation%20based%20on%20live%20detection%20in%20Hindi.png)


### 13. Image Upload Result


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Result%20using%20Upload.png)


### 14. Music Recommendation Based on Upload


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/Music%20recommendation%20based%20on%20upload%20of%20image.png)


### 14. List Of Favourite songs


![AI Heart Health Assistant Demo](https://github.com/rahulll13/AI-Powered-Emotion-Aware-Music-Recommender-System/blob/master/backend/List%20Of%20Favorite%20songs.png)


## 🔥Usage


### Web UI: 

- Navigate to the homepage, click "Get Started" to create an account, or "Login."
  
- Once on your dashboard, use the "Live Detection" or "Upload Image" modules.
  
- After an emotion is detected, select your language and click "Get Music" to see your results.

### API (Examples)

- The Flask API is fully documented within the backend/app.py file.
  
- All data is transferred via JSON.
  
  ### Example 1: User Login (Get Token)
  
  - This is an unprotected POST request that takes a JSON body and returns your access token.

    ```bash
    curl -X POST http://localhost:5000/api/login \
    -H "Content-Type: application/json" \
    -d '{
    "email": "testuser@example.com",
    "password": "password123"
    }'
    ```
    
  - Response (Example)
 
    ```bash {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNTg5MjgzNSwianRpIjoiYjA5Mj...ZlIn0.L-pA1f..."} 
    ```


    ### Example 2: Get Music Recommendations (Protected)
 
    - This is a protected POST request. You must take the access_token from the login step and provide it as a Bearer Token in the Authorization header.

    ```bash
    curl -X POST http://localhost:5000/api/recommendations \
    -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
    "emotion": "happy",
    "language": "hindi"
    }'
    ```

    - Response (example):
   
      ```bash
      [
      {
      "video_id": "Vm-A0e-j9cA",
      "title": "Lutt Putt Gaya - Dunki | Shah Rukh Khan | Taapsee",
      "channel_title": "T-Series",
      "thumbnail_url": "https://i.ytimg.com/vi/Vm-A0e-j9cA/default.jpg"
      },
      {
      "video_id": "83-gP6f5P2Q",
      "title": "Jhoome Jo Pathaan | Shah Rukh Khan, Deepika | Vishal & Sheykhar",
      "channel_title": "YRF",
      "thumbnail_url": "https://i.ytimg.com/vi/83-gP6f5P2Q/default.jpg"
      }
      ]
      ```

      
### Example 3: Detect Emotion (Protected, File Upload)

- This request is different. It's a protected POST request, but instead of sending JSON, it sends multipart/form-data (a file). We use the -F flag instead of -d.

  ```bash
   curl -X POST http://localhost:5000/api/detect-emotion \
  -H "Authorization: Bearer $YOUR_ACCESS_TOKEN" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/your/face.jpg"
  ```

  - Response (example):
 
    ```bash
     {
    "emotion": "happy",
    "region": {
    "x": 210,
    "y": 178,
    "w": 394,
    "h": 394
    }
    }
    ```
    

## 💫Data & Model


### 🌟Dataset 


- This project leverages a pre-trained, state-of-the-art model for emotion detection, which means no local training is required.

### ⚡Pre-Trained Model

- We use the deepface library, a lightweight Python framework for facial attribute analysis.
  
-  It wraps several state-of-the-art, pre-trained models for facial recognition and analysis, which are built on TensorFlow and Keras.

-The emotion analysis model used by deepface was trained on large-scale, publicly available facial expression datasets (such as FER-2013, VGGFace2, and others), which contain thousands of images tagged with emotions (happy, sad, angry, neutral, etc.).

### ⚡⚡ Training

- The "training" step is not necessary because we are using a pre-built, production-ready model.

- This decision was made to ensure high accuracy and rapid development, as training a state-of-the-art emotion classifier from scratch would require a massive dataset and significant computation time.

- All the required AI models and weights are automatically downloaded by the deepface library the first time the backend server runs.

### 🧠 Inference

- Inference (the process of making a prediction) is handled by our Flask backend in the /api/detect-emotion endpoint.

 ## The process is as follows:

- 1.The React frontend sends an image (from webcam or upload) to the API.

- 2.The Flask server saves the image temporarily.

- 3.The backend calls the DeepFace.analyze() function on the saved image path.

- 4.DeepFace.analyze() performs two actions:

- 5.Face Detection: It finds the face in the image and returns its region (x, y, w, h coordinates).

-6. Emotion Classification: It analyzes the facial features within that region and predicts the dominant_emotion.

-7. The Flask server returns this information as a JSON object, which the frontend then uses to display the results and the bounding box.


## 💡Contributing


Contributions are welcome. Typical workflow:

1. Fork the repository
   
2. Create a feature branch: git checkout -b feature/awesome
   
3. Commit changes and push
   
4. Open a pull request describing changes and motivation
   

Please follow repository coding style and add tests for new functionality.


## 📜License


This project is provided under the MIT License — see the LICENSE file for details.


## 📞Contact

- GitHub: https://github.com/rahulll13
  
- Email: sinha.rahul2318@gmail.com

- LinkedIn: www.linkedin.com/in/rahul-kumar-sinha-bba5532ab
  

## 💫Acknowledgements


- This project was made possible by the incredible work of the open-source community and the generous free tiers provided by modern cloud hosting platforms.

- Core AI: A huge thank you to the creators of the DeepFace library for making state-of-the-art facial analysis so accessible. This project is built on its foundation.

- Machine Learning: This project stands on the shoulders of giants, powered by TensorFlow and OpenCV.

- Frameworks: React and Flask for providing the robust frameworks for the frontend and backend.

- UI & Design: Tailwind CSS and Framer Motion for making it possible to build a beautiful, modern, and animated UI.

- Icons: Lucide Icons for the clean and lightweight icon set.

- Deployment: Render, Railway, and Netlify for their outstanding free-tier plans that allow developers to deploy full-stack applications.

- Data: The YouTube Data API for providing access to a limitless library of music.
