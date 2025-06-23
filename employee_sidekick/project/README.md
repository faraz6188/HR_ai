# Employee Sidekick

This project consists of a React frontend and a Flask backend. Follow the steps below to set up and run the application.

## Prerequisites

- Node.js and npm (for the frontend)
- Python 3.x and pip (for the backend)
- A Gemini API key (for the AI functionality)

## Setup Instructions

### Frontend Setup

1. Navigate to the project root directory.
2. Install the required Node.js dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

### Backend Setup

1. Navigate to the `api` directory:
   ```bash
   cd api
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```bash
   python app.py
   ```
   The backend will be available at `http://localhost:5000`.

## Running the Application

- Ensure both the frontend and backend servers are running.
- Open your browser and go to `http://localhost:5173` to access the application.

## Additional Notes

- Create a `.env` file in the `api` directory and add your Gemini API key as follows:
  ```
  GEMINI_API_KEY=your_api_key_here
  ```
- Make sure to replace `your_api_key_here` with your actual Gemini API key.
- For any issues, check the console logs for both the frontend and backend servers. 