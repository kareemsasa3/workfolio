# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

import logging
logging.basicConfig(level=logging.DEBUG)

load_dotenv()

def application(environ, start_response):
  if environ['REQUEST_METHOD'] == 'OPTIONS':
    start_response(
      '200 OK',
      [
        ('Content-Type', 'application/json'),
        ('Access-Control-Allow-Origin', '*'),
        ('Access-Control-Allow-Headers', 'Authorization, Content-Type'),
        ('Access-Control-Allow-Methods', 'POST'),
      ]
    )
    return ''

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/send-email', methods=['POST'])
def send_email():
    data = request.get_json()
    logging.debug(f'Received data: {data}')
    sender_email = data.get('email')
    subject = data.get('subject')
    message = data.get('message')

    email = os.getenv('EMAIL_USERNAME')
    password = os.getenv('EMAIL_PASSWORD')

    logging.debug(f'Email Username: {email}')
    logging.debug(f'Email Password:, {password}')

    if not email or not password:
        logging.error('Email credentials not configured.')
        return jsonify({'error': 'Email credentials not configured.'}), 500

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = email
        msg['Subject'] = subject

        msg.attach(MIMEText(message, 'plain'))

        server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
        server.login(email, password)
        server.sendmail(sender_email, email, msg.as_string())
        server.quit()

        logging.debug('Email sent successfully!')

        return jsonify({'message': 'Email sent successfully!'}), 200

    except Exception as e:
        logging.error(f'Error sending email: {str(e)}')
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
