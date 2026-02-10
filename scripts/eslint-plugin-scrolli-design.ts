/**
 * ESLint Plugin: Scrolli Design System
 * 
 * Custom ESLint rules to enforce design token usage and prevent hardcoded values.
 * 
 * Installation:
 * 1. Add to eslint.config.js plugins
 * 2. Enable rules in rules section
 */

import type { Rule } from 'eslint';

// ============================================================================
// PATTERNS TO DETECT
// ============================================================================

const HARDCODED_PATTERNS = {
  spacing: {
    // Matches: py-4, px-6, gap-8, p-4, m-4, mt-4, mb-4, ml-4, mr-4
    regex: /\b(?:py|px|gap|p|m|mt|mb|ml|mr|pt|pb|pl|pr)-\d+\b/g,
    suggestion: 'Use sectionPadding, containerPadding, componentPadding, or gap tokens from @/lib/design-tokens',
  },
  backgroundColor: {
    // Matches: bg-white, bg-black, bg-gray-100/200/etc without dark: prefix
    regex: /\bbg-(?:white|black|gray-\d{2,3})\b(?!\s+dark:)/g,
    suggestion: 'Use colors.background.* tokens from @/lib/design-tokens',
  },
  textColor: {
    // Matches: text-black, text-white, text-gray-100/200/etc without dark: prefix
    regex: /\btext-(?:black|white|gray-\d{2,3})\b(?!\s+dark:)/g,
    suggestion: 'Use Typography components or colors.foreground.* tokens',
  },
  borderRadius: {
    // Matches: rounded-sm, rounded-md, rounded-lg, etc
    regex: /\brounded-(?:sm|md|lg|xl|2xl|3xl|full)\b/g,
    suggestion: 'Use borderRadius tokens from @/lib/design-tokens',
  },
  shadow: {
    // Matches: shadow-sm, shadow-md, shadow-lg, etc
    regex: /\bshadow-(?:sm|md|lg|xl|2xl)\b/g,
    suggestion: 'Use elevation tokens from @/lib/design-tokens',
  },
};

// ============================================================================
// RULE: no-hardcoded-design-values
// ============================================================================

export const noHardcodedDesignValues: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow hardcoded design values that should use design tokens',
      recommended: true,
    },
    messages: {
      hardcodedSpacing: 'Hardcoded spacing "{{value}}" detected. {{suggestion}}',
      hardcodedBackgroundColor: 'Hardcoded background color "{{value}}" detected. {{suggestion}}',
      hardcodedTextColor: 'Hardcoded text color "{{value}}" detected. {{suggestion}}',
      hardcodedBorderRadius: 'Hardcoded border radius "{{value}}" detected. {{suggestion}}',
      hardcodedShadow: 'Hardcoded shadow "{{value}}" detected. {{suggestion}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowSpacing: { type: 'boolean', default: false },
          allowBackgroundColor: { type: 'boolean', default: false },
          allowTextColor: { type: 'boolean', default: false },
          allowBorderRadius: { type: 'boolean', default: false },
          allowShadow: { type: 'boolean', default: false },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return;
        
        const classValue = node.value;

        // Check spacing
        if (!options.allowSpacing) {
          const spacingMatches = classValue.match(HARDCODED_PATTERNS.spacing.regex);
          if (spacingMatches) {
            context.report({
              node,
              messageId: 'hardcodedSpacing',
              data: {
                value: spacingMatches.join(', '),
                suggestion: HARDCODED_PATTERNS.spacing.suggestion,
              },
            });
          }
        }

        // Check background colors
        if (!options.allowBackgroundColor) {
          const bgMatches = classValue.match(HARDCODED_PATTERNS.backgroundColor.regex);
          if (bgMatches) {
            context.report({
              node,
              messageId: 'hardcodedBackgroundColor',
              data: {
                value: bgMatches.join(', '),
                suggestion: HARDCODED_PATTERNS.backgroundColor.suggestion,
              },
            });
          }
        }

        // Check text colors
        if (!options.allowTextColor) {
          const textMatches = classValue.match(HARDCODED_PATTERNS.textColor.regex);
          if (textMatches) {
            context.report({
              node,
              messageId: 'hardcodedTextColor',
              data: {
                value: textMatches.join(', '),
                suggestion: HARDCODED_PATTERNS.textColor.suggestion,
              },
            });
          }
        }

        // Check border radius
        if (!options.allowBorderRadius) {
          const radiusMatches = classValue.match(HARDCODED_PATTERNS.borderRadius.regex);
          if (radiusMatches) {
            context.report({
              node,
              messageId: 'hardcodedBorderRadius',
              data: {
                value: radiusMatches.join(', '),
                suggestion: HARDCODED_PATTERNS.borderRadius.suggestion,
              },
            });
          }
        }

        // Check shadows
        if (!options.allowShadow) {
          const shadowMatches = classValue.match(HARDCODED_PATTERNS.shadow.regex);
          if (shadowMatches) {
            context.report({
              node,
              messageId: 'hardcodedShadow',
              data: {
                value: shadowMatches.join(', '),
                suggestion: HARDCODED_PATTERNS.shadow.suggestion,
              },
            });
          }
        }
      },

      TemplateLiteral(node) {
        // Handle template literals in className
        for (const quasi of node.quasis) {
          const classValue = quasi.value.raw;

          // Apply same checks as for regular strings
          if (!options.allowSpacing) {
            const spacingMatches = classValue.match(HARDCODED_PATTERNS.spacing.regex);
            if (spacingMatches) {
              context.report({
                node,
                messageId: 'hardcodedSpacing',
                data: {
                  value: spacingMatches.join(', '),
                  suggestion: HARDCODED_PATTERNS.spacing.suggestion,
                },
              });
            }
          }

          if (!options.allowBackgroundColor) {
            const bgMatches = classValue.match(HARDCODED_PATTERNS.backgroundColor.regex);
            if (bgMatches) {
              context.report({
                node,
                messageId: 'hardcodedBackgroundColor',
                data: {
                  value: bgMatches.join(', '),
                  suggestion: HARDCODED_PATTERNS.backgroundColor.suggestion,
                },
              });
            }
          }

          if (!options.allowTextColor) {
            const textMatches = classValue.match(HARDCODED_PATTERNS.textColor.regex);
            if (textMatches) {
              context.report({
                node,
                messageId: 'hardcodedTextColor',
                data: {
                  value: textMatches.join(', '),
                  suggestion: HARDCODED_PATTERNS.textColor.suggestion,
                },
              });
            }
          }
        }
      },
    };
  },
};

// ============================================================================
// RULE: require-typography-components
// ============================================================================

export const requireTypographyComponents: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Encourage use of Typography components for automatic dark mode support',
      recommended: true,
    },
    messages: {
      useHeadingComponent: 'Raw heading element <{{tag}}> detected. Use <Heading level={{level}}> component for automatic dark mode support.',
      useTextComponent: 'Raw text element <{{tag}}> with text styling detected. Consider using <Text> component for automatic dark mode support.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node: any) {
        const tagName = node.name?.name;

        // Check for raw heading elements
        if (/^h[1-6]$/.test(tagName)) {
          const level = tagName.charAt(1);
          context.report({
            node,
            messageId: 'useHeadingComponent',
            data: { tag: tagName, level },
          });
        }

        // Check for p/span with text-* classes
        if (tagName === 'p' || tagName === 'span') {
          const classNameAttr = node.attributes?.find(
            (attr: any) => attr.name?.name === 'className'
          );
          
          if (classNameAttr?.value?.value) {
            const classValue = classNameAttr.value.value;
            if (/text-(?:xs|sm|base|lg|xl|2xl|3xl)/.test(classValue)) {
              context.report({
                node,
                messageId: 'useTextComponent',
                data: { tag: tagName },
              });
            }
          }
        }
      },
    };
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export const rules = {
  'no-hardcoded-design-values': noHardcodedDesignValues,
  'require-typography-components': requireTypographyComponents,
};

export default {
  rules,
};
