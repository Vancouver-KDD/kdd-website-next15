'use server'

import * as cheerio from 'cheerio'

export async function scrapeLumaEvent(url: string) {
  if (!url) return null

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    })

    if (!response.ok) {
      console.error('Failed to fetch Luma page', response.status)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Strategy 1: Look for specific stats container
    // Structure often looks like: <div class="...">1,234</div> ... Going
    // deeper investigation might be needed for exact class names as they might be dynamic.
    // However, Luma often puts structured data in script tags or meta tags.

    // Check for JSON-LD which is more reliable
    const jsonLd = $('script[type="application/ld+json"]').html()
    if (jsonLd) {
      try {
        const data = JSON.parse(jsonLd)
        // Check for Event type
        if (data['@type'] === 'Event' || data['@type'] === 'SocialEvent') {
          // AggregateOffer might have attendee count, or check "attendee" array if public
          // Luma sometimes exposes it loosely.
        }
      } catch (e) {
        console.error('Error parsing JSON-LD', e)
      }
    }

    // Fallback: Text search for "Going" or "Registered"
    // This is a naive heuristic but often works for simple scraping
    const text = $('body').text()
    const goingMatch = text.match(/(\d+)\s*Going/) || text.match(/(\d+)\s*Registered/)

    if (goingMatch) {
      return parseInt(goingMatch[1], 10)
    }

    // Direct selector attempts (these are guesses based on common patterns, Luma uses utility classes)
    // Sometimes it's better to look for a specific icon or label

    return null
  } catch (error) {
    console.error('Error scraping Luma event:', error)
    return null
  }
}
