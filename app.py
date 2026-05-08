from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from google import genai
from google.genai import types
import json
import cv2
import numpy as np
from ultralytics import YOLO

# 1. إعداد التطبيق والمسارات
app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, 'disease_info.json')
DIAGNOSIS_MODEL_PATH = os.path.join(BASE_DIR, 'model', 'best (2).pt')

# 1. إعداد العميل بالمفتاح الجديد
API_KEY = "AIzaSyCi2MEVZ6fdhVSt17K2eizXN3Y5JHAAyxg"
client = genai.Client(api_key=API_KEY)

# 2. اكتشاف أفضل موديل متاح تلقائياً (تحديث 2026)
def get_best_model():
    try:
        # نسأل جوجل عن الموديلات المتاحة لهذا المفتاح
        models = client.models.list()
        for m in models:
            if "gemini-flash-latest" in m.name.lower():
                print(f"✅ Found stable model: {m.name}")
                return m.name
        for m in models:
            # نبحث عن الموديلات التي تبدأ بـ gemini كبديل
            if "gemini" in m.name.lower():
                print(f"✅ Found fallback model: {m.name}")
                return m.name
        return "gemini-flash-latest" 
    except Exception as e:
        print(f"Error listing models: {e}")
        return "gemini-flash-latest"

SELECTED_MODEL = get_best_model()

FARMER_EXPERT_INSTRUCTIONS = "أنت خبير زراعي تساعد الفلاحين في أمراض النباتات والمحاصيل فقط."

# تخزين المحادثات
user_chats = {}

# 3. إعداد نموذج التشخيص
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
        # محاولة أخيرة في حال فشل الجلسة
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
        # قمنا بتقليل نسبة الثقة (conf) إلى 0.1 ليتمكن من التقاط النباتات الأخرى غير التفاح والطماطم
        results = diagnosis_ai(image, conf=0.1)
        if len(results[0].boxes) > 0:
            class_id = int(results[0].boxes.cls[0].item())
            confidence = float(results[0].boxes.conf[0].item())
            disease_name = diagnosis_ai.names[class_id]
            with open(JSON_PATH, 'r', encoding='utf-8') as f:
                db = json.load(f)
            # بحث ذكي لتطابق الأسماء
            db_lower = {k.lower(): v for k, v in db.items()}
            search_key = disease_name.lower()
            
            info = db.get(disease_name) or db_lower.get(search_key)
            
            # إذا لم يجد تطابقاً مباشراً، نستخدم البحث الذكي بالكلمات
            if not info:
                search_parts = disease_name.lower().replace('_', ' ').split()
                for k, v in db_lower.items():
                    clean_k = k.replace('_', ' ').replace('(', ' ').replace(')', ' ').replace(',', ' ').lower()
                    # هل جميع كلمات البحث موجودة في هذا المفتاح؟
                    if all(part in clean_k for part in search_parts):
                        info = v
                        break
            
            # إذا فشل كل شيء، استخدم الافتراضي
            if not info:
                info = db["default"]
            return jsonify({
                'success': True,
                'disease_en': disease_name,
                'disease_ar': info['name_ar'],
                'causes': info['causes'],
                'risk_level': info['risk_level'],
                'recommendation': info['recommendation'],
                'confidence': round(confidence * 100, 2)
            })
        return jsonify({'success': False, 'error': 'No disease detected'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    print(f"Auto-Agri Server is running with model: {SELECTED_MODEL}")
    app.run(debug=True, host='0.0.0.0', port=5000)
