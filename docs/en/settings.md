# Settings

Everything is managed in the editor, which appears automatically when you open the settings:
the entries on the left and in the middle, and the stage settings
on the right in the **Widget** panel. In the Staffbase dialog, only the text field
“Entries” behind the editor; this is the raw version and does not need to be edited
.

| Setting | Description |
| --- | --- |
| Entries | The content of the stage: custom slides, individual news posts, and entire news channels. |

### “Widget” panel, “Design” tab

| Setting | Description |
| --- | --- |
| Height | `Section Height` is the default. Next to it are `Small (320–420 px)`, `Medium (420–560 px)`, `Large (560–720 px)`, and `Screen Height`. |
| Full Width | When enabled (default), the image spans the full width of the window, while the text remains aligned with the page’s margin. When disabled, the stage remains within the content column. |
| Position | `After the breadcrumbs` is the default: the stage begins below the breadcrumb row. `Before the breadcrumbs` places it flush below the menu and moves the breadcrumbs below it. Applies only if the stage is at the top of the page and the page has breadcrumbs at all. |
| Bottom Spacing | `Standard` is the default: the spacing below the stage is the same as the spacing the page uses between its blocks. `None` allows the following block to connect directly—in the case of “Before the breadcrumbs,” directly below the breadcrumbs. |

### “Widget” Panel, “Behavior” Tab

| Setting | Description |
| --- | --- |
| Seconds per slide | `5` is the default; `0` to `30` are allowed; decimal numbers are also accepted. `0` pauses the stage; then navigation is limited to arrows and lines—and if the controls are disabled, only via swiping and the arrow keys. Leaving this blank means: same as before. |
| Show Controls | When enabled (default), arrows and lines appear. When disabled, both disappear; scrolling continues via swiping and the arrow keys, and the set time per slide remains unchanged. |

### Existing Stages

Up to version 0.4, these settings were available as individual fields in the
Staffbase dialog. Existing stages retain them: As long as a setting in the panel
has not been changed, the value from the old field remains in effect. The panel displays
it where it can be read; otherwise, drop-down menus show **As before**
and toggles display the note “Not yet set here.” Only after a user
setting and selects **Apply** will set it in the editor—and
only that one. Anyone who opens the editor and applies the changes without making any modifications will not
change anything. The old fields are hidden in the dialog.

## Types of Entries

| Type | Description |
| --- | --- |
| Slide | A manually maintained slide: image or video, headline, subheading, buttons. |
| News Post | A specific post as a slide. Content and destination come from the post. |
| News Channel | An entire channel, one slide per post. New posts appear automatically. |

All three appear in the same list; they can be mixed and sorted by dragging the
handle or using **up** and **down**. In total,
the stage displays a maximum of eight slides—a channel entry counts as including all
the slides it contributes.

## Fields on a Slide

| Field | Description |
| --- | --- |
| Image or Video | Required. From the media library or via a URL (`https://…`). Landscape orientation, at least 1920 px wide. The slide will not be displayed without an image or video. |
| URL | Enter the `https` URL of an image or video in the **Enter URL** field instead of using the media library. Other URLs will not be accepted. |
| Type | Image or video. Determined automatically by the file extension (`.mp4`, `.webm`, `.mov` are videos); select manually only for URLs without an extension. |
| Image or Video Description | What is shown. Leave blank only for purely decorative images and videos—screen readers will read this field aloud. |
| Portrait Orientation | Optional. Displayed on narrow, portrait-oriented screens. If omitted, the landscape crop is used everywhere. |
| Heading | Keep it short: up to about 24 characters to keep it on one line. |
| Subheading | Optional, one to two lines. |
| Buttons | Optional, up to three per slide. Displayed as a list with style and destination; clicking expands a button’s fields. Move up/down, duplicate, and delete using the icons above the fields. A button appears only if the label and destination are filled in. Applies only to manually maintained slides; news slides get their button from the post. |
| Destination | **Address** (`https://…`, `mailto:…`, `tel:…`, or a path like `/content/…`), **Page** from Staffbase, or **News Post** from Staffbase (first channel, then post). Other addresses, such as `javascript:`, are not accepted. |
| Style | **Filled red** (main action, default), **Filled white**, **White outline**, or **Text link**. New buttons starting with the second one appear as outlines to avoid having two red areas next to each other. |
| Icon | Optional: Arrow, Angle, External Link, Download, Play, Document, Calendar, Email, Phone, or Information. If an icon is selected, **Icon appears**: before or after the text. |
| Open in new tab | Toggle. Opens the button’s destination in a new tab. Common for external destinations. |

## Fields of a News Post

| Field | Description |
| --- | --- |
| Channel | Required. Determines which posts are available for selection. |
| Post | Required. The fifty most recent posts from the channel, newest first. |
| Headline | Optional. Leave blank to use the post’s title. |
| Show Teaser | Enabled by default. The teaser appears as a subheading and is truncated to 240 characters. |
| Button Label | `Learn More` by default. Leave blank to omit the button; the destination is always the post. |
| Stage layout | Optional. Useful if the post image is cropped too tightly for the stage. |
| Portrait orientation | Optional. Displayed on narrow, portrait-oriented screens. |

## Fields of a News Channel

| Field | Description |
| --- | --- |
| Channel | Required. All slides in this entry come from this channel. |
| Number of Posts | Default is `3`, maximum of eight. |
| Order | `Newest first` (default) or `Oldest first`. |
| Featured posts only | Default is off. Limits the feed to posts pinned in the News section. |
| Posts with images only | Enabled by default. Without an image, the slide would be nothing more than a dark area with text. |
| Hashtags | Optional; separate multiple hashtags with commas. A post is included if it contains at least one of them. |
| Show preview text | Enabled by default. |
| Button label | Applies to all slides in the channel. Leave blank to omit the button. |

## Notes

- **Height** acts as a limit, not a fixed height: the stage adapts to wide
  21:9 screens and on narrow 4:3 screens, and is only constrained to the boundaries of the
  selected level.
- `Screen height` fills the visible area minus the header,
  but at least 420 px.
- **Seconds per slide** takes effect starting with the second slide.
- Users who have “Reduce motion” enabled in their operating system will not see
  any changes automatically—regardless of this setting.
- At the top, the stage always aligns flush—with the breadcrumbs or, if
  “Before the breadcrumbs” is selected, with the menu. To achieve this, it compensates for the
  inner spacing that the section maintains above its first block. This only happens if
  there is no other content above the stage.
- If the stage is the last block in its section, the section ends
  with it—regardless of its height. With a fixed level, the section adapts to the
  stage; with `Section Height`, the stage adapts to the section.
- **Bottom Spacing** controls the spacing to the next block in the same
  section. The inner spacing of a subsequent section belongs to that section and
  remains unchanged.
- With `Section Height`, the stage occupies the height of the section only if
  it stands alone within it. If there are other blocks in the same section, it retains
  its aspect ratio, and the blocks move up against it without any spacing.
- The controls only appear starting with the second slide. On narrow
  screens, the arrows are hidden; on those screens, you swipe.
- A post that is deleted or is not visible to the reader
  takes only its own slide with it. The remaining slides stay in place.
- News slides follow the reader’s language, provided the post
  has been translated; otherwise, they follow the first available version.
- The **preview** on desktop, tablet, and mobile devices applies the
  same rules to news entries as the published page. Anything not included there
  will not appear on the screen either.
