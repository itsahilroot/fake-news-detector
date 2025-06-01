import './globals.css';
import LoadingBar from '@/components/loading-bar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { MoveUpRight } from 'lucide-react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fake News Detector | AI-Powered News Analysis',
  description: 'Analyze news articles for credibility and detect potential fake news using AI technology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoadingBar />
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto px-4 py-6 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MoveUpRight className="h-6 w-6 text-primary" />
                <Link href="/"><h1 className="text-xl font-semibold tracking-tight">Fake News Detector</h1></Link>
              </div>
              <nav>
                <ul className="flex gap-6">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/how" className="text-muted-foreground hover:text-foreground">
                      How it Works
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8 md:py-12">
            {children}
          </main>
          <footer className="border-t py-6 bg-muted/30">
            <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
              <p>© 2025 Fake News Detector. Powered by Google Vertex AI and Fact Check Tools API.</p>
              <p className="mt-2">
                This tool uses AI technology to analyze news articles for potential credibility issues. 
                Results are provided for informational purposes only.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}