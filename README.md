# Markdown Note-taking App

A simple and efficient Markdown note-taking app with a RESTful API, allowing users to create, store, and render notes in HTML format. The app supports file uploads and grammar checking using an external API, making it ideal for managing and processing notes written in Markdown.

## Features

- **Create Notes**: Store your Markdown notes with title and content.
- **Render Notes**: Convert Markdown content into HTML format.
- **Grammar Check**: Check grammar of the note content using an external API.
- **File Upload**: Upload files (including text and markdown files) and process their content.
- **File Storage**: Files are stored securely with unique filenames to prevent name collisions.

## Technologies Used

- **Express.js**: Web framework for building the RESTful API.
- **Prisma**: ORM for PostgreSQL database interactions.
- **Multer**: Middleware for handling file uploads.
- **Marked.js**: Library to convert Markdown to HTML.
- **Sapling API**: API used for grammar checking (through `sapling-js` client).
- **PostgreSQL**: Relational database for storing notes.

## Installation

To get started with the project, follow these steps:

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/yourusername/markdown-notes-app.git
    cd markdown-notes-app
    ```

2. Install the required dependencies:

    ```bash
    npm install
    ```

3. Set up your environment variables by creating a `.env` file:

    ```bash
    touch .env
    ```

    Add the following variables to your `.env` file:

    ```bash
    DATABASE_URL=your_postgresql_database_url
    API_KEY=your_sapling_api_key
    ```

4. Run Prisma migration to set up your database:

    ```bash
    npx prisma migrate dev
    ```

5. Start the application:

    ```bash
    npm start
    ```

    The server will run on `http://localhost:3000`.

## API Endpoints

### 1. **Create a Note**

- **URL**: `/api/notes`
- **Method**: `POST`
- **Body**:

    ```json
    {
      "title": "Note Title",
      "content": "Note content in Markdown format"
    }
    ```

- **Response**:

    ```json
    {
      "id": 1,
      "title": "Note Title",
      "content": "Note content in Markdown format",
      "createdAt": "2024-12-01T12:00:00Z"
    }
    ```

### 2. **Render a Note (Convert Markdown to HTML)**

- **URL**: `/api/notes/render`
- **Method**: `POST`
- **Body**:

    ```json
    {
      "title": "Note Title",
      "content": "Note content in Markdown format"
    }
    ```

- **Response**:

    ```json
    {
      "title": "<h1>Note Title</h1>",
      "content": "<p>Note content in HTML format</p>"
    }
    ```

### 3. **Check Grammar**

- **URL**: `/api/notes/check-grammar`
- **Method**: `POST`
- **Body**:

    ```json
    {
      "content": "Some text to check for grammar."
    }
    ```

- **Response**:

    ```json
    {
      "description": "Description of the grammar mistake",
      "sentence": "The original sentence",
      "replacement": "The correct sentence"
    }
    ```

### 4. **Upload a File**

- **URL**: `/api/notes/upload`
- **Method**: `POST`
- **Body**: Form-data with file, title, and content:

    ```json
    {
      "title": "Note Title",
      "content": "Note content",
      "file": "file-to-upload"
    }
    ```

- **Response**:

    ```json
    {
      "message": "Note with file created successfully",
      "note": {
        "id": 1,
        "title": "Note Title",
        "content": "Note content",
        "fileUrl": "/uploads/file-name",
        "createdAt": "2024-12-01T12:00:00Z"
      }
    }
    ```

### 5. **Get All Notes**

- **URL**: `/api/notes`
- **Method**: `GET`
- **Response**:

    ```json
    [
      {
        "id": 1,
        "title": "Note Title",
        "content": "Note content",
        "createdAt": "2024-12-01T12:00:00Z"
      },
      {
        "id": 2,
        "title": "Another Note",
        "content": "Another note content",
        "createdAt": "2024-12-01T14:00:00Z"
      }
    ]
    ```

## File Uploads

All files are uploaded to the `uploads` directory, and the app supports the following file types:

- JPEG images
- PNG images
- PDF files
- Markdown (.md) files
- Plain text (.txt) files

## Database Schema

The project uses Prisma with a PostgreSQL database. Here's the `Note` model:

```prisma
model Note {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  fileUrl   String?
  createdAt DateTime @default(now())
}
