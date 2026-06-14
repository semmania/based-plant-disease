from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google import genai
from google.genai import types
import json
import cv2
import numpy as np
from ultralytics import YOLO


app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, 'disease_info.json')
DIAGNOSIS_MODEL_PATH = os.path.join(BASE_DIR, 'AI-model', 'best (5).pt')

# Replace with your newly generated API key. 
# Do not upload this key to GitHub otherwise it will be leaked again!
API_KEY = "AIzaSyDNy6O1oWoz-zecH8XnUvfdBaQpbbHcpg4"
client = genai.Client(api_key=API_KEY)


def get_best_model():
    try:
       
        models = client.models.list()
        for m in models:
            if "gemini-flash-latest" in m.name.lower():
                print(f"✅ Found stable model: {m.name}")
                return m.name
        for m in models:
           
            if "gemini" in m.name.lower():
                print(f"✅ Found fallback model: {m.name}")
                return m.name
        return "gemini-flash-latest" 
    except Exception as e:
        print(f"Error listing models: {e}")
        return "gemini-flash-latest"

SELECTED_MODEL = get_best_model()

FARMER_EXPERT_INSTRUCTIONS = "أنت خبير زراعي تساعد الفلاحين في أمراض النباتات والمحاصيل فقط."


user_chats = {}


diagnosis_ai = YOLO(DIAGNOSIS_MODEL_PATH)

@app.route('/chat', methods=['POST'])
def handle_chat():
    try:
        data = request.json
        user_input = data.get('message', '')
        user_id = data.get('session_id', 'farmer_final')
        
        if user_id not in user_chats:
            user_chats[user_id] = client.chats.create(
                model=SELECTED_MODEL,
                config=types.GenerateContentConfig(system_instruction=FARMER_EXPERT_INSTRUCTIONS)
            )
            
        response = user_chats[user_id].send_message(user_input)
        return jsonify({'response': response.text})
    except Exception as e:
        
        try:
            res = client.models.generate_content(model=SELECTED_MODEL, contents=user_input)
            return jsonify({'response': res.text})
        except Exception as e2:
            return jsonify({'error': f"AI Error: {str(e2)}"}), 500

@app.route('/predict', methods=['POST'])
def handle_diagnosis():
    try:
        file = request.files['image']
        file_bytes = np.frombuffer(file.read(), np.uint8)
        image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        
        CONFIDENCE_THRESHOLD = 0.9
        results = diagnosis_ai(image, conf=CONFIDENCE_THRESHOLD)
        
        with open(JSON_PATH, 'r', encoding='utf-8') as f:
            db = json.load(f)
            
        if len(results[0].boxes) > 0:
            best_box = sorted(results[0].boxes, key=lambda x: x.conf[0].item(), reverse=True)[0]
            class_id = int(best_box.cls[0].item())
            confidence = float(best_box.conf[0].item())
            disease_name = diagnosis_ai.names[class_id]
            
            if confidence >= CONFIDENCE_THRESHOLD:
                db_lower = {k.lower(): v for k, v in db.items()}
                search_key = disease_name.lower()
                
                info = db.get(disease_name) or db_lower.get(search_key)
                
                if not info:
                    search_parts = disease_name.lower().replace('_', ' ').split()
                    for k, v in db_lower.items():
                        clean_k = k.replace('_', ' ').replace('(', ' ').replace(')', ' ').replace(',', ' ').lower()
                        if all(part in clean_k for part in search_parts):
                            info = v
                            break
                
                if info:
                    return jsonify({
                        'success': True,
                        'disease_en': disease_name,
                        'disease_ar': info['name_ar'],
                        'causes': info['causes'],
                        'risk_level': info['risk_level'],
                        'recommendation': info['recommendation'],
                        'confidence': round(confidence * 100, 2)
                    })

        # Default case for low confidence or unknown plant types
        default_info = db.get("default", {
            "name_ar": "مرض غير مسجل حالياً ويرجى استشارة طبيب",
            "causes": "لم يتم التعرف على هذا النوع من النبات أو المرض بدقة كافية في قاعدة بياناتنا.",
            "risk_level": "غير محدد",
            "recommendation": "يرجى التأكد من تصوير ورقة النبات بوضوح، أو استشارة خبير زراعي."
        })
        
        return jsonify({
            'success': True,
            'disease_en': "Unrecognized Plant/Disease",
            'disease_ar': default_info['name_ar'],
            'causes': default_info['causes'],
            'risk_level': default_info['risk_level'],
            'recommendation': default_info['recommendation'],
            'confidence': 0
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print(f"PhytoCare Server is running with model: {SELECTED_MODEL}")
    app.run(debug=True, host='0.0.0.0', port=5000)
