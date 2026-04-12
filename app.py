import os
import json
import numpy as np
from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import keras

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def _strip_unsupported_keys(obj):
    """Remove keys that are unsupported by the installed Keras version (e.g. quantization_config)."""
    if isinstance(obj, dict):
        if obj.get('class_name') in ('Dense',) and isinstance(obj.get('config'), dict):
            obj['config'].pop('quantization_config', None)
        return {k: _strip_unsupported_keys(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_strip_unsupported_keys(i) for i in obj]
    return obj

with open(os.path.join(BASE_DIR, 'config.json')) as f:
    config_data = _strip_unsupported_keys(json.load(f))

model = keras.saving.deserialize_keras_object(config_data)
model.load_weights(os.path.join(BASE_DIR, 'model.weights.h5'))

# أسماء الـ 38 كلاس (PlantVillage)
CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry___Powdery_mildew",
    "Cherry___healthy",
    "Corn___Cercospora_leaf_spot",
    "Corn___Common_rust",
    "Corn___Northern_Leaf_Blight",
    "Corn___healthy",
    "Grape___Black_rot",
    "Grape___Esca",
    "Grape___Leaf_blight",
    "Grape___healthy",
    "Orange___Haunglongbing",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper___Bacterial_spot",
    "Pepper___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Yellow_Leaf_Curl_Virus",
    "Tomato___Mosaic_virus",
    "Tomato___healthy",
]

app = Flask(__name__, static_folder=BASE_DIR, static_url_path='')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Please upload an image."}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        # تجهيز الصورة
        img = keras.utils.load_img(filepath, target_size=(224, 224))
        img_array = keras.utils.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0

        # التوقع
        predictions = model.predict(img_array, verbose=0)
        predicted_index = int(np.argmax(predictions))
        confidence = float(np.max(predictions))

        return jsonify({
            "class_name": CLASS_NAMES[predicted_index],
            "confidence": round(confidence * 100, 2)
        })
    finally:
        if os.path.exists(filepath):
            os.remove(filepath)


if __name__ == '__main__':
    app.run(debug=True)

