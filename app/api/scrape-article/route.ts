// /app/api/scrape-article/route.ts (App Router)
import { NextRequest, NextResponse } from 'next/server';
import { extract } from '@extractus/article-extractor';
import * as cheerio from 'cheerio';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    const article = await extract(url);

    if (!article?.content) {
      return NextResponse.json({ error: 'No article content found' }, { status: 500 });
    }

    const $ = cheerio.load(article.content);

    // Remove unwanted elements and links
    $('a').each((_, el) => {
      const text = $(el).text().toLowerCase();
      if (
        text.includes('sign up') ||
        text.includes('opens new tab') ||
        text.includes('licensereuterscontent') ||
        text.includes('trust principles')
      ) {
        $(el).remove();
      }
    });

    // Remove empty tags
    $('span, div, p').each((_, el) => {
      if (!$(el).text().trim()) {
        $(el).remove();
      }
    });

    // Remove scripts and styles
    $('script, style').remove();

    // Strip to clean text only
    const cleanedText = $.text().replace(/\s+/g, ' ').trim();

    return NextResponse.json({
      title: article.title?.trim() || '',
      content: cleanedText,
      image: article.image || null,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Scraping failed', details: (err as Error).message },
      { status: 500 }
    );
  }
}
