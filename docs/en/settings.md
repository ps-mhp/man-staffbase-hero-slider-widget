# Settings

| Setting | Description |
| --- | --- |
| Slides | Images, text, and buttons on the stage. Managed via the slide editor, which appears automatically when you open the settings. The text field below is the raw version and does not need to be edited. |
| Height | `Standard (420–560 px)` is the default setting. Other options include `Low (320–420 px)`, `High (560–720 px)`, and `Screen Height`. |
| Display Across Full Width | When enabled (default), the image spans the full width of the window, while the text remains aligned with the page’s margin. When disabled, the stage remains within the content column. |
| Seconds per Slide | `5` is the default. `0` pauses the stage; in this case, you can only navigate using arrows and swipes. Maximum of 30. |

## Fields on a Slide

| Field | Description |
| --- | --- |
| Image | Required. Landscape orientation, at least 1920 px wide. The slide will not be displayed without an image. |
| Image description | What is shown in the image. Leave blank only for purely decorative images—screen readers will read this field aloud. |
| Portrait-Oriented Image | Optional. Displayed on narrow, portrait-oriented screens. If missing, the landscape-oriented image is used everywhere. |
| Title | Set in all caps. Remains on a single line up to about 24 characters. |
| Subtitle | Optional, one to two lines. |
| Button | Optional. Appears only if the label and destination are filled in. At most one per slide. |
| Open in a new tab | Opens the button’s destination in a new tab. Common for external destinations. |

## Notes

- **Height** acts as a boundary, not a fixed height: the stage is 21:9 on wide
  screens and 4:3 on narrow screens, and is only constrained by the boundaries of
  the selected level.
- `Screen height` fills the visible area minus the header,
  but at least 420 px.
- **Seconds per slide** takes effect starting with the second slide.
- If you have “Reduce Motion” enabled in your operating system, you won’t see
  any transitions on your own—regardless of this setting.
- The controls only appear starting with the second slide. On narrow
  screens, the arrows are hidden; on those screens, you swipe instead.
