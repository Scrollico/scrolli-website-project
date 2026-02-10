#!/usr/bin/env ts-node
/**
 * Scrolli Design System Audit Script
 * 
 * This script scans all .tsx files in the project and reports violations of the
 * Scrolli Design System guidelines.
 * 
 * Usage: npx ts-node scripts/audit-design-compliance.ts [--fix] [--path=<path>]
 */

import * as fs from 'fs';
import * as path from 'path';

// ============================================================================
// CONFIGURATION
// ============================================================================

const PATTERNS = {
  // Hardcoded spacing (should use sectionPadding, containerPadding, gap tokens)
  hardcodedSpacing: {
    pattern: /className="[^"]*(?:py-\d+|px-\d+|gap-\d+|p-\d+|m-\d+|mt-\d+|mb-\d+|ml-\d+|mr-\d+)(?![^"]*(?:sectionPadding|containerPadding|componentPadding|gap\.|margin))[^"]*"/g,
    message: '❌ Hardcoded spacing detected. Use sectionPadding, containerPadding, componentPadding, or gap tokens.',
    severity: 'error',
  },
  
  // Hardcoded colors for backgrounds (should use colors.background.*)
  hardcodedBgColors: {
    pattern: /className="[^"]*(?:bg-white|bg-black|bg-gray-\d{2,3})(?!\s+dark:)[^"]*"/g,
    message: '❌ Hardcoded background color without dark mode. Use colors.background.* tokens.',
    severity: 'error',
  },

  // Hardcoded text colors (should use Typography components or colors.foreground.*)
  hardcodedTextColors: {
    pattern: /className="[^"]*(?:text-black|text-white|text-gray-\d{2,3})(?!\s+dark:)[^"]*"/g,
    message: '❌ Hardcoded text color without dark mode. Use Typography components or colors.foreground.* tokens.',
    severity: 'error',
  },

  // Hardcoded border radius (should use borderRadius tokens)
  hardcodedBorderRadius: {
    pattern: /className="[^"]*(?:rounded-sm|rounded-md|rounded-lg|rounded-xl|rounded-2xl|rounded-3xl|rounded-full)(?![^"]*borderRadius)[^"]*"/g,
    message: '⚠️ Hardcoded border radius. Consider using borderRadius tokens for consistency.',
    severity: 'warning',
  },

  // Hardcoded shadows (should use elevation tokens)
  hardcodedShadows: {
    pattern: /className="[^"]*(?:shadow-sm|shadow-md|shadow-lg|shadow-xl|shadow-2xl)(?![^"]*elevation)[^"]*"/g,
    message: '⚠️ Hardcoded shadow. Consider using elevation tokens for consistency.',
    severity: 'warning',
  },

  // Raw h1-h6 elements instead of Heading component
  rawHeadingElements: {
    pattern: /<h[1-6][^>]*className/g,
    message: '⚠️ Raw heading element detected. Consider using <Heading> component for automatic dark mode support.',
    severity: 'warning',
  },

  // Raw p/span with text styling instead of Text component
  missingTextComponent: {
    pattern: /<(?:p|span)[^>]*className="[^"]*text-(?:xs|sm|base|lg|xl|2xl)[^"]*"/g,
    message: '⚠️ Raw text element with sizing. Consider using <Text> component for automatic dark mode support.',
    severity: 'warning',
  },
};

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'dist',
  '.git',
  'public',
  'scripts',
  '*.config.*',
];

// ============================================================================
// TYPES
// ============================================================================

interface Violation {
  file: string;
  line: number;
  column: number;
  pattern: string;
  message: string;
  severity: 'error' | 'warning';
  match: string;
}

interface AuditResult {
  totalFiles: number;
  filesWithViolations: number;
  violations: Violation[];
  errorCount: number;
  warningCount: number;
}

// ============================================================================
// UTILITIES
// ============================================================================

function shouldExclude(filePath: string): boolean {
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      return regex.test(filePath);
    }
    return filePath.includes(pattern);
  });
}

function findTsxFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (shouldExclude(fullPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      files.push(...findTsxFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getLineAndColumn(content: string, index: number): { line: number; column: number } {
  const lines = content.substring(0, index).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1,
  };
}

function auditFile(filePath: string): Violation[] {
  const violations: Violation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  for (const [patternName, config] of Object.entries(PATTERNS)) {
    const regex = new RegExp(config.pattern.source, config.pattern.flags);
    let match;

    while ((match = regex.exec(content)) !== null) {
      const { line, column } = getLineAndColumn(content, match.index);
      
      violations.push({
        file: filePath,
        line,
        column,
        pattern: patternName,
        message: config.message,
        severity: config.severity as 'error' | 'warning',
        match: match[0].substring(0, 80) + (match[0].length > 80 ? '...' : ''),
      });
    }
  }

  return violations;
}

// ============================================================================
// MAIN
// ============================================================================

function main(): void {
  const args = process.argv.slice(2);
  const targetPath = args.find(arg => arg.startsWith('--path='))?.split('=')[1] || process.cwd();
  
  console.log('\n🎨 Scrolli Design System Audit\n');
  console.log(`📁 Scanning: ${targetPath}\n`);

  const files = findTsxFiles(targetPath);
  const result: AuditResult = {
    totalFiles: files.length,
    filesWithViolations: 0,
    violations: [],
    errorCount: 0,
    warningCount: 0,
  };

  for (const file of files) {
    const fileViolations = auditFile(file);
    if (fileViolations.length > 0) {
      result.filesWithViolations++;
      result.violations.push(...fileViolations);
    }
  }

  // Count errors and warnings
  result.errorCount = result.violations.filter(v => v.severity === 'error').length;
  result.warningCount = result.violations.filter(v => v.severity === 'warning').length;

  // Group violations by file
  const violationsByFile = result.violations.reduce((acc, v) => {
    if (!acc[v.file]) acc[v.file] = [];
    acc[v.file].push(v);
    return acc;
  }, {} as Record<string, Violation[]>);

  // Output results
  for (const [file, violations] of Object.entries(violationsByFile)) {
    const relativePath = path.relative(process.cwd(), file);
    console.log(`\n📄 ${relativePath}`);
    
    for (const v of violations) {
      const icon = v.severity === 'error' ? '🔴' : '🟡';
      console.log(`  ${icon} Line ${v.line}: ${v.message}`);
      console.log(`     ${v.match}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 AUDIT SUMMARY');
  console.log('='.repeat(60));
  console.log(`   Total files scanned: ${result.totalFiles}`);
  console.log(`   Files with violations: ${result.filesWithViolations}`);
  console.log(`   🔴 Errors: ${result.errorCount}`);
  console.log(`   🟡 Warnings: ${result.warningCount}`);
  console.log('='.repeat(60) + '\n');

  if (result.errorCount > 0) {
    console.log('💡 TIP: Import design tokens from @/lib/design-tokens');
    console.log('💡 TIP: Use Typography components from @/components/ui/typography\n');
    process.exit(1);
  }

  if (result.violations.length === 0) {
    console.log('✅ All files comply with the Scrolli Design System!\n');
  }
}

main();
