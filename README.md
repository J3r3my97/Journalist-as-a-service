# Journalist as a Service

An AI-powered news curation platform where you define custom prompts and receive daily, personalized news articles curated just for you.

## Features

- **Custom Prompts**: Create up to 5 prompts (free tier) to define your news interests
- **AI-Powered Curation**: Daily automated news fetching and AI summarization
- **Medium-Style Feed**: Clean, distraction-free reading experience
- **RSS Integration**: Fetches from quality news sources via RSS feeds
- **Smart Filtering**: AI-powered relevance scoring and deduplication

## Tech Stack

- **Frontend**: Next.js 14 (React, TypeScript)
- **Database**: PostgreSQL via Supabase
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4o-mini for summarization
- **News Sources**: RSS feeds from TechCrunch, Reuters, Bloomberg, NPR, and more
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key

### Setup

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd Journalist-as-a-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project at https://supabase.com
   - Run the SQL migration in `supabase/migrations/20241124_initial_schema.sql`
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Fill in your `.env` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   CRON_SECRET=your_random_secret_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to http://localhost:3000

## Usage

1. **Sign up** for an account
2. **Create prompts** during onboarding or in the Prompts page
3. **Wait for curation** - Your first articles will appear after the daily curation runs
4. **Read your feed** - View curated articles in a Medium-style interface

## Manual Curation Trigger (for testing)

```bash
curl -X POST http://localhost:3000/api/curation?secret=your_cron_secret
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The cron job (`vercel.json`) will automatically run daily at 6 AM UTC.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── feed/              # Main feed page
│   ├── prompts/           # Prompt management
│   ├── settings/          # User settings
│   └── onboarding/        # Onboarding flow
├── components/            # React components
├── lib/                   # Utilities and services
│   ├── services/          # News fetcher, AI summarizer
│   ├── supabase/          # Supabase client utilities
│   └── types/             # TypeScript types
└── supabase/             # Database migrations
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

See LICENSE file for details.
