# Settings

| Setting | Description |
| --- | --- |
| Entries | The content of the stage: custom slides, individual news posts, and entire news channels. Managed via the editor, which appears automatically when you open the settings. The text field below is the draft and does not need to be edited. |
| Height | `Standard (420–560 px)` is the default. Other options include `Low (320–420 px)`, `High (560–720 px)`, and `Screen Height`. |
| Show full width | When enabled (default), the image spans the full width of the window, while the text remains aligned with the page’s margin. When disabled, the stage remains within the content column. |
| Seconds per slide | `5` is the default. `0` pauses the stage; in this case, you can only navigate using arrows and lines—and if the controls are disabled, only by swiping and using the arrow keys. Maximum of 30. |
| Position relative to the breadcrumbs | `After the breadcrumbs` is the default: the stage begins below the breadcrumb line. `Before the breadcrumbs` places it flush with the menu and moves the breadcrumbs below it. This only applies if the stage is at the top of the page and the page has breadcrumbs at all. |
| Show Controls | When enabled (default), arrows and lines appear. When disabled, both disappear; you continue scrolling by swiping or using the arrow keys, and the set time per slide remains unchanged. |
| Spacing Below | `Standard` is the default: the spacing below the stage is the same as the spacing the page uses between its blocks. `No Spacing` places the following block directly next to it—in the case of “Before the Breadcrumbs,” directly below the breadcrumbs. |

## Types of Entries

| Type | Description |
| --- | --- |
| Slide | A manually edited slide: image, heading, subheading, button. |
| News Post | A specific post as a slide. Content and destination are taken from the post. |
| News Channel | An entire channel, one slide per post. New posts appear automatically. |

All three appear in the same list, can be mixed, and sorted using **↑** and
**↓**. In total, the stage displays a maximum of eight slides—a
channel entry counts as one, including all the slides it contributes.

## Fields on a Slide

| Field | Description |
| --- | --- |
| Image or Video | Required. From the media library or via a URL (`https://…`). Landscape orientation, at least 1920 px wide. The slide will not be displayed without an image or video. |
| URL | Instead of the media library: the `https` URL of an image or video. Other URLs will not be accepted. |
| Type | Image or video. Determined automatically by the file extension (`.mp4`, `.webm`, `.mov` are videos); select manually only for URLs without an extension. |
| Image or Video Description | What is shown. Leave blank only for purely decorative images and videos—screen readers will read this field aloud. |
| Image or Video for Portrait Orientation | Optional. Displayed on narrow, portrait-oriented screens. If missing, the landscape crop is used everywhere. |
| Headline | Keep it short: up to about 24 characters to keep it on one line. |
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
| Order | `Newest first` (default) or `Oldest first`. |
| Featured posts only | Default is off. Limits the display to posts pinned in the News section. |
| Posts with images only | Enabled by default. Without an image, the slide would be nothing more than a dark area with text. |
| Tags | Optional; separate multiple tags with commas. A post is considered valid if it includes at least one of these tags. |
| Show teaser as subtitle | Enabled by default. |
| Button label | Applies to all slides in the channel. Leave blank to omit the button. |

## Notes

- **Height** acts as a boundary, not a fixed height: the stage is 21:9 on wide
  screens and 4:3 on narrow screens, and is only constrained by the boundaries of
  the selected level.
- `Screen height` fills the visible area minus the header,
  but at least 420 px.
- **Seconds per slide** takes effect starting with the second slide.
- Users who have “Reduce Motion” enabled in their operating system will not see
  any transitions on their own—regardless of this setting.
- At the top, the stage always aligns flush—with the breadcrumbs or, if
  “Before the Breadcrumbs” is selected, with the menu. To compensate, it adjusts the inner spacing that the section maintains
  above its first block. This only happens if
  there is no other content above the stage.
- If the stage is the last block in its section, the section ends
  with it—regardless of its height. With a fixed step, the section adapts to the
  stage; with `Section Height`, the stage adapts to the section.
- **Downward Spacing** controls the spacing to the next block in the same
  section. The inner spacing of a following section belongs to that section and
  remains unchanged.
- With `Section Height`, the stage takes on the height of the section only if
  it stands alone within it. If there are other blocks in the same section, it retains
  its aspect ratio, and the blocks move up against it without spacing.
- The controls appear only starting with the second slide. On narrow
  screens, the arrows are hidden; on those screens, you swipe instead.
- A post that is deleted or is not visible to the reader
  takes only its own slide with it. The remaining slides stay in place.
- News slides follow the reader’s language, provided the post
  has been translated; otherwise, they follow the first available version.
- The **preview** in the editor follows the same rules as the
  published page. Anything not shown there will not appear on the stage
  either.
