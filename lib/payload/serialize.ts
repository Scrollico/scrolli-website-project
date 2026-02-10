/**
 * Serialize Payload RichText field to HTML string
 * Supports both Lexical editor format and Slate.js format
 */
export function serializeRichText(richText: any, articleTitle?: string): string {
  if (!richText) return "";

  // If already HTML string, return as-is
  if (typeof richText === "string") {
    return richText;
  }

  // If Lexical editor format (has root.children structure)
  if (richText.root && Array.isArray(richText.root.children)) {
    return serializeLexicalToHTML(richText.root.children, articleTitle);
  }

  // If RichText (Slate.js format), serialize to HTML
  if (Array.isArray(richText)) {
    return serializeSlateToHTML(richText);
  }

  return "";
}

/**
 * Convert Lexical editor JSON to HTML
 * Handles Lexical editor format with root.children structure
 */
function serializeLexicalToHTML(nodes: any[], articleTitle?: string): string {
  if (!Array.isArray(nodes)) return "";

  return nodes
    .map((node) => {
      // Handle upload/image nodes (standalone)
      if (node.type === "upload" && node.value) {
        const url = node.value.url || "";
        const alt = node.value.alt || articleTitle || "";
        // Wrap in figure for proper semantic HTML and styling
        return `<figure class="article-content-image my-6">
          <img src="${url}" alt="${alt}" class="w-full h-auto rounded-lg" loading="lazy" />
          ${alt ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">${alt}</figcaption>` : ''}
        </figure>`;
      }

      // Handle paragraph nodes
      if (node.type === "paragraph") {
        const text = serializeLexicalChildren(node.children || []);
        // Only wrap in <p> if there's actual content
        return text.trim() ? `<p class="mb-4 leading-relaxed">${text}</p>` : "";
      }

      // Handle heading nodes
      if (node.type === "heading") {
        const level = node.tag?.replace("h", "") || "1";
        const text = serializeLexicalChildren(node.children || []);
        const headingClasses = {
          "1": "text-3xl md:text-4xl font-bold mt-8 mb-4",
          "2": "text-2xl md:text-3xl font-bold mt-6 mb-3",
          "3": "text-xl md:text-2xl font-semibold mt-5 mb-3",
          "4": "text-lg md:text-xl font-semibold mt-4 mb-2",
        };
        const classes = headingClasses[level as keyof typeof headingClasses] || headingClasses["2"];
        return `<h${level} class="${classes}">${text}</h${level}>`;
      }

      // Handle quote nodes
      if (node.type === "quote") {
        const text = serializeLexicalChildren(node.children || []);
        return `<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300">${text}</blockquote>`;
      }

      // Handle list nodes
      if (node.type === "list") {
        const listType = node.listType === "number" ? "ol" : "ul";
        const items = (node.children || [])
          .map((item: any) => {
            const text = serializeLexicalChildren(item.children || []);
            return `<li>${text}</li>`;
          })
          .join("");
        return `<${listType}>${items}</${listType}>`;
      }

      // Handle link nodes
      if (node.type === "link") {
        const url = node.url || "";
        const text = serializeLexicalChildren(node.children || []);
        return `<a href="${url}">${text}</a>`;
      }

      // Recursively handle children
      if (node.children && Array.isArray(node.children)) {
        return serializeLexicalToHTML(node.children);
      }

      return "";
    })
    .join("");
}

/**
 * Serialize Lexical children nodes (text formatting and inline elements)
 */
function serializeLexicalChildren(children: any[]): string {
  if (!Array.isArray(children)) return "";

  return children
    .map((child) => {
      // Handle text nodes
      if (child.type === "text") {
        let text = child.text || "";
        
        // Apply formatting (bitwise flags)
        // Format is a number representing bit flags for text formatting
        if (child.format && typeof child.format === "number") {
          const format = child.format;
          if (format & 1) text = `<strong>${text}</strong>`; // bold
          if (format & 2) text = `<em>${text}</em>`; // italic
          if (format & 4) text = `<u>${text}</u>`; // underline
          if (format & 8) text = `<code>${text}</code>`; // code
          if (format & 16) text = `<s>${text}</s>`; // strikethrough
        }
        
        return text;
      }

      // Handle upload/image nodes inside paragraphs
      if (child.type === "upload" && child.value) {
        const url = child.value.url || "";
        const alt = child.value.alt || "";
        return `<img src="${url}" alt="${alt}" class="w-full h-auto rounded-lg my-4" loading="lazy" />`;
      }

      // Handle link nodes
      if (child.type === "link") {
        const url = child.url || "";
        const text = serializeLexicalChildren(child.children || []);
        return `<a href="${url}">${text}</a>`;
      }

      // Handle nested nodes
      if (child.children) {
        return serializeLexicalChildren(child.children);
      }

      return "";
    })
    .join("");
}

/**
 * Convert Slate.js JSON to HTML
 * Handles common blocks: paragraphs, headings, lists, links, etc.
 */
function serializeSlateToHTML(nodes: any[]): string {
  return nodes
    .map((node) => {
      if (node.type === "paragraph") {
        const text = node.children
          ?.map((child: any) => {
            if (child.bold) return `<strong>${child.text}</strong>`;
            if (child.italic) return `<em>${child.text}</em>`;
            if (child.underline) return `<u>${child.text}</u>`;
            return child.text || "";
          })
          .join("");
        return `<p>${text}</p>`;
      }

      if (node.type === "heading") {
        const level = node.level || 1;
        const text = node.children?.map((c: any) => c.text || "").join("");
        return `<h${level}>${text}</h${level}>`;
      }

      if (node.type === "list") {
        const items = node.children
          ?.map((item: any) => {
            const text = item.children?.map((c: any) => c.text || "").join("");
            return `<li>${text}</li>`;
          })
          .join("");
        const tag = node.listType === "number" ? "ol" : "ul";
        return `<${tag}>${items}</${tag}>`;
      }

      if (node.type === "link") {
        const text = node.children?.map((c: any) => c.text || "").join("");
        return `<a href="${node.url}">${text}</a>`;
      }

      // Default: just extract text
      if (node.children) {
        return serializeSlateToHTML(node.children);
      }

      return node.text || "";
    })
    .join("");
}
