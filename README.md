# 🚀AI-Powered-Emotion-Aware-Music-Recommender-System


- EmotionMusic is a full-stack, intelligent web application designed to bridge the gap between human emotion and music discovery.
  
-  Moving beyond traditional genre- or history-based recommendations, this application uses real-time facial emotion recognition to analyze a user's current mood and generate a tailored playlist of music to match it.

- The project is a complete, end-to-end system featuring a modern, animated frontend built in React, a powerful backend API built in Flask (Python), and a secure, cloud-hosted MySQL database.
  
- It handles everything from user authentication and real-time AI analysis to fetching music from the YouTube API and saving user "favorites."
  

## 🌐Table of Contents


- Working demo
  
- Overview
  
- Features

- Quick Demo
  
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


## Quick Demo

1. Start the app (instructions below).
2. Open the web UI at http://localhost:5000 (or the port configured).
3. Enter patient features and get a risk score with a short explanation.
   

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

### Web UI
- Fill in patient information (age, sex, blood pressure, cholesterol, etc.)
- Submit to receive a risk score and short explanation/high-level feature contributions.

### API (example)
A sample POST request to the model endpoint:
```bash
curl -X POST http://localhost:5000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 54,
    "sex": 1,
    "cp": 3,
    "trestbps": 140,
    "chol": 239,
    "fbs": 0,
    "restecg": 1,
    "thalach": 160,
    "exang": 0,
    "oldpeak": 1.2,
    "slope": 2,
    "ca": 0,
    "thal": 2
  }'
```
Response (example):
```json
{
  "risk_score": 0.72,
  "risk_level": "High",
  "explanation": {
    "top_features": {
      "age": 0.22,
      "chol": 0.18,
      "thalach": -0.15
    }
  }
}
```

Note: The exact input schema and keys depend on the implementation. See `api/` or `app.py` for exact details.

## 💫Data & Model

### 🌟Dataset (example)
This project is compatible with common heart disease datasets (for example, the UCI Heart Disease dataset). Place datasets in a `data/` directory and follow the preprocessing script expectations.

### ⚡Training
A training script is expected at `scripts/train.py` or `train.py`. Typical steps:
1. Load and split the dataset
2. Preprocess features
3. Train model(s)
4. Evaluate and save the best model to `model`

Example run:
```bash
python train_model.py 
```

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

## 💫Acknowledgements
- This project was developed as part of the Infosys Springboard Virtual Internship Program.
- Thanks to the open-source community for the incredible libraries that made this project possible.
