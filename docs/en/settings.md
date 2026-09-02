# Settings

| Setting | Description |
| --- | --- |
| Entries | The content of the stage: custom slides, individual news articles, and entire news channels. Managed via the editor, which appears automatically when you open the settings. The text field below is the draft and does not need to be edited. |
| Height | `Standard (420–560 px)` is the default. Other options include `Low (320–420 px)`, `High (560–720 px)`, and `Full Screen`. |
| Display full width | When enabled (default), the image spans the full width of the window, while the text remains aligned with the page’s margin. When disabled, the stage remains within the content column. |
| Seconds per Slide | `5` is the default. `0` pauses the stage; in this case, you can only navigate using arrows and lines. Maximum of 30. |

## Types of Entries

| Type | Description |
| --- | --- |
| Slide | A manually maintained slide: image, headline, subheading, button. |
| News Post | A specific post as a slide. Content and link are taken from the post. |
| News Channel | An entire channel, one slide per post. New posts appear automatically. |

All three appear in the same list, can be mixed, and sorted using **↑** and
**↓**. In total, the stage displays a maximum of eight slides—a
channel entry counts as one, including all the slides it contributes.

## Fields on a Slide

| Field | Description |
| --- | --- |
| Image | Required. Landscape orientation, at least 1920 px wide. The slide will not be displayed without an image. |
| Image Description | What is shown in the image. Leave blank only for purely decorative images—screen readers will read this field aloud. |
| Portrait Image | Optional. Displayed on narrow, portrait-oriented screens. If missing, the landscape version is used everywhere. |
| Title | Displayed in all caps. Remains on a single line up to about 24 characters. |
| Subtitle | Optional, one to two lines. |
| Button | Optional. Appears only if the label and destination are filled in. At most one per slide. |
| Open in a new tab | Opens the button’s destination in a new tab. Common for external destinations. |

## Fields of a News Post

| Field | Description |
| --- | --- |
| Channel | Required. Determines which posts are available for selection. |
| Post | Required. The channel’s fifty most recent posts, newest first. |
| Override headline | Optional. Leave blank to use the post’s title. |
| Show teaser as subheading | Enabled by default. The teaser is truncated to 240 characters. |
| Button label | Default is `Learn more`. Leave blank to omit the button; the destination is always the post. |
| Override stage image | Optional. Useful if the post image is cropped too tightly for the stage. |
| Image for portrait orientation | Optional. Displayed on narrow, portrait-oriented screens. |

## Fields of a News Channel

| Field | Description |
| --- | --- |
| Channel | Required. All slides in this entry come from this channel. |
| Number of Slides | Default is `3`, maximum of eight. |
| Order | `Newest First` (default) or `Oldest First`. |
| Featured posts only | Disabled by default. Limited to what is pinned in the News section. |
| Posts with images only | Enabled by default. Without an image, the slide would be nothing more than a dark area with text. |
| Tags | Optional; separate multiple tags with commas. A post counts as matching if it contains any one of them. |
| Show teaser as subtitle | Enabled by default. |
| Button Label | Applies to all slides in the channel. Leave blank to omit the button. |

## Notes

- **Height** acts as a limit, not a fixed height: the stage is optimized for wide
  21:9 screens and on narrow 4:3 screens and is only constrained to the boundaries of the
  selected level.
- `Screen height` fills the visible area minus the header,
  but at least 420 px.
- **Seconds per slide** takes effect only starting with the second slide.
- Users who have “Reduce Motion” enabled in their operating system will not see
  any changes automatically—regardless of this setting.
- The controls do not appear until the second slide. On narrow
  screens, the arrows are hidden; on those screens, you swipe instead.
- A post that is deleted or is not visible to the reader
  only takes its own slide with it. The remaining slides stay in place.
- News slides follow the reader’s language, provided the post
  has been translated; otherwise, they follow the first available version.
- The **preview** in the editor follows the same rules as the
  published page. Anything not shown there will not appear on the stage
  either.
