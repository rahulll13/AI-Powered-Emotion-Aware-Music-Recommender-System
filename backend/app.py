import os
    from flask import Flask, request, jsonify
    from flask_cors import CORS
    from deepface import DeepFace
    import cv2
    import numpy as np
    import mysql.connector
    from mysql.connector import pooling # Use pooling
    from flask_bcrypt import Bcrypt
    from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, JWTManager
    from flask_mail import Mail, Message
    from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature
    from googleapiclient.discovery import build
    
    # Initialize the Flask app
    app = Flask(__name__)
    CORS(app) 
    
    # --- CONFIGURATION FROM ENVIRONMENT VARIABLES ---
    # We NO LONGER write secrets in the code. We get them from the server environment.
    app.config['MYSQL_HOST'] = os.environ.get('MYSQL_HOST')
    app.config['MYSQL_USER'] = os.environ.get('MYSQL_USER')
    app.config['MYSQL_PASSWORD'] = os.environ.get('MYSQL_PASSWORD')
    app.config['MYSQL_DB'] = os.environ.get('MYSQL_DB')
    
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    jwt = JWTManager(app)
    
    bcrypt = Bcrypt(app)
    
    app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
    app.config['MAIL_PORT'] = 587
    app.config['MAIL_USE_TLS'] = True
    app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
    mail = Mail(app)
    
    s = URLSafeTimedSerializer(app.config['JWT_SECRET_KEY'])
    
    # YouTube API Config
    YOUTUBE_API_KEY = os.environ.get("YOUTUBE_API_KEY")
    YOUTUBE_API_SERVICE_NAME = "youtube"
    YOUTUBE_API_VERSION = "v3"
    
    # Upload folder
    UPLOAD_FOLDER = 'uploads'
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    
    # --- Create Connection Pool ---
    try:
        db_config = {
            'host': app.config['MYSQL_HOST'],
            'user': app.config['MYSQL_USER'],
            'password': app.config['MYSQL_PASSWORD'],
            'database': app.config['MYSQL_DB']
        }
        cnx_pool = mysql.connector.pooling.MySQLConnectionPool(
            pool_name="my_pool",
            pool_size=5,
            **db_config
        )
        print("Connection pool created successfully.")
    except mysql.connector.Error as err:
        print(f"Error creating connection pool: {err}")
        # In a real app, you'd handle this failure
    
    # --- Get a connection from the pool ---
    def get_db_connection():
        try:
            return cnx_pool.get_connection()
        except mysql.connector.Error as err:
            print(f"Error getting connection from pool: {err}")
            return None
    
    # --- (Your API Endpoints) ---
    # Your 6 endpoints go here:
    # /api/detect-emotion
    # /api/signup
    # /api/login
    # /api/forgot-password
    # /api/reset-password
    # /api/recommendations
    # /api/favorites (POST)
    # /api/favorites (GET)
    
    # (No code change needed in your endpoints, but one quick fix)
    
    @app.route('/api/detect-emotion', methods=['POST'])
    @jwt_required()
    def detect_emotion():
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400
        if file:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)
            try:
                analysis_list = DeepFace.analyze(
                    img_path=filepath, 
                    actions=['emotion'],
                    enforce_detection=True
                )
                first_face = analysis_list[0]
                dominant_emotion = first_face['dominant_emotion']
                region = first_face['region']
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
    
    @app.route('/api/signup', methods=['POST'])
    def signup():
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')
        if not username or not email or not password:
            return jsonify({"error": "Missing username, email, or password"}), 400
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor()
        try:
            cursor.execute("SELECT * FROM Users WHERE email = %s OR username = %s", (email, username))
            if cursor.fetchone():
                return jsonify({"error": "Email or username already exists"}), 409
            cursor.execute("INSERT INTO Users (username, email, password_hash) VALUES (%s, %s, %s)",
                           (username, email, hashed_password))
            conn.commit()
            return jsonify({"message": "User created successfully"}), 201
        except mysql.connector.Error as err:
            return jsonify({"error": str(err)}), 500
        finally:
            cursor.close()
            conn.close() # Returns connection to pool
    
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
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
            user = cursor.fetchone()
            if user and bcrypt.check_password_hash(user['password_hash'], password):
                access_token = create_access_token(identity=str(user['user_id']))
                return jsonify(access_token=access_token)
            else:
                return jsonify({"error": "Invalid credentials"}), 401
        except mysql.connector.Error as err:
            return jsonify({"error": str(err)}), 500
        finally:
            cursor.close()
            conn.close()
    
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
            return jsonify({"message": "If an account with this email exists, a reset link has been sent."}), 200
        try:
            token = s.dumps(email, salt='password-reset-salt')
            msg = Message('Password Reset Request',
                          sender=os.environ.get('MAIL_USERNAME'),
                          recipients=[email])
            
            # --- CRITICAL DEPLOYMENT FIX ---
            # Use an environment variable for the frontend URL
            FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
            reset_url = f"{FRONTEND_URL}/reset-password/{token}"
            # --- END FIX ---
            
            msg.body = f"To reset your password, please visit the following link:\n{reset_url}\n\nIf you did not make this request, please ignore this email."
            mail.send(msg)
            return jsonify({"message": "If an account with this email exists, a reset link has been sent."}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/reset-password', methods=['POST'])
    def reset_password():
        data = request.get_json()
        token = data.get('token')
        new_password = data.get('password')
        if not token or not new_password:
            return jsonify({"error": "Token and new password are required"}), 400
        try:
            email = s.loads(token, salt='password-reset-salt', max_age=3600)
            hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
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
        except (SignatureExpired, BadTimeSignature):
            return jsonify({"error": "Invalid or expired token"}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    @app.route('/api/recommendations', methods=['POST'])
    @jwt_required()
    def get_recommendations():
        data = request.get_json()
        emotion = data.get('emotion')
        language = data.get('language', 'english')
        if not emotion:
            return jsonify({"error": "Emotion is required"}), 400
        search_query_map = {
            'happy': {'english': 'upbeat pop songs', 'hindi': 'latest hindi party songs 2025', 'any': 'upbeat international music'},
            'sad': {'english': 'ambient music for relaxing', 'hindi': 'sad hindi songs playlist', 'any': 'relaxing instrumental music'},
            'angry': {'english': 'heavy metal mix', 'hindi': 'angry hindi rap', 'any': 'intense workout music'},
            'surprise': {'english': 'epic orchestral music', 'hindi': 'surprising plot twist songs hindi', 'any': 'epic cinematic music'},
            'fear': {'english': 'calming relaxing music', 'hindi': 'calming meditation music hindi', 'any': 'soothing sounds for sleep'},
            'neutral': {'english': 'lo-fi beats to relax/study to', 'hindi': 'hindi lo-fi songs', 'any': 'chillhop music'},
            'disgust': {'english': 'calming instrumental music', 'hindi': 'calm hindi instrumental', 'any': 'relaxing piano music'}
        }
        emotion_map = search_query_map.get(emotion.lower(), search_query_map['neutral'])
        search_query = emotion_map.get(language, emotion_map['any'])
        try:
            youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=YOUTUBE_API_KEY)
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
    
    @app.route('/api/favorites', methods=['POST'])
    @jwt_required()
    def add_favorite():
        current_user_id = get_jwt_identity()
        data = request.get_json()
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
            cursor.execute("SELECT * FROM UserFavorites WHERE user_id = %s AND video_id = %s", (current_user_id, video_id))
            if cursor.fetchone():
                return jsonify({"error": "Already in favorites"}), 409
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
    
    @app.route('/api/favorites', methods=['GET'])
    @jwt_required()
    def get_favorites():
        current_user_id = get_jwt_identity()
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
        cursor = conn.cursor(dictionary=True)
        try:
            cursor.execute("SELECT video_id, song_title, channel_title FROM UserFavorites WHERE user_id = %s", (current_user_id,))
            favorites = cursor.fetchall()
            return jsonify(favorites)
        except mysql.connector.Error as err:
            return jsonify({"error": str(err)}), 500
        finally:
            cursor.close()
            conn.close()
            
    # Main entry point for production server
    if __name__ != '__main__':
        # This is to help gunicorn find the app
        gunicorn_app = app
    else:
        # This is for local testing
        app.run(debug=True)
