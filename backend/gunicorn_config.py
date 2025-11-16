# Gunicorn config file
    
    # Set a longer timeout
    # DeepFace and TensorFlow can take a long time to load or process
    # The default 30s is too short and will cause your app to crash
    timeout = 120