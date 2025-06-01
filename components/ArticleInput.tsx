'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';

interface ArticleInputProps {
  onAnalyze: (articleText: string) => Promise<void>;
  isAnalyzing: boolean;
}

export default function ArticleInput({ onAnalyze, isAnalyzing }: ArticleInputProps) {
  const [articleText, setArticleText] = useState('');
  const [articleUrl, setArticleUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'paste' | 'url'>('paste');
  const [isScraping, setIsScraping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<{ title?: string; image?: string } | null>(null);

  const isValidUrl = (url: string) => /^https?:\/\/.+\..+/.test(url);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPreview(null);

    if (activeTab === 'paste' && articleText.trim()) {
      onAnalyze(articleText);
    } else if (activeTab === 'url' && articleUrl.trim()) {
      if (!isValidUrl(articleUrl)) {
        setError('Please enter a valid URL (starting with http or https)');
        return;
      }

      try {
        setIsScraping(true);
        const res = await fetch(`/api/scrape-article?url=${encodeURIComponent(articleUrl)}`);
        if (!res.ok) throw new Error('Failed to scrape article');
        const data = await res.json();

        if (data?.content) {
          setArticleText(data.content);
          setActiveTab('paste');
          onAnalyze(data.content);

          // Set preview if available
          setPreview({ title: data.title, image: data.image });
        } else {
          throw new Error('No content extracted from the URL');
        }
      } catch (err: any) {
        setError(err.message || 'Scraping failed');
      } finally {
        setIsScraping(false);
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Fake News Detector</CardTitle>
        <CardDescription>
          Paste an article or enter a URL to analyze its credibility and detect potential fake news.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Tabs defaultValue="paste" value={activeTab} onValueChange={(val) => setActiveTab(val as 'paste' | 'url')}>
            <TabsList className="mb-4">
              <TabsTrigger value="paste">Paste Article</TabsTrigger>
              <TabsTrigger value="url">Article URL</TabsTrigger>
            </TabsList>
            <TabsContent value="paste">
              <Textarea
                placeholder="Paste the full article text here..."
                className="min-h-[200px] resize-y"
                value={articleText}
                onChange={(e) => setArticleText(e.target.value)}
                disabled={isAnalyzing}
              />
            </TabsContent>
            <TabsContent value="url">
              <Input
                type="url"
                placeholder="https://example.com/news/article"
                value={articleUrl}
                onChange={(e) => setArticleUrl(e.target.value)}
                disabled={isAnalyzing || isScraping}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <p className="text-muted-foreground text-sm mt-2">
                The article content will be extracted automatically from the URL.
              </p>
            </TabsContent>
          </Tabs>

          {preview && (
            <div className="mt-4 p-4 border rounded-md bg-muted">
              {preview.image && (
                <img src={preview.image} alt="Article" className="w-full max-h-60 object-cover rounded mb-3" />
              )}
              {preview.title && <h3 className="text-lg font-semibold">{preview.title}</h3>}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="submit"
            disabled={
              isAnalyzing ||
              isScraping ||
              (activeTab === 'paste' && !articleText.trim()) ||
              (activeTab === 'url' && !articleUrl.trim())
            }
          >
            {(isAnalyzing || isScraping) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isScraping ? 'Scraping...' : 'Analyzing...'}
              </>
            ) : (
              'Analyze Article'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
