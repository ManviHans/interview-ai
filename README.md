# AI Resume Maker

Hi! This is a project I made while learning web development. I wanted to build something that could help with interview practice.

Add a job description and either upload a PDF resume or write a short description about yourself. The app uses Gemini to make practice questions, show some skills to work on, and create a preparation plan. You can also sign up and save your reports.

## What I used

- React and Vite for the website
- Node.js and Express for the backend
- MongoDB Atlas to save accounts and reports
- Gemini to create the interview content

## GitHub topics

`ai-resume-maker` · `interview-preparation` · `react` · `nodejs` · `mongodb` · `gemini`

## Try it

[Open my project](https://interview-ai-pi-mauve.vercel.app/login)

## Run it on your computer

You need Node.js, a MongoDB connection, and a Gemini API key.

### Backend

Open a terminal in the project folder and run:

```bash
cd Backend
npm install
```

Create a file called `.env` inside `Backend` and add your own keys:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
GOOGLE_GENAI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Then start the backend:

```bash
npm run dev
```

### Frontend

Open another terminal and run:

```bash
cd Frontend
npm install
npm run dev
```

Open the local link Vite shows, usually `http://localhost:5173`.

The frontend currently talks to my deployed backend. To use your local backend instead, change the `baseURL` to `http://localhost:3000` in these files:

- `Frontend/src/features/auth/services/auth.api.js`
- `Frontend/src/features/interview/services/interview.api.js`

## One thing to know

The resume/profile details are sent to Gemini to make the report, and reports are saved in MongoDB. I keep my API keys in `.env` and never upload that file to GitHub.

This is still a learning project, so the AI suggestions may need a quick check before you use them.
