import React from 'react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About Fact Checker Tool</h1>

      <p className="text-lg text-gray-700 mb-4">
        The Fact Checker Tool is an AI-powered platform designed to help you identify and verify fake news and misinformation across the internet.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">🔍 What It Does</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Analyzes article content and compares it with verified databases using Google’s Fact Check Tools API.</li>
        <li>Scores news content for factual accuracy and bias using advanced language models.</li>
        <li>Extracts key claims and provides real-time evidence links from trusted sources.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">🤖 Powered By</h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>Google Vertex AI for intelligent claim verification.</li>
        <li>Claude AI for natural language interpretation.</li>
        <li>Google Fact Check Tools API for citation retrieval.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">🔐 Our Mission</h2>
      <p className="text-gray-700">
        We aim to empower readers to think critically and make informed decisions by promoting transparency, trust, and accountability in online information.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-3">📬 Contact Us</h2>
      <p className="text-gray-700">
        Have questions or feedback? Reach out at{' '}
        <a href="mailto:team@factcheckertool.com" className="text-blue-600 underline">
          team@factcheckertool.com
        </a>
        .
      </p>
    </div>
  )
}
