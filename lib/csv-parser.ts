/**
 * CSV Parser Utility
 * 
 * Parses CSV files exported from Webflow, handling:
 * - Escaped quotes and commas in fields
 * - Multi-line content fields
 * - Turkish characters and encoding
 */

import fs from 'fs';
import path from 'path';

export interface CSVRow {
  [key: string]: string;
}

/**
 * Parse CSV file and return array of row objects
 * Handles complex CSV with quoted fields, escaped quotes, and multi-line content
 */
export function parseCSV(filePath: string): CSVRow[] {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, 'utf-8');
    
    if (!fileContent || fileContent.trim().length === 0) {
      return [];
    }

    // Parse header row first
    let headerEnd = 0;
    let inQuotes = false;
    for (let i = 0; i < fileContent.length; i++) {
      const char = fileContent[i];
      const nextChar = fileContent[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          i++; // Skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === '\n' && !inQuotes) {
        headerEnd = i;
        break;
      }
    }
    
    const headerLine = fileContent.substring(0, headerEnd);
    const headers = parseCSVLine(headerLine);
    
    if (headers.length === 0) {
      return [];
    }
    
    // Parse data rows
    const rows: CSVRow[] = [];
    let currentRow: string[] = [];
    let currentField = '';
    inQuotes = false;
    let i = headerEnd + 1; // Start after header line
    
    while (i < fileContent.length) {
      const char = fileContent[i];
      const nextChar = fileContent[i + 1];
      const prevChar = fileContent[i - 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          currentField += '"';
          i += 2;
          continue;
        } else {
          // Toggle quotes
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\n' && !inQuotes) {
        // End of row
        currentRow.push(currentField);
        
        // Only process if we have the right number of fields
        if (currentRow.length === headers.length) {
          const row: CSVRow = {};
          headers.forEach((header, index) => {
            row[header] = currentRow[index] || '';
          });
          rows.push(row);
        }
        
        // Reset for next row
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
      
      i++;
    }
    
    // Handle last row if file doesn't end with newline
    if (currentField || currentRow.length > 0) {
      currentRow.push(currentField);
      if (currentRow.length === headers.length) {
        const row: CSVRow = {};
        headers.forEach((header, index) => {
          row[header] = currentRow[index] || '';
        });
        rows.push(row);
      }
    }
    
    return rows;
  } catch (error) {
    console.error('Error parsing CSV file:', error);
    return [];
  }
}

/**
 * Parse a single CSV line, handling quoted fields
 */
function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentField += '"';
        i++; // Skip next quote
      } else {
        // Toggle quotes
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      fields.push(currentField.trim());
      currentField = '';
    } else {
      currentField += char;
    }
  }
  
  // Add last field
  fields.push(currentField.trim());
  
  return fields;
}

