<img src="./web/public/Logo.svg" alt="Brevly Logo" width="192" height="48">

Brevly is a modern URL shortening service built with a React frontend and a Node.js backend. It allows users to create, manage, and track shortened URLs with a clean and responsive interface.

<img src="./web/public/screenshot.png" alt="Brevly Logo">

## Project Structure

The project is organized into two main directories:

- `web/` - Frontend React application
- `server/` - Backend Node.js API

## Features

- Create custom shortened URLs
- View all created links with visit statistics
- Delete links
- Export links to CSV report
- Redirect from shortened URLs to original destinations
- Responsive design for mobile and desktop

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- React Query
- Axios
- React Hook Form
- Zod (for validation)
- Tailwind CSS
- Phosphor Icons

### Backend
- Node.js
- TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL
- Zod (for validation)
- Cloudflare R2 (for storage)
- Swagger/OpenAPI (for API documentation)

## Getting Started

### Prerequisites
- Node.js (v20+)
- pnpm
- PostgreSQL

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/brevly.git
cd brevly
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
pnpm install

# Install web dependencies
cd ../web
pnpm install
```

3. Configure environment variables:

**Server (.env file in server/ directory):**
```
# Server
PORT=3333
CORS_ORIGINS=http://localhost:5173

# Database
DATABASE_URL=postgresql://docker:docker@localhost:5432/brevly

# Environment
NODE_ENV=development

# Cloudflare
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_ACCESS_KEY_ID=your_access_key
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_key
CLOUDFLARE_BUCKET_NAME=your_bucket_name
CLOUDFLARE_BUCKET_URL=your_bucket_url
```

**Web (.env file in web/ directory):**
```
VITE_APP_URL=http://localhost:5173
VITE_API_URL=http://localhost:3333
```

4. Start the database (using Docker):
```bash
cd server
docker-compose up -d
```

5. Run migrations:
```bash
cd server
pnpm db:migrate
```

6. Start the development servers:

**Server:**
```bash
cd server
pnpm dev
```

**Web:**
```bash
cd web
pnpm dev
```

7. Access the application:
   - Frontend: http://localhost:5173
   - API: http://localhost:3333
   - API Documentation: http://localhost:3333/docs

## API Endpoints

- `POST /links` - Create a new shortened URL
- `GET /links` - Get all links
- `DELETE /links/:slug` - Delete a link
- `GET /links/export` - Export links to CSV
- `GET /:slug` - Redirect to original URL

## Deployment

### Docker

The server includes a Dockerfile for containerized deployment:

```bash
cd server
docker build -t brevly-server .
docker run -p 3333:3333 --env-file .env brevly-server
```

## Testing

```bash
cd server
pnpm test
```

## License

This project is licensed under the MIT License.