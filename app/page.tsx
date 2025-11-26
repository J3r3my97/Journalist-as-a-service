export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Journalist as a Service
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Your personal newsroom powered by AI. Define custom prompts and receive daily,
          personalized news articles curated just for you.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/auth/signup"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </a>
          <a
            href="/auth/login"
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
}
