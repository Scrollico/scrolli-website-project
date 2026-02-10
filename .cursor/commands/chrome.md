# /sc:chrome - Chrome DevTools MCP Research

## Purpose

Use Chrome DevTools MCP (Model Context Protocol) to research, debug, and test web applications.

## Usage

```
/sc:chrome [action] [options]
```

## Available Actions

### Navigation

- Navigate to URLs
- Take screenshots
- Capture accessibility snapshots
- Wait for elements/text

### Interaction

- Click elements
- Type into inputs
- Fill forms
- Hover over elements
- Select dropdown options
- Press keys

### Analysis

- Get console messages
- Get network requests
- Evaluate JavaScript
- Take snapshots

### Page Management

- List pages/tabs
- Create new pages
- Close pages
- Select pages

## Common Use Cases

### Testing Component Changes

```
/sc:chrome navigate http://localhost:3000
/sc:chrome screenshot
/sc:chrome click [element-selector]
/sc:chrome console_messages
```

### Debugging Issues

```
/sc:chrome navigate [url]
/sc:chrome console_messages --errors-only
/sc:chrome network_requests
/sc:chrome evaluate [script]
```

### Research & Analysis

```
/sc:chrome navigate [url]
/sc:chrome snapshot --verbose
/sc:chrome console_messages
/sc:chrome network_requests
```

## Best Practices

1. **Always navigate first** - Set context before interactions
2. **Use snapshots** - Better than screenshots for accessibility
3. **Check console** - Look for errors and warnings
4. **Monitor network** - Check API calls and responses
5. **Wait for elements** - Use wait_for before interactions
6. **Take screenshots** - Document visual state when needed

## Integration with Design System

Use Chrome DevTools to:

- Test dark mode rendering
- Verify responsive breakpoints
- Check accessibility
- Validate design token usage
- Test component interactions

## Related Commands

- `/sc:design` - Design system reference
- `/sc:component` - Component templates
- `/sc:audit` - Design system audit
