#!/usr/bin/env node

/**
 * Color Contrast Audit Script
 * 
 * Scans component files for potential contrast issues:
 * - bg-white without dark: variant
 * - text-white on potentially light backgrounds  
 * - Hardcoded color pairs without semantic token usage
 * 
 * Run: node scripts/contrast-audit.js
 * Or:  npm run audit:contrast
 */

const fs = require('fs');
const path = require('path');

// Colors for terminal output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m',
};

// Patterns that often cause contrast issues
const PROBLEMATIC_PATTERNS = [
    // White backgrounds without dark mode
    {
        pattern: /className="[^"]*\bbg-white\b(?![^"]*dark:)/g,
        severity: 'error',
        message: 'bg-white without dark: variant',
        fix: 'Use surfacePairs.card.base or colors.background.base'
    },

    // Gray backgrounds without dark mode (light grays)
    {
        pattern: /className="[^"]*\bbg-gray-[1-3]00\b(?![^"]*dark:)/g,
        severity: 'warning',
        message: 'Light gray bg without dark: variant',
        fix: 'Use surfacePairs.card.elevated or colors.background.elevated'
    },

    // White text that needs dark background verification
    {
        pattern: /text-white(?!\s+dark:)/g,
        severity: 'info',
        message: 'text-white - verify background is dark in both modes',
        fix: 'Ensure parent has dark bg in both light and dark modes, or use textOnImagePairs'
    },

    // Light text on potentially light backgrounds (danger zone)
    {
        pattern: /bg-white[^"]*text-gray-[3-5]00/g,
        severity: 'error',
        message: 'Low contrast: light text on white background',
        fix: 'Use text-gray-700 or darker, or use surfacePairs.card.contrast'
    },

    // Dark text on dark backgrounds
    {
        pattern: /bg-gray-[78]00[^"]*text-gray-[6-9]00/g,
        severity: 'error',
        message: 'Low contrast: dark text on dark background',
        fix: 'Use text-gray-200 or lighter in dark mode'
    },

    // Beige background without proper text color
    {
        pattern: /bg-\[#F8F5E4\](?![^"]*text-gray-[7-9]00)(?![^"]*dark:)/g,
        severity: 'warning',
        message: 'Beige background may need dark text or dark mode variant',
        fix: 'Use surfacePairs.brand.beige for guaranteed contrast'
    },
];

// Allowed patterns (files using semantic tokens properly)
const ALLOWED_PATTERNS = [
    'surfacePairs.',
    'buttonPairs.',
    'pillPairs.',
    'textOnImagePairs.',
    'colors.background',
    'colors.foreground',
    'colors.surface',
];

// File extensions to scan
const EXTENSIONS = ['.tsx', '.jsx'];

// Directories to skip
const SKIP_DIRS = ['node_modules', '.next', '.git', 'dist', 'build'];

/**
 * Recursively find all files with given extensions
 */
function findFiles(dir, extensions) {
    const files = [];

    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!SKIP_DIRS.includes(entry.name)) {
                    files.push(...findFiles(fullPath, extensions));
                }
            } else if (entry.isFile()) {
                if (extensions.some(ext => entry.name.endsWith(ext))) {
                    files.push(fullPath);
                }
            }
        }
    } catch (err) {
        // Skip directories we can't read
    }

    return files;
}

/**
 * Audit a single file for contrast issues
 */
function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const issues = [];

    // Check if file uses semantic tokens (we can be less strict)
    const usesSemanticTokens = ALLOWED_PATTERNS.some(p => content.includes(p));

    for (const { pattern, severity, message, fix } of PROBLEMATIC_PATTERNS) {
        // Reset regex lastIndex
        const regex = new RegExp(pattern.source, pattern.flags);
        let match;

        while ((match = regex.exec(content)) !== null) {
            // Find line number
            const beforeMatch = content.substring(0, match.index);
            const lineNumber = beforeMatch.split('\n').length;
            const line = lines[lineNumber - 1] || '';

            // Skip if line uses semantic tokens
            if (ALLOWED_PATTERNS.some(p => line.includes(p))) {
                continue;
            }

            // Reduce severity if file uses semantic tokens elsewhere
            const adjustedSeverity = usesSemanticTokens && severity === 'warning' ? 'info' : severity;

            issues.push({
                file: filePath,
                line: lineNumber,
                severity: adjustedSeverity,
                message,
                fix,
                snippet: line.trim().substring(0, 100),
            });
        }
    }

    return issues;
}

/**
 * Get severity icon
 */
function getSeverityIcon(severity) {
    switch (severity) {
        case 'error': return `${colors.red}❌${colors.reset}`;
        case 'warning': return `${colors.yellow}⚠️${colors.reset}`;
        case 'info': return `${colors.cyan}ℹ️${colors.reset}`;
        default: return '•';
    }
}

/**
 * Main function
 */
function main() {
    const projectRoot = process.cwd();
    const componentsDir = path.join(projectRoot, 'components');
    const appDir = path.join(projectRoot, 'app');

    console.log(`\n${colors.cyan}🔍 Scanning for color contrast issues...${colors.reset}\n`);
    console.log(`${colors.dim}Project: ${projectRoot}${colors.reset}\n`);

    // Find all component files
    const files = [
        ...findFiles(componentsDir, EXTENSIONS),
        ...findFiles(appDir, EXTENSIONS),
    ];

    console.log(`Found ${files.length} files to scan\n`);

    let totalIssues = { error: 0, warning: 0, info: 0 };
    let filesWithIssues = 0;

    for (const file of files) {
        const issues = auditFile(file);

        if (issues.length > 0) {
            filesWithIssues++;
            const relativePath = path.relative(projectRoot, file);
            console.log(`${colors.cyan}📁 ${relativePath}${colors.reset}`);

            for (const issue of issues) {
                totalIssues[issue.severity]++;
                const icon = getSeverityIcon(issue.severity);
                console.log(`  ${icon} Line ${issue.line}: ${issue.message}`);
                console.log(`     ${colors.dim}${issue.snippet}${colors.reset}`);
                console.log(`     ${colors.green}Fix: ${issue.fix}${colors.reset}\n`);
            }
        }
    }

    // Summary
    console.log(`\n${'─'.repeat(60)}\n`);
    console.log(`${colors.cyan}📊 Summary${colors.reset}`);
    console.log(`   Files scanned: ${files.length}`);
    console.log(`   Files with issues: ${filesWithIssues}`);
    console.log(`   ${colors.red}Errors: ${totalIssues.error}${colors.reset}`);
    console.log(`   ${colors.yellow}Warnings: ${totalIssues.warning}${colors.reset}`);
    console.log(`   ${colors.cyan}Info: ${totalIssues.info}${colors.reset}`);

    if (totalIssues.error === 0 && totalIssues.warning === 0) {
        console.log(`\n${colors.green}✅ No critical contrast issues found!${colors.reset}\n`);
    } else {
        console.log(`\n${colors.yellow}💡 Tip: Use semantic color pairs from design-tokens.ts:`);
        console.log(`   import { surfacePairs, buttonPairs, pillPairs } from '@/lib/design-tokens';${colors.reset}\n`);
    }

    // Exit with error code if there are errors
    if (totalIssues.error > 0) {
        process.exit(1);
    }
}

main();
