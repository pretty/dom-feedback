# DOM Feedback

Click any element on a page, leave a comment or edit its text, then copy all comments as JSON to paste into an AI agent.

## Install

1. Open `chrome://extensions`
2. Turn on **Developer mode** (top right)
3. Click **Load unpacked** and pick this `dom-feedback` folder
4. Pin the extension so its icon shows in the toolbar

## Use

1. Click the extension icon, or press `Alt+Shift+F`
2. Hover to highlight an element, then click it
3. Type your comment and press `Cmd/Ctrl+Enter` (or click Save)
   - To change the wording, click **Edit text** and type directly on the page. The comment is optional when you edit text.
4. Repeat for as many elements as you like
5. Click **Copy JSON** and paste it into your agent

Other controls:

- While hovering, press `↑` to select the parent element and `↓` to go back down.
- `Esc` stops selecting so you can use the page normally. Click **Select** to start again.
- Click a numbered pin or a row in **Comments** to edit it.
- The trash icon clears every comment on the current page.
- While editing text, **Reset text** puts back the original. Cancel or `Esc` drops unsaved edits.

Comments are saved per URL, so they stay after a reload. Text edits are shown again on reload if the page text hasn't changed. Deleting a comment puts the original text back.

## Output

```json
{
  "url": "https://example.com/pricing",
  "title": "Pricing",
  "viewport": { "width": 1440, "height": 900, "device": "desktop" },
  "comments": [
    {
      "selector": "#plans > div.card:nth-of-type(2) > button.cta",
      "comment": "Make this button full width",
      "textEdit": { "from": "Start free trial", "to": "Try it free" },
      "element": {
        "tag": "button",
        "html": "<button class=\"cta primary\" type=\"button\">",
        "text": "Start free trial"
      },
      "viewport": { "width": 1440, "height": 900, "device": "desktop" }
    }
  ]
}
```

`comment` and `textEdit` are each left out when empty. `element.text` is the original text.

The top-level `viewport` is the size when you copied. Each comment also has the size at the time it was written.
Device is `mobile` below 768px wide, `tablet` from 768px to 1023px, and `desktop` from 1024px.

## Notes

- Chrome blocks extensions on `chrome://` pages and the Chrome Web Store.
- Elements inside iframes can't be selected.
