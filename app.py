from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)
#تحميل الموديل
model = load_model("model.h5")
#اسماء الكلاسات
class_names = [
    "Tomato - Fungal infection",
    "Cucumber - Nitrogen deficiency",
    "Pepper - Whitefly attack",
    "Wheat - Rust fungus",
    "Corn - Iron deficiency"
]

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/predict" , methods=["POST"])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"})
    
    file = request.files['file']
    filepath = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filepath)
#تجهيز الصور
    img = image.load_img(filepath,target_size=(224,224))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
#التوقع
    prediction = model.predict(img_array)
    predicted_class = class_names[np.argmax(predictions)]
    confidence = float(np.max(predictions))

    return jsonify({
        "result": predeicted_class,
        "confidence": round(confidence * 100, 2)
    })
if __name__=="__main__":
    app.run(debug=True)
