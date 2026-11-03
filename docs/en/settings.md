# Settings

| Setting | Description |
| --- | --- |
| Entries | The content of the stage: custom slides, individual news posts, and entire news channels. Managed via the editor, which appears automatically when you open the settings. The text field below is the draft and does not need to be edited. |
| Height | `Standard (420–560 px)` is the default. Other options include `Low (320–420 px)`, `High (560–720 px)`, and `Screen Height`. |
| Show full width | When enabled (default), the image spans the full width of the window, while the text remains aligned with the page’s margin. When disabled, the stage remains within the content column. |
| Seconds per Slide | `5` is the default. `0` pauses the stage; in this case, you can only navigate using arrows and lines. Maximum of 30. |

## Types of Entries

| Type | Description |
| --- | --- |
| Slide | A manually maintained slide: image, headline, subheading, button. |
| News Article | A specific article as a slide. Content and link come from the article. |
| News Channel | An entire channel, one slide per article. New posts appear automatically. |

All three appear in the same list; they can be mixed and sorted using **↑** and
**↓**. In total, the stage displays a maximum of eight slides—a
channel entry counts as all the slides it contributes.

## Fields on a Slide

| Field | Description |
| --- | --- |
| Image or Video | Required. From the media library or via a URL (`https://…`). Landscape orientation, at least 1920 px wide. The slide will not be displayed without an image or video. |
| URL | Instead of the media library: the `https` URL of an image or video. Other URLs will not be accepted. |
| Type | Image or video. Determined automatically by the file extension (`.mp4`, `.webm`, `.mov` are videos); select manually only for URLs without an extension. |
| Image or Video Description | What is shown. Leave blank only for purely decorative images and videos—screen readers will read this field aloud. |
| Image or Video for Portrait Orientation | Optional. Displayed on narrow, portrait-oriented screens. If missing, the landscape crop is used everywhere. |
| Heading | Keep it short: up to about 24 characters to keep it on one line. |
| Subheading | Optional, one to two lines. |
| Button | Optional. Appears only if the label and destination are filled in. At most one per slide. |
| Open in a new tab | Opens the button’s destination in a new tab. Common for external destinations. |

## Fields of a News Post

| Field | Description |
| --- | --- |
| Channel | Required. Determines which posts are available for selection. |
| Post | Required. The fifty most recent posts from the channel, newest first. |
| Override headline | Optional. Leave blank to use the post’s title. |
| Show teaser as subtitle | Enabled by default. The teaser is truncated to 240 characters. |
| Button label | `Learn more` by default. Leave blank to omit the button; the destination is always the post. |
| Override stage image | Optional. Useful if the post image is cropped too tightly for the stage. |
| Image for portrait orientation | Optional. Displayed on narrow, portrait-oriented screens. |

## Fields of a News Channel

| Field | Description |
| --- | --- |
| Channel | Required. All slides in this entry come from this channel. |
| Number of Slides | Default is `3`; maximum of eight. |
| Order | `Newest First` (default) or `Oldest First`. |
| Featured posts only | Disabled by default. Limited to what is pinned in the news section. |
| Posts with images only | Enabled by default. Without an image, the slide would be nothing more than a dark area with text. |
| Keywords | Optional; separate multiple keywords with commas. A post is included if it contains at least one of these keywords. |
| Show teaser as subtitle | Enabled by default. |
| Button label | Applies to all slides in the channel. Leave blank to omit the button. |

## Notes

- **Height** acts as a limit, not a fixed height: the stage adapts to wide
  21:9 screens and on narrow 4:3 screens, and is only constrained to the boundaries of the
  selected level.
- `Screen height` fills the visible area minus the header,
  but at least 420 px.
- **Seconds per Slide** takes effect starting with the second slide.
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
