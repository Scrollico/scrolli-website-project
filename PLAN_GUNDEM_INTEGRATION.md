# Plan: Integrating Gündem Articles from CSV

## Overview

Replace mock content with real Gündem articles from the exported Webflow CSV file. The CSV contains static articles with titles, images, content (HTML), dates, categories, and authors.

## CSV Structure Analysis

### Key Fields Mapping:

- **Başlık** → `title`
- **Slug** → `id`
- **Kapak** → `image` (fallback)
- **Desktop image** → `image` (primary)
- **Mobile Image** → (for responsive images, future enhancement)
- **Özet** → `excerpt`
- **İçerik** → `content` (HTML - needs to be added to Article interface)
- **Tarih** → `date` (needs formatting)
- **Kategoriler** → `category` (use first if comma-separated)
- **Yazar** → `author`
- **SEO Başlık** → (for metadata)
- **SEO Açıklama** → (for metadata)

### Missing Fields (need calculation/defaults):

- **readTime** → Calculate from content length (~200 words/min) or default "5 min read"
- **isPremium** → Default to `false` (can be added later if needed)

## Implementation Steps

### Phase 1: Data Structure & Types

1. **Extend Article Interface** (`types/content.ts`)

   - Add `content?: string` field for HTML content
   - Add `seoTitle?: string` and `seoDescription?: string` for SEO metadata
   - Keep backward compatibility with existing mock data

2. **Create CSV Parser Utility** (`lib/csv-parser.ts`)
   - Read CSV file from `/public/assets/articles/Scrolli - Gündem (1).csv`
   - Parse CSV rows (handle escaped quotes, commas in fields)
   - Map CSV fields to Article interface
   - Handle date formatting (convert to "DD MMM" format like "29 Ocak, 2024")
   - Calculate readTime from content length
   - Parse categories (handle comma-separated values)

### Phase 2: Data Transformation

3. **Create Article Converter** (`lib/article-converter.ts`)

   - Convert CSV row to Article object
   - Image selection logic: Desktop image → Kapak → fallback
   - Content sanitization (if needed) or use as-is
   - Date parsing and formatting
   - Category extraction (first category or comma-separated)

4. **Create Content Loader** (`lib/gundem-content.ts`)
   - Load and cache CSV data
   - Provide functions: `getAllGundemArticles()`, `getGundemArticleById(slug)`
   - Filter by category, date, etc. (for future use)

### Phase 3: Integration

5. **Update lib/content.ts**

   - Integrate Gündem articles into `findArticleById()`
   - Search Gündem articles when mock data lookup fails
   - Or replace mock data entirely with Gündem articles

6. **Select Featured Articles**
   - Choose articles for homepage sections:
     - Featured main article: Most recent or manually selected
     - Featured side articles: Next 2-3 recent articles
     - Trending: Popular/recent articles
     - Featured slider: 4-6 articles
     - Today highlights: Recent articles
     - Most recent: Latest articles
   - Update `data/blog.json` or create new data source

### Phase 4: UI Updates

7. **Update Section1 Component** (`components/sections/single/Section1.tsx`)

   - Replace hardcoded content (lines 175-227) with `article.content`
   - Use `dangerouslySetInnerHTML` to render HTML content
   - Add proper styling for HTML content (images, headings, blockquotes, etc.)
   - Ensure responsive images work correctly

8. **Update Article Type Usage**
   - Ensure all components handle optional `content` field
   - Update TypeScript types where needed

### Phase 5: Testing & Refinement

9. **Test Article Detail Pages**

   - Verify all articles load correctly
   - Check image rendering
   - Verify HTML content renders properly
   - Test SEO metadata
   - Check responsive design

10. **Content Validation**
    - Verify all required fields are present
    - Handle missing images gracefully
    - Handle missing content gracefully
    - Validate date formats

## Technical Decisions

### Default Values:

- **readTime**: Calculate from content (~200 words per minute reading speed)
- **isPremium**: Default to `false` (can be updated later)
- **image**: Use Desktop image, fallback to Kapak, then placeholder
- **category**: Use first category if comma-separated

### Content Rendering:

- Use `dangerouslySetInnerHTML` for HTML content (from Webflow, should be safe)
- Add CSS classes for proper styling of HTML elements
- Ensure images in content are responsive

### Date Formatting:

- Parse CSV date format: "29 Ocak, 2024" or ISO format
- Convert to consistent format: "29 Ocak, 2024" (Turkish format)

### Image Handling:

- Use Desktop image as primary
- Fallback to Kapak if Desktop image missing
- Use Next.js Image component for optimization

## File Structure

```
lib/
  csv-parser.ts          # CSV parsing utility
  article-converter.ts   # CSV row to Article conversion
  gundem-content.ts      # Gündem articles loader
  content.ts             # Updated to include Gündem articles

types/
  content.ts             # Extended Article interface

components/
  sections/
    single/
      Section1.tsx       # Updated to render article.content

data/
  blog.json              # Updated with selected Gündem articles
  # OR
  gundem-articles.json   # New file with all Gündem articles
```

## Testing Checklist

- [ ] CSV file loads correctly
- [ ] All articles parse without errors
- [ ] Article detail pages render correctly
- [ ] Images display properly
- [ ] HTML content renders with proper styling
- [ ] SEO metadata works
- [ ] Homepage shows selected featured articles
- [ ] Search functionality works with real articles
- [ ] Related articles work
- [ ] Responsive design works on all devices

## Next Steps (After Gündem)

1. Integrate Hikayeler (script-based content from Instorier)
2. Add content management system
3. Add article editing capabilities
4. Add image optimization pipeline










