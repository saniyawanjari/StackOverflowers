from flask import Flask, request, jsonify
from flask_cors import CORS
from textblob import TextBlob
import csv
import re
from datetime import datetime

app = Flask(__name__)
CORS(app)

# ---------------- HOME ROUTE ----------------
@app.route("/")
def home():
    return "Backend is running successfully!"

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

    if "order" in text:
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

# ---------------- FETCH ORDER ----------------
def fetch_order(order_id):
    try:
        with open("orders.csv", mode='r') as file:
            reader = csv.DictReader(file)
            for row in reader:
                if row["OrderID"] == order_id:
                    return row
    except:
        return None

# ---------------- CRM LOG ----------------
def log_to_crm(user_text, intent, sentiment, priority):
    with open("crm_log.csv", mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([
            datetime.now(),
            user_text,
            intent,
            sentiment,
            priority
        ])

# ---------------- MAIN CHAT API ----------------
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_text = data.get("message", "")

    sentiment = detect_sentiment(user_text)
    intent = detect_intent(user_text)
    priority = detect_priority(user_text)

    response = "How can I assist you today?"

    # ORDER TRACKING WITH REGEX
    if intent == "Order Tracking":
        order_match = re.search(r'\d+', user_text)
        if order_match:
            order_id = order_match.group()
            order = fetch_order(order_id)
            if order:
                response = f"Your order {order_id} is currently {order['Status']} and will arrive on {order['DeliveryDate']}."
            else:
                response = "Sorry, I could not find that order."
        else:
            response = "Please provide your order ID."

    elif intent == "Refund Request":
        response = "Your refund request has been initiated. Our team will contact you shortly."

    elif intent == "Payment Issue":
        response = "Please verify your payment details. If the issue persists, we will escalate it."

    # Emotional Intelligence
    if sentiment == "Angry":
        response = "I sincerely apologize for the inconvenience. " + response

    # Log interaction
    log_to_crm(user_text, intent, sentiment, priority)

    return jsonify({
        "response": response,
        "intent": intent,
        "sentiment": sentiment,
        "priority": priority
    })

if __name__ == "__main__":
    app.run(debug=True)