from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import csv
import re
import requests as http_requests
from datetime import datetime
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import ollama

# ---------------- APP INITIALIZATION ----------------
app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "super-secret-key"
jwt = JWTManager(app)

# ---------------- LANGUAGE DETECTION ----------------
def detect_language(text):
    if re.search(r'[\u0900-\u097F]', text):
        return "Hindi"
    return "English"

# ---------------- SENTIMENT ----------------
def detect_sentiment(text):
    analysis = TextBlob(text)
    polarity = analysis.sentiment.polarity
    if polarity < 0:
        return "Angry"
    elif polarity == 0:
        return "Neutral"
    else:
        return "Positive"

# ---------------- INTENT ----------------
def detect_intent(text):
    text = text.lower()
    if any(w in text for w in ["order", "delivery", "track", "shipped", "status", "kahan", "pahuncha", "mera", "deliver"]):
        return "Order Tracking"
    elif "refund" in text:
        return "Refund Request"
    elif "payment" in text:
        return "Payment Issue"
    else:
        return "General Inquiry"

# ---------------- PRIORITY ----------------
def detect_priority(text):
    urgent_words = ["urgent", "immediately", "fraud", "scam", "broken"]
    for word in urgent_words:
        if word in text.lower():
            return "High"
    return "Normal"

# ---------------- FETCH REAL ORDERS FROM MONGODB ----------------
LENSORA_BACKEND = "http://localhost:8000"

def fetch_orders_for_user(user_token):
    """Fetch real orders from MongoDB via Node.js backend"""
    try:
        res = http_requests.get(
            f"{LENSORA_BACKEND}/orders/",
            headers={"Authorization": f"Bearer {user_token}"},
            timeout=5
        )
        if res.status_code == 200:
            return res.json()
        return []
    except Exception as e:
        print("Backend fetch error:", e)
        return []

def format_orders_for_ai(orders):
    """Convert MongoDB orders into readable text for AI"""
    if not orders:
        return "This user has no orders yet."
    lines = []
    for o in orders:
        order_id = o.get("_id", "")[-6:].upper()
        status   = o.get("status", "Unknown")
        total    = o.get("totalAmount", 0)
        items    = ", ".join([i["name"] for i in o.get("items", [])])
        date     = o.get("createdAt", "")[:10]
        lines.append(f"Order #{order_id}: {items} | Status: {status} | Total: Rs.{total} | Date: {date}")
    return "\n".join(lines)

# ---------------- CRM LOG ----------------
def log_to_crm(user_text, intent, sentiment, priority):
    with open("crm_log.csv", mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([datetime.now(), user_text, intent, sentiment, priority])

# ---------------- LLM RESPONSE (Ollama llama3) ----------------
def generate_ai_response(user_text, intent, sentiment, order_context=""):
    try:
        order_section = f"""
REAL ORDER DATA FROM DATABASE (use ONLY this to answer order questions):
{order_context}
""" if order_context and order_context != "This user has no orders yet." else ""

        system_prompt = f"""You are Lensora's friendly AI assistant for a premium Indian eyewear brand.
{order_section}
Rules:
- Reply in 2 short sentences maximum.
- Be direct and helpful.
- If user speaks Hindi or Roman Hindi, reply fully in simple Hindi.
- If English, reply in English.
- For order questions, use ONLY the real order data above. Never make up status.
- If no order data available, ask the user to log in first."""

        response = ollama.chat(
            model="llama3",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user",   "content": user_text}
            ],
            options={"temperature": 0.4}
        )

        return response["message"]["content"]

    except Exception as e:
        print("Ollama Error:", e)
        return "Technical issue. Please try again."

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username")
    if not username:
        return jsonify({"msg": "Missing username"}), 400
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)

# ---------------- CHAT ----------------
@app.route("/chat", methods=["POST"])
@jwt_required()
def chat():
    data       = request.json
    user_text  = data.get("message", "")
    user_token = data.get("lensora_token", "")  # real JWT from Lensora frontend

    sentiment = detect_sentiment(user_text)
    intent    = detect_intent(user_text)
    priority  = detect_priority(user_text)

    # ✅ Fetch REAL orders from MongoDB
    real_orders   = fetch_orders_for_user(user_token) if user_token else []
    order_context = format_orders_for_ai(real_orders)

    # ✅ Generate response with Ollama + real order context
    ai_reply = generate_ai_response(user_text, intent, sentiment, order_context)

    log_to_crm(user_text, intent, sentiment, priority)

    return jsonify({
        "response":  ai_reply,
        "intent":    intent,
        "sentiment": sentiment,
        "priority":  priority
    })

# ---------------- RUN ----------------
if __name__ == "__main__":
    app.run(debug=True)