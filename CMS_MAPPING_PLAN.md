# CMS Content Mapping & Migration Plan

## 1. Structure Comparison

| Legacy Section (`scrolli.co`) | New Component (`next.scrolli.co`) | Status / Action Required |
| :--- | :--- | :--- |
| **Featured** (`mainArticle` + `sideArticles`) | **HeroSection** (`hero`) | ✅ **Mapped**. The `hero` content is dynamically fetched (pinned or latest featured). |
| **Trending** (`articles[]`) | **Section1** (`editorsPicks`) | ✅ **Mapped**. `editorsPicks` are fetched and displayed here. |
| **Featured Slider** | *Missing* | ⚠️ **Gap**. No direct equivalent in `app/page.tsx`. Content likely merged into `editorsPicks` or `LazySections`. |
| **Today Highlights** | **DailyBriefingSection** | 🔄 **Evolved**. Replaced by a specialized `DailyBriefing` content type. |
| **Most Recent** | **LazySections** / **Section3Wrapper** | ✅ **Mapped**. `verticalList`, `articleList`, and `gundemSection3Articles` cover recent content. |
| **Culture** / **The Startup** | *Generic Lists* | ⚠️ **Gap**. Specific category sections are not hardcoded. Replaced by dynamic category pages or mixed article lists. |
| **Podcast Section** | **PodcastSection** (Component exists) | ❌ **Hidden**. Component exists (`components/sections/home/PodcastSection.tsx` or similar) but is **not rendered** in `app/page.tsx`. |
| **Ad Slots** | *None* | ⚠️ **Gap**. No dedicated ad components are currently rendered in the main flow. |

## 2. Navigation Anomalies ("Gelecek" & "Zest")

These items appear in the navigation because of a **fallback mechanism**:
1.  The app tries to fetch `navigation` from Payload CMS.
2.  If that fails or returns empty, `lib/navigation.ts` extracts categories **directly from `data/blog.json`**.
3.  `data/blog.json` contains articles with categories "gelecek" and "zest".
4.  **Action**:
    -   **If unwanted:** Remove these categories from `data/blog.json` OR ensure Payload `navigation` is populated (which overrides the fallback).
    -   **If wanted:** Create these categories in Payload and add them to the global Navigation menu.

## 3. Data Field Mapping for CMS

To align the CMS with the new frontend structure, use the following mapping:

### **A. General Article Fields**
| Legacy Field (`json`) | New Payload Field (`Gundem` / `Hikayeler`) | Implementation Notes |
| :--- | :--- | :--- |
| `id` (slug) | `slug` | Direct mapping. |
| `title` | `title` | Bilingual support added in new system. |
| `excerpt` | `summary` | Used for SEO and card previews. |
| `content` | `content` | **Critical**: Legacy HTML needs to be converted to **Lexical RichText** or kept as HTML string if supported. |
| `date` | `publishedAt` | Format change: String date -> ISO 8601 Date. |
| `readTime` | `readTime` | Format change: String ("10 min read") -> Number (10). |
| `isPremium` | *Inferred/Missing* | Logic likely moved to `isPremium` flag or paywall logic. |
| `tag` | `tags` (Relationship) | Changed from single string to Array of Tag relationships. |

### **B. Taxonomy & Relationships**
| Legacy Field | New Payload Field | Implementation Notes |
| :--- | :--- | :--- |
| `author` (slug) | `author` (Relationship) | **Action**: Create `Author` collection entries for all legacy authors and link them. |
| `category` (slug) | `category` (Relationship) | **Action**: Map string categories to `Category` collection entries. |

### **C. Media & Visuals**
| Legacy Field | New Payload Field | Implementation Notes |
| :--- | :--- | :--- |
| `image` (URL) | `featuredImage` (Upload/Relationship) | **Action**: Import images to Media collection. |
| `thumbnail` | `thumbnail` | Used for smaller grid items. |

## 4. Recommended Tasks

1.  **Populate Payload Navigation**: Create a main menu in Payload to override the `blog.json` fallback and remove unwanted "Gelecek"/"Zest" links if they are artifacts.
2.  **Enable Podcast Section**: If required, add the Podcast component to `app/page.tsx`.
3.  **Restore Category Sections**: If "Culture" or "The Startup" need dedicated home slots, create `CollectionSection` components for them.
4.  **Bulk Import**: Write a script to migrate `data/blog.json` content into Payload `Gundem`/`Hikayeler` collections to seed the database.
