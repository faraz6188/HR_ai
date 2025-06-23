from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
import random
from datetime import datetime, timedelta
import google.generativeai as genai
import re
import uuid
import time
from dotenv import load_dotenv

# Use a safer PDF reader library if PyPDF2 has issues
try:
    import pypdf as PyPDF2
except ImportError:
    import PyPDF2

# Load environment variables from .env file
load_dotenv()

# Configure Google Generative AI
genai.configure(api_key=os.getenv('GEMINI_API_KEY')) # Load API key from .env

app = Flask(__name__)
CORS(app)

# Create uploads directory and extracted texts directory if they don't exist
UPLOAD_FOLDER = 'uploads'
EXTRACTED_TEXTS_FOLDER = os.path.join(UPLOAD_FOLDER, 'extracted_texts')
FILE_INFO_PATH = os.path.join(UPLOAD_FOLDER, 'file_info.json')

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
if not os.path.exists(EXTRACTED_TEXTS_FOLDER):
    os.makedirs(EXTRACTED_TEXTS_FOLDER)

# In-memory storage for processed resource data
processed_resources = {}
# Persistent storage for filename mapping
uploaded_file_info = {}

# Load file info from JSON file on startup
def load_file_info():
    if os.path.exists(FILE_INFO_PATH):
        try:
            with open(FILE_INFO_PATH, 'r') as f:
                return json.load(f)
        except json.JSONDecodeError:
            return {}
    return {}

# Save file info to JSON file
def save_file_info():
    with open(FILE_INFO_PATH, 'w') as f:
        json.dump(uploaded_file_info, f)

# Load mock data
def load_data():
    try:
        with open('data.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Default data if file doesn't exist or is invalid
        return {
            "policies": [
                {"id": 1, "title": "Remote Work Policy", "content": "Employees may work remotely up to 3 days per week with manager approval."},
                {"id": 2, "title": "Vacation Policy", "content": "Full-time employees receive 15 vacation days per year, accrued monthly."},
                {"id": 3, "title": "Health Benefits", "content": "Comprehensive health, dental, and vision coverage is provided to all full-time employees.",}
            ],
            "employees": [
                {"id": 1, "name": "John Doe", "position": "Product Manager", "vacationDays": 15, "nextReview": "2025-06-15"}
            ],
            "documents": [
                {"id": 1, "title": "Employee Handbook", "url": "/documents/handbook.pdf"},
                {"id": 2, "title": "Benefits Guide", "url": "/documents/benefits.pdf"},
                {"id": 3, "title": "Performance Review Template", "url": "/documents/review.pdf"}
            ]
        }

# Initialize file info and data
uploaded_file_info = load_file_info()
data = load_data()

# List to store PDF extracted texts with named knowledge bases
pdf_texts = []

# Define the fallback prompt structure
HR_ASSISTANT_PROMPT = """
You are an HR Assistant. Your primary goal is to help the user with their HR-related questions.

Here are some facts extracted from relevant documents:
{context}

Use the provided 'Document Facts' FIRST to answer the user's question. Prioritize information from these facts.

IF you find the answer in the 'Document Facts', provide a concise and direct answer based on those facts.

IF you cannot find the specific answer in the 'Document Facts', answer the question to the best of your ability as a knowledgeable HR Assistant, drawing from your general knowledge. Do NOT mention that the information was not found in the provided documents in this case.

Only use the following sentence IF the question is completely unrelated to HR or cannot be answered by a typical HR assistant:
"I'm sorry, but I can only answer questions related to HR topics and the provided documents."

User: {user_message}

HR Assistant:
"""

def add_pdf_text(name, text):
    """Add extracted text from a PDF to the knowledge base"""
    pdf_texts.append((name, text))

def generate_answer(question):
    """Generate answer based on accumulated context and fallback prompt"""
    combined_context = "\n".join([f"{name} Knowledge Base:\n{text}" for name, text in pdf_texts])
    
    formatted_prompt = HR_ASSISTANT_PROMPT.format(
        context=combined_context,
        user_message=question
    )
    response = model.generate_content(formatted_prompt)
    return response.text

# Function to load extracted texts from files on startup and add to pdf_texts
def load_extracted_texts_to_prompts():
    print("Attempting to load extracted texts to prompts...")
    if not os.path.exists(EXTRACTED_TEXTS_FOLDER):
        print(f"Extracted texts folder not found: {EXTRACTED_TEXTS_FOLDER}")
        return

    for filename in os.listdir(EXTRACTED_TEXTS_FOLDER):
        if filename.endswith('.txt'):
            file_path = os.path.join(EXTRACTED_TEXTS_FOLDER, filename)
            unique_filename = filename.replace('.txt', '')
            
            # Attempt to get original name from uploaded_file_info, fallback to unique filename
            original_name = uploaded_file_info.get(unique_filename, unique_filename) 
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    text_content = f.read()
                    add_pdf_text(original_name, text_content)
                    print(f"Successfully loaded and added extracted text for {original_name} (file: {filename}) to prompts.")
            except Exception as e:
                print(f"Error loading or adding extracted text for {filename}: {e}")
    print("Finished attempting to load extracted texts.")

# Load extracted texts into prompts when the app starts
with app.app_context():
    load_extracted_texts_to_prompts()

# Configure the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/api/policies', methods=['GET'])
def get_policies():
    return jsonify(data['policies'])

@app.route('/api/benefits', methods=['GET'])
def get_benefits():
    return jsonify({
        "medical": "Premium health coverage with $500 deductible",
        "dental": "Full dental coverage including two checkups per year",
        "vision": "Annual eye exam and $150 allowance for glasses/contacts",
        "retirement": "401(k) with 4% company match",
        "additional": ["Life insurance", "Disability insurance", "Employee assistance program"]
    })

@app.route('/api/vacation', methods=['GET'])
def get_vacation():
    employee_id = request.args.get('employee_id', 1)
    
    # Find employee
    employee = next((e for e in data['employees'] if e['id'] == int(employee_id)), None)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    # Generate some vacation days
    today = datetime.now()
    vacation_days = []
    
    # Past vacation
    for i in range(3):
        start_date = today - timedelta(days=random.randint(30, 90))
        vacation_days.append({
            "id": i + 1,
            "startDate": start_date.strftime("%Y-%m-%d"),
            "endDate": (start_date + timedelta(days=random.randint(1, 5))).strftime("%Y-%m-%d"),
            "status": "Approved",
            "type": "Vacation"
        })
    
    # Future vacation
    for i in range(2):
        start_date = today + timedelta(days=random.randint(15, 60))
        vacation_days.append({
            "id": i + 4,
            "startDate": start_date.strftime("%Y-%m-%d"),
            "endDate": (start_date + timedelta(days=random.randint(1, 3))).strftime("%Y-%m-%d"),
            "status": "Pending" if i == 1 else "Approved",
            "type": "Vacation"
        })
    
    return jsonify({
        "availableDays": employee['vacationDays'],
        "vacationDays": vacation_days
    })

@app.route('/api/performance', methods=['GET'])
def get_performance():
    employee_id = request.args.get('employee_id', 1)
    
    # Find employee
    employee = next((e for e in data['employees'] if e['id'] == int(employee_id)), None)
    if not employee:
        return jsonify({"error": "Employee not found"}), 404
    
    # Generate performance review data
    next_review_date = datetime.strptime(employee['nextReview'], "%Y-%m-%d")
    
    past_reviews = [
        {
            "id": 1,
            "date": (next_review_date - timedelta(days=90)).strftime("%Y-%m-%d"),
            "rating": 4.2,
            "strengths": ["Communication", "Teamwork"],
            "improvements": ["Technical skills", "Time management"],
            "summary": "Overall good performance with notable achievements in project X."
        },
        {
            "id": 2,
            "date": (next_review_date - timedelta(days=180)).strftime("%Y-%m-%d"),
            "rating": 4.0,
            "strengths": ["Problem solving", "Customer focus"],
            "improvements": ["Documentation", "Leadership"],
            "summary": "Consistent performance with good results on assigned tasks."
        }
    ]
    
    return jsonify({
        "nextReview": employee['nextReview'],
        "pastReviews": past_reviews,
        "metrics": {
            "communication": 4.2,
            "technical": 3.8,
            "teamwork": 4.5,
            "leadership": 3.6
        }
    })

@app.route('/api/documents', methods=['GET'])
def get_documents():
    return jsonify(data['documents'])

@app.route('/api/process_file', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.pdf'):
        try:
            # Generate unique filename
            original_filename = file.filename
            unique_filename = f"{uuid.uuid4()}_{original_filename}"
            pdf_file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            text_file_path = os.path.join(EXTRACTED_TEXTS_FOLDER, f"{unique_filename}.txt")
            
            # Save the PDF file
            file.save(pdf_file_path)

            # Read PDF content
            pdf_reader = PyPDF2.PdfReader(pdf_file_path)
            text_content = ''
            for page_num in range(len(pdf_reader.pages)):
                text_content += pdf_reader.pages[page_num].extract_text() or ''

            # Store the processed text persistently in a text file
            with open(text_file_path, 'w', encoding='utf-8') as f:
                f.write(text_content)

            # Add the extracted text to the in-memory knowledge base (pdf_texts)
            add_pdf_text(original_filename, text_content)
            print(f"Added extracted text for {original_filename} to prompts.")

            # Store the processed text in-memory for current session (keeping for potential other uses)
            processed_resources[unique_filename + '.pdf'] = text_content

            # Store the mapping of unique to original filename persistently
            uploaded_file_info[unique_filename] = original_filename
            save_file_info()

            return jsonify({
                'message': 'File processed successfully',
                'filename': unique_filename,
                'original_name': original_filename
            })

        except Exception as e:
            # Clean up partially created files if an error occurs
            if 'pdf_file_path' in locals() and os.path.exists(pdf_file_path):
                os.remove(pdf_file_path)
            if 'text_file_path' in locals() and os.path.exists(text_file_path):
                os.remove(text_file_path)
            print(f"Error processing file: {e}")
            return jsonify({'error': f'Failed to process PDF file: {e}'}), 500
    else:
        return jsonify({'error': 'Unsupported file type. Only PDF is supported.'}), 400

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        # Use the stored original name for the download name
        download_name = uploaded_file_info.get(filename, filename)
        return send_file(
            file_path,
            as_attachment=True,
            download_name=download_name
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 404

@app.route('/api/uploaded_files', methods=['GET'])
def list_uploaded_files():
    files_list = []
    # Iterate through the persistent file info to list files
    for unique_pdf_filename, original_name in uploaded_file_info.items():
        files_list.append({
            'filename': unique_pdf_filename,
            'original_name': original_name,
            'url': f'/api/download/{unique_pdf_filename}'
        })
    return jsonify(files_list)

@app.route('/api/delete_file/<filename>', methods=['DELETE'])
def delete_file_endpoint(filename):
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        text_file_path = os.path.join(EXTRACTED_TEXTS_FOLDER, f"{filename.replace('.pdf', '')}.txt")

        # Check if the file exists and is in the uploaded_file_info
        if filename in uploaded_file_info and os.path.exists(file_path):
            # Remove from uploaded_file_info and save
            del uploaded_file_info[filename]
            save_file_info()

            # Delete the PDF file
            os.remove(file_path)

            # Delete the corresponding extracted text file if it exists
            if os.path.exists(text_file_path):
                os.remove(text_file_path)

            # Optional: remove from in-memory processed_resources if needed
            if filename in processed_resources:
                 del processed_resources[filename]

            print(f"Deleted file: {filename}")
            return jsonify({'message': 'File deleted successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Return 404 if the file was not found or not in uploaded_file_info
    return jsonify({'error': 'File not found or not an uploaded file'}), 404

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message')

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    try:
        # Check if this is a general question that doesn't need document search
        general_questions = [
            "tell me about yourself",
            "who are you",
            "what can you do",
            "help",
            "hi",
            "hello",
            "hey"
        ]
        
        if any(q in user_message.lower() for q in general_questions):
            # For general questions, use AI directly with a simpler prompt
            response = model.generate_content(f"You are an HR Assistant. Respond to the user's general question: {user_message}")
            return jsonify({'response': response.text.replace('**', '')})

        # For specific questions, use the generate_answer function with combined PDF text
        response_text = generate_answer(user_message)

        return jsonify({'response': response_text.replace('**', '')})

    except Exception as e:
        print(f"Error in chat endpoint: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)