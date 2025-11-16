import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import pooling
from deepface import DeepFace # type: ignore
from flask_mail import Mail, Message # type: ignore
from googleapiclient.discovery import build
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
import cv2 # type: ignore
import numpy as np

# --- NEW IMPORTS ---
import mysql.connector
from flask_bcrypt import Bcrypt # type: ignore
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager # type: ignore
# --- END NEW IMPORTS ---

# Initialize the Flask app
app = Flask(__name__)
CORS(app) 

# --- NEW CONFIGURATION ---
# Database configuration (replace with your details)
app.config['MYSQL_HOST'] = 'localhost'
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'sinha.rahul2318@gmail.com'  # Replace with your email
app.config['MAIL_PASSWORD'] = 'wslo gpxi huxl xupk'  # Replace with your email password
app.config['MYSQL_USER'] = 'music_app_user' # The user you created
app.config['MYSQL_PASSWORD'] = 'password' # The password you set
app.config['MYSQL_DB'] = 'music_recommender'
# ... (after all your app.config lines) ...

# --- NEW: Create Connection Pool ---
try:
    db_config = {
        'host': app.config['MYSQL_HOST'],
        'user': app.config['MYSQL_USER'],
        'password': app.config['MYSQL_PASSWORD'],
        'database': app.config['MYSQL_DB']
    }
    
    # Create a pool named 'my_pool' with 5 connections
    cnx_pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="my_pool",
        pool_size=5,
        **db_config
    )
    print("Connection pool created successfully.")
except mysql.connector.Error as err:
    print(f"Error creating connection pool: {err}")
    # If the pool fails, the app can't run
    exit(1) 
# --- END NEW POOL ---
mail = Mail(app)

os.environ["YOUTUBE_API_KEY"] = "AIzaSyAMYibuc5AXAgXlJmFgXJpp2Q7Wvoe_pFA"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"


# Setup JWT (JSON Web Tokens)
# IMPORTANT: Change this to a long, random secret key!
app.config['JWT_SECRET_KEY'] = 'your-super-secret-key' 
jwt = JWTManager(app)

s = URLSafeTimedSerializer(app.config['JWT_SECRET_KEY'])

# Initialize password hashing
bcrypt = Bcrypt(app)

# Function to get a database connection

# --- MODIFIED: Get a connection from the pool ---

def get_db_connection():
    try:
        # Get a connection from the pool
        conn = cnx_pool.get_connection()
        return conn
    except mysql.connector.Error as err:
        print(f"Error getting connection from pool: {err}")
        return None
    
# --- END NEW CONFIGURATION ---


# Create a folder to store uploaded images temporarily
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# --- API Endpoint for Emotion Detection (from before) ---
@app.route('/api/detect-emotion', methods=['POST'])
@jwt_required()
def detect_emotion():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file:
        # (rest of your emotion detection code) ...
        # (This code is unchanged)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)
        try:
            # Run DeepFace analysis
            # enforce_detection=True ensures this returns a list of faces
            analysis_list = DeepFace.analyze(
                img_path=filepath, 
                actions=['emotion'],
                enforce_detection=True
            )
            # --- THIS IS THE CHANGE ---
            # We'll just take the first face found
            first_face = analysis_list[0]
            dominant_emotion = first_face['dominant_emotion']
            region = first_face['region'] # This is a dict like {'x': 10, 'y': 20, 'w': 100, 'h': 100}

            # Clean up the temporary file
            os.remove(filepath)
            
            return jsonify({
                "emotion": dominant_emotion,
                "region": region 
            })
        except ValueError as e:
            os.remove(filepath)
            return jsonify({"error": "No face detected in the image"}), 400
        except Exception as e:
            os.remove(filepath)
            return jsonify({"error": str(e)}), 500
        
# --- NEW API ENDPOINT: Music Recommendations (Upgraded) ---
@app.route('/api/recommendations', methods=['POST'])
@jwt_required()
def get_recommendations():
    data = request.get_json()
    emotion = data.get('emotion')
    language = data.get('language', 'english') # Default to 'english' if not provided

    if not emotion:
        return jsonify({"error": "Emotion is required"}), 400

    # --- NEW: Multi-language Search Map ---
    # This is our new upgraded logic
    search_query_map = {
        'happy': {
            'english': 'upbeat pop songs',
            'hindi': 'latest hindi party songs 2025',
            'any': 'upbeat international music'
        },
        'sad': {
            'english': 'ambient music for relaxing',
            'hindi': 'sad hindi songs playlist',
            'any': 'relaxing instrumental music'
        },
        'angry': {
            'english': 'heavy metal mix',
            'hindi': 'angry hindi rap',
            'any': 'intense workout music'
        },
        'surprise': {
            'english': 'epic orchestral music',
            'hindi': 'surprising plot twist songs hindi',
            'any': 'epic cinematic music'
        },
        'fear': {
            'english': 'calming relaxing music',
            'hindi': 'calming meditation music hindi',
            'any': 'soothing sounds for sleep'
        },
        'neutral': {
            'english': 'lo-fi beats to relax/study to',
            'hindi': 'hindi lo-fi songs',
            'any': 'chillhop music'
        },
        'disgust': {
            'english': 'calming instrumental music',
            'hindi': 'calm hindi instrumental',
            'any': 'relaxing piano music'
        }
    }

    # Get the search query from our new map
    # 1. Get the dictionary for the detected emotion (or 'neutral' if not found)
    emotion_map = search_query_map.get(emotion.lower(), search_query_map['neutral'])
    # 2. Get the specific search query for the language (or 'any' if not found)
    search_query = emotion_map.get(language, emotion_map['any'])

    try:
        api_key = os.environ.get("YOUTUBE_API_KEY")
        if not api_key:
            return jsonify({"error": "API key not configured"}), 500

        youtube = build(
            YOUTUBE_API_SERVICE_NAME,
            YOUTUBE_API_VERSION,
            developerKey=api_key
        )

        search_response = youtube.search().list(
            q=search_query,
            part="snippet",
            maxResults=10,
            type="video",
            videoEmbeddable="true"
        ).execute()

        recommendations = []
        for item in search_response.get("items", []):
            recommendations.append({
                "video_id": item["id"]["videoId"],
                "title": item["snippet"]["title"],
                "channel_title": item["snippet"]["channelTitle"],
                "thumbnail_url": item["snippet"]["thumbnails"]["default"]["url"]
            })

        return jsonify(recommendations)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- NEW API ENDPOINT: User Signup ---
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor()

    # Check if user already exists
    try:
        cursor.execute("SELECT * FROM Users WHERE email = %s OR username = %s", (email, username))
        if cursor.fetchone():
            return jsonify({"error": "Email or username already exists"}), 409 # 409 = Conflict
        
        # Insert new user
        cursor.execute("INSERT INTO Users (username, email, password_hash) VALUES (%s, %s, %s)",
                       (username, email, hashed_password))
        conn.commit()
        return jsonify({"message": "User created successfully"}), 201 # 201 = Created
        
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# --- NEW API ENDPOINT: Forgot Password ---
@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        # Don't tell the user if the email exists or not for security
        return jsonify({"message": "If an account with this email exists, a reset link has been sent."}), 200

    try:
        # Create a timed token (valid for 1 hour)
        token = s.dumps(email, salt='password-reset-salt')

        # Create the email message
        msg = Message('Password Reset Request',
                      sender='your-email@gmail.com',
                      recipients=[email])
        
        # This is the link to your FRONTEND page
        reset_url = f"http://localhost:3000/reset-password/{token}"
        msg.body = f"To reset your password, please visit the following link:\n{reset_url}\n\nIf you did not make this request, please ignore this email."

        # Send the email
        mail.send(msg)
        
        return jsonify({"message": "If an account with this email exists, a reset link has been sent."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# --- NEW API ENDPOINT: Reset Password ---
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400

    try:
        # Validate the token (checks expiration and signature)
        # We set max_age to 3600 seconds (1 hour)
        email = s.loads(token, salt='password-reset-salt', max_age=3600)
        
        # Hash the new password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

        # Update the user's password in the database
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        
        cursor = conn.cursor()
        cursor.execute("UPDATE Users SET password_hash = %s WHERE email = %s",
                       (hashed_password, email))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Password reset successful"}), 200

    except SignatureExpired:
        return jsonify({"error": "The token has expired"}), 400
    except BadTimeSignature:
        return jsonify({"error": "Invalid token"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

# --- NEW API ENDPOINT: Add a Favorite Song ---
@app.route('/api/favorites', methods=['POST'])
@jwt_required() # Secure this endpoint
def add_favorite():
    # Get the user ID from the JWT token
    current_user_id = get_jwt_identity()
    data = request.get_json()

    # Get song details from the request body
    video_id = data.get('video_id')
    song_title = data.get('title')
    channel_title = data.get('channel_title')

    if not video_id:
        return jsonify({"error": "video_id is required"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    cursor = conn.cursor()

    try:
        # Check if the song is already a favorite
        cursor.execute("SELECT * FROM UserFavorites WHERE user_id = %s AND video_id = %s",
                       (current_user_id, video_id))
        if cursor.fetchone():
            return jsonify({"error": "Already in favorites"}), 409 # 409 = Conflict

        # Add the new favorite song
        cursor.execute(
            "INSERT INTO UserFavorites (user_id, video_id, song_title, channel_title) VALUES (%s, %s, %s, %s)",
            (current_user_id, video_id, song_title, channel_title)
        )
        conn.commit()
        return jsonify({"message": "Favorite added"}), 201
    
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# --- NEW API ENDPOINT: Get User's Favorite Songs ---
@app.route('/api/favorites', methods=['GET'])
@jwt_required() # Secure this endpoint
def get_favorites():
    # Get the user ID from the JWT token
    current_user_id = get_jwt_identity()

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    # dictionary=True returns results as {column_name: value}
    cursor = conn.cursor(dictionary=True) 

    try:
        cursor.execute("SELECT video_id, song_title, channel_title FROM UserFavorites WHERE user_id = %s",
                       (current_user_id,))
        favorites = cursor.fetchall()
        return jsonify(favorites)
    
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# --- NEW API ENDPOINT: User Login ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = conn.cursor(dictionary=True) # dictionary=True to get results as dicts

    try:
        cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
        user = cursor.fetchone()

        # Check if user exists and password is correct
        if user and bcrypt.check_password_hash(user['password_hash'], password):
            # Create a JWT token for the user
            access_token = create_access_token(identity=str(user['user_id']))
            return jsonify(access_token=access_token)
        else:
            return jsonify({"error": "Invalid credentials"}), 401 # 401 = Unauthorized

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
    finally:
        cursor.close()
        conn.close()

# This is the main entry point to run the app
if __name__ == '__main__':
    app.run(debug=True)