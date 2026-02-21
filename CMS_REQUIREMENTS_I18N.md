# CMS Requirements for Internationalization & Dynamic Content

## Overview
This document outlines the necessary changes and additions to the Payload CMS schema to support the website's internationalization (i18n) and dynamic content needs.

**Goal:** To fully manage site-wide settings, navigation, translations, and static pages directly from the CMS, enabling a multi-language experience without hardcoded strings or structures.

---

## 1. Global: Site Settings (`SiteSettings`)

**Current Status:** Exists (`PayloadSiteSettings`) but needs expansion and localization.
**Refactor Required:** Yes, extend existing `SiteSettings` global.

### Why?
To control global SEO, branding, and contact information per language from a single place, avoiding hardcoded values in the codebase (like the site description or social links currently in `lib/constants.ts` or `layout.tsx`).

### Schema Specifications

| Field Name | Type | Localized | Description |
| :--- | :--- | :---: | :--- |
| `siteName` | Text | ✅ | The name of the website (e.g., "Scrolli"). |
| `siteDescription` | Textarea | ✅ | Default meta description for SEO. |
| `keywords` | Text (Array/Tags) | ✅ | Default meta keywords. |
| `socialLinks` | Array | ❌ | List of social media profiles. |
| &nbsp;&nbsp; └ `platform` | Select | ❌ | Options: Twitter, Instagram, LinkedIn, YouTube, etc. |
| &nbsp;&nbsp; └ `url` | Text | ❌ | Full URL to the profile. |
| `logos` | Group | ❌ | Site branding assets. |
| &nbsp;&nbsp; └ `light` | Upload (Media) | ❌ | Logo for light mode. |
| &nbsp;&nbsp; └ `dark` | Upload (Media) | ❌ | Logo for dark mode. |
| `contactInfo` | Group | ✅ | Contact details displayed in footer/contact page. |
| &nbsp;&nbsp; └ `email` | Email | ❌ | Contact email address. |
| &nbsp;&nbsp; └ `address` | Textarea | ✅ | Physical address. |
| &nbsp;&nbsp; └ `phone` | Text | ❌ | Contact phone number. |

---

## 2. Global: Navigation (`Navigation`)

**Current Status:** Exists (`PayloadNavigation`) but `Main Menu` structure is too simple for the current design.
**Refactor Required:** Yes, major refactor of `mainMenu` to support Mega Menus.

### Why?
The current header uses a hardcoded "CardNav" component for rich dropdowns (showing icons and descriptions). We need to reproduce this structure dynamically in the CMS so editors can manage these featured cards without developer intervention.

### Schema Specifications

#### Main Menu (`mainMenu`)
A list of top-level navigation items.

| Field Name | Type | Localized | Description |
| :--- | :--- | :---: | :--- |
| `label` | Text | ✅ | Top-level menu label (e.g., "Gündem"). |
| `type` | Select | ❌ | Options: `link`, `mega-menu`, `dropdown`. |
| `link` | Text | ❌ | URL (required if type is `link`). |
| `megaMenuCards` | Array | ❌ | **New:** Required if type is `mega-menu`. List of "Cards". |
| &nbsp;&nbsp; └ `title` | Text | ✅ | Card title. |
| &nbsp;&nbsp; └ `description` | Textarea | ✅ | Short description for the card. |
| &nbsp;&nbsp; └ `icon` | Upload (Media) | ❌ | Icon/Image for the card. |
| &nbsp;&nbsp; └ `link` | Text | ❌ | URL for the card. |
| `dropdownItems` | Array | ❌ | Required if type is `dropdown`. Simple nested links. |
| &nbsp;&nbsp; └ `label` | Text | ✅ | Sub-item label. |
| &nbsp;&nbsp; └ `link` | Text | ❌ | Sub-item URL. |

#### Footer Menu (`footerMenu`)
Already exists as groups, but ensure labels are localized.

| Field Name | Type | Localized | Description |
| :--- | :--- | :---: | :--- |
| `groupTitle` | Text | ✅ | Column header (e.g., "Categories"). |
| `items` | Array | ❌ | Links within the group. |
| &nbsp;&nbsp; └ `label` | Text | ✅ | Link text. |
| &nbsp;&nbsp; └ `link` | Text | ❌ | URL. |

---

## 3. Global: Translations / UI Strings (`UIStrings`)

**Current Status:** New Global required.
**Refactor Required:** New creation.

### Why?
The frontend contains many static strings (e.g., "Read More", "Sign In", "Related Articles", "Min Read"). These need to be managed in the CMS to support multiple languages (Turkish/English) without hardcoding conditionals in React components.

### Schema Specifications

Ideally, a collection or global with a flexible key-value structure.

| Field Name | Type | Localized | Description |
| :--- | :--- | :---: | :--- |
| `strings` | Array | ❌ | List of UI strings. |
| &nbsp;&nbsp; └ `key` | Text | ❌ | The unique identifier used in code (e.g., `read_more`). |
| &nbsp;&nbsp; └ `value` | Text | ✅ | The actual text to display (e.g., "Devamını Oku"). |

**Example Keys:**
*   `read_more`
*   `sign_in`
*   `min_read`
*   `related_articles`
*   `copyright_text`
*   `search_placeholder`
*   `newsletter_signup_title`

---

## 4. Collection: Pages (`Pages`)

**Current Status:** New Collection required.
**Refactor Required:** New creation.

### Why?
We need a way to create and manage static pages like "Privacy Policy", "Terms of Use", and "About Us" dynamically. Currently, adding a new static page might require a new code route. This collection allows admins to generate new pages on the fly.

### Schema Specifications

| Field Name | Type | Localized | Description |
| :--- | :--- | :---: | :--- |
| `title` | Text | ✅ | Page title (H1). |
| `slug` | Text | ✅ | URL slug (e.g., `privacy-policy`). |
| `content` | RichText | ✅ | Main page content. |
| `seo` | Group | ❌ | SEO specific settings. |
| &nbsp;&nbsp; └ `metaTitle` | Text | ✅ | Overrides default title tag. |
| &nbsp;&nbsp; └ `metaDescription`| Textarea | ✅ | Overrides default meta description. |
| &nbsp;&nbsp; └ `ogImage` | Upload (Media) | ❌ | Open Graph image. |
