# Lumpy Pocket - Save-it-Later App

A Pocket/Instapaper clone for saving articles to read later with text-to-speech capabilities.

## Features

- Save articles by URL with automatic content extraction
- Clean reading view with article content
- Mark articles as read/unread
- Delete saved articles
- Text-to-speech functionality (using Web Speech API)
- Mobile-friendly PWA design
- Offline support with service worker

## Tech Stack

- **Backend**: Node.js, Express, SQLite3
- **Frontend**: React, Vite
- **Article Extraction**: Mozilla Readability, Cheerio, JSDOM
- **PWA**: Service Worker, Web App Manifest

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
cd lumpy-pocket
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. Paste an article URL in the input field at the top
2. Click "Save" to extract and save the article
3. Click on any article to read it
4. Use the speaker icon to listen to the article
5. Mark articles as read/unread with the book icon
6. Delete articles with the trash icon

## API Endpoints

- `POST /api/articles` - Save a new article
- `GET /api/articles` - Get all saved articles
- `GET /api/articles/:id` - Get a specific article
- `PATCH /api/articles/:id/read` - Update read status
- `DELETE /api/articles/:id` - Delete an article

## Future Enhancements

- User authentication
- Highlighting and annotations
- Better audio podcast generation with AI voices
- Tags and categories
- Search functionality
- Export options (PDF, EPUB)
- Browser extension