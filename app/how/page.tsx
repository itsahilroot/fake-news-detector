import React from 'react';

export default function HowItWorksPage() {
  return (
    <main className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">🛠️ How It Works</h1>

      <section className="space-y-6 text-lg text-gray-800">
        <p>
          Our tool extracts clean, readable content from any news article using a smart 3-step process:
        </p>

        <section>
          <h2 className="text-xl font-semibold mb-2">1. You Paste a News URL</h2>
          <p>
            Simply paste the link to a news article from trusted sources like Reuters, BBC, CNN, etc. into our input field.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">2. We Fetch & Parse the Content</h2>
          <p>
            Behind the scenes, our system fetches the full HTML of the page and uses intelligent parsing to extract:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>The main <strong>title</strong></li>
            <li>The core <strong>article content</strong></li>
            <li>The primary <strong>image</strong> (if available)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Clean Output</h2>
          <p>You get a distraction-free result showing:</p>
          <ul className="list-disc list-inside mt-2">
            <li>🖼️ <strong>Image</strong> at the top</li>
            <li>📰 <strong>Title</strong> of the article</li>
            <li>📄 <strong>Readable content</strong> with tags removed</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Perfect for SEO, Analysis, or Repurposing</h2>
          <p>The cleaned content is ideal for:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Reading without distractions</li>
            <li>Fact-checking or AI analysis</li>
            <li>Summarizing or reusing content</li>
          </ul>
        </section>
      </section>
    </main>
  );
}
