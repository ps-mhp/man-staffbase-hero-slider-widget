# Settings

Everything is managed in the editor, which appears automatically when you open the settings:
the entries on the left, the stage for the selected
entry displayed prominently in the center, and all settings on the right in the **Settings** panel—tabs
**Slide** (or **Post**, **Channel**) for the entry, **Design**, and
**Behavior** for the entire stage. If there is no entry, the panel is labeled **Widget**. In the Staffbase dialog, only the text field
“Entries” behind the editor; this is the raw version and does not need to be edited
.

| Setting | Description |
| --- | --- |
| Entries | The content of the stage: custom slides, individual news posts, and entire news channels. |

### “Settings” panel, “Design” tab

| Setting | Description |
| --- | --- |
| Height | `Section Height` is the default. Next to it are `Small (320–420 px)`, `Medium (420–560 px)`, `Large (560–720 px)`, and `Screen Height`. |
| Full Width | When enabled (default), the image spans the full width of the window, while the text remains aligned with the page’s baseline. When disabled, the stage remains within the content column. |
| Position | `After the breadcrumbs` is the default: the stage begins below the breadcrumb row. `Before the breadcrumbs` places it flush below the menu and moves the breadcrumbs below it. Applies only if the stage is at the top of the page and the page has a breadcrumb trail at all. |
| Bottom Spacing | `Standard` is the default: the spacing below the stage is the same as the spacing the page uses between its blocks. `None` allows the following block to connect directly—in the case of “Before the breadcrumbs,” directly below the breadcrumbs. |

### “Settings” Panel, “Behavior” Tab

| Setting | Description |
| --- | --- |
| Seconds per slide | `5` is the default; `0` to `30` are allowed; decimal numbers are also accepted. `0` pauses the stage; then navigation is limited to arrows and dashes—and if the controls are disabled, only via swiping and the arrow keys. Leaving this blank means: same as before. |
| Show Controls | When enabled (default), arrows and dashes appear. When disabled, both disappear; scrolling continues via swiping and the arrow keys, and the set time per slide remains unchanged. |

### Existing Stages

Up to version 0.4, these settings were available as individual fields in the
Staffbase dialog. Existing stages retain them: As long as a setting in the panel
has not been changed, the value from the old field remains in effect. The panel displays
it where it can be read; otherwise, drop-down menus show **As before**
and toggles display the note “Not yet set here.” Only after a user
toggle and selects **Apply** sets it in the editor—and
only that one. If you open the editor and apply the changes without making any modifications,
nothing changes. The old fields are hidden in the dialog.

## Types of Entries

| Type | Description |
| --- | --- |
| Slide | A manually maintained slide: image, video, or animation; headline; subheading; buttons. |
| News Post | A specific post as a single slide. Content and destination are taken from the post. |
| News Channel | An entire channel, with one slide per post. New posts appear automatically. |

All three appear in the same list; they can be mixed and sorted by dragging the
handle or using **up** and **down**. In total,
the stage displays a maximum of eight slides—a channel entry counts as including all
the slides it contributes.

## Fields on a Slide

| Field | Description |
| --- | --- |
| Layout | **Fixed**: Heading, subheading, and buttons in a fixed position at the bottom left. **Custom**: Building blocks in nine zones, arranged on the stage (see below). The change carries over whatever is there. |
| Background | **Image or Video** (a file; see below) or **Animation**: a moving pattern of squares in MAN colors that the widget draws itself. An animation adapts to any stage size, requires no portrait orientation, and doesn’t load anything afterward. |
| Pattern | Only for animations. Square: **Wave** (fine squares through which a wave passes, causing them to rise), **Grid** (calm grid with a moving band of light), **Modules** (sparsely distributed modules that pulse). Round: **Dots** (fine dots that create a rippling effect), **Lines** (flowing contour lines, some in red), **Rings** (rings of dots that spread gently from the right), **Flow** (particles that circle and drift). The text area on the left—at the bottom of the phone—always remains empty. |
| Background | Only for animation. **Opaque**, **75%**, **50%**, **25%**, or **Transparent**: The section behind the scene shines through; patterns and text remain bold. |
| Background Color | Only for animations. **Dark** (charcoal) or **Light** (white). The text automatically turns white or charcoal—whichever is more readable on the visible background, even when a translucent background is overlaid on a colored section. |
| Speed | Only for animations. **Slow** (one cycle in 20 seconds) or **Fast** (12 seconds). If the device’s “Reduce Motion” setting is enabled, the animation pauses. |
| Red Accents | Only for animations. Switch: Red elements move along with the animation—roughly every hundredth element in the field; for lines and rings, individual complete lines or rings. |
| Image or Video | Required if the background is an **image or video**. From the media library or via a URL (`https://…`). Landscape orientation, at least 1920 px wide. The slide will not be displayed without an image or video. |
| URL | Enter the `https` URL of an image or video in the **Enter URL** field instead of using the media library. Other URLs will not be accepted. |
| Type | Image or video. Determined automatically by the file extension (`.mp4`, `.webm`, `.mov` are videos); select manually only for URLs without an extension. |
| Image or Video Description | What is shown. Leave blank only for purely decorative images and videos—screen readers will read this field aloud. |
| Portrait Orientation | Optional. Displayed on narrow, portrait-oriented screens. If omitted, the landscape crop is used everywhere. |
| Heading | Keep it short: up to about 24 characters to keep it on one line. |
| Subheading | Optional, one to two lines. |
| Buttons | Optional, up to three per slide. Displayed as a list with style and destination; clicking expands a button’s fields. Move up/down, duplicate, and delete using the icons above the fields. A button appears only if the label and destination are filled in. Applies only to manually maintained slides; news slides get their button from the post. |
| Destination | **Address** (`https://…`, `mailto:…`, `tel:…`, or a path like `/content/…`), **Page** from Staffbase, or **News Post** from Staffbase (first channel, then post). Other addresses, such as `javascript:`, are not accepted. |
| Style | **Solid red** (main action, default), **Solid white**, **White outline**, or **Text link**. New buttons starting with the second one appear as outlines to avoid having two red areas next to each other. |
| Icon | Optional: Arrow, Angle, External Link, Download, Play, Document, Calendar, Email, Phone, or Information. When an icon is used, **Icon appears**: before or after the text. |
| Open in a new tab | Toggle. Opens the button’s destination in a new tab. Common for external destinations. |

## Fields of a News Post

| Field | Description |
| --- | --- |
| Channel | Required. Determines which posts are available for selection. |
| Post | Required. The fifty most recent posts from the channel, newest first. |
| Headline | Optional. Leave blank to use the post title. |
| Show Teaser | Set to "On" by default. The teaser appears as a subheading and is truncated to 240 characters. |
| Button Label | Default is `Learn More`. Leave blank to omit the button; the destination is always the post. |
| Stage layout | Optional. Useful if the post image is cropped too tightly for the stage. |
| Portrait orientation | Optional. Displayed on narrow, portrait-oriented screens. |

## Fields of a News Channel

| Field | Description |
| --- | --- |
| Channel | Required. All slides in this entry come from this channel. |
| Number of Posts | Default is `3`, maximum of eight. |
| Order | `Newest First` (default) or `Oldest First`. |
| Featured posts only | Disabled by default. Limited to what is pinned in the news feed. |
| Posts with images only | Enabled by default. Without an image, the slide would be nothing more than a dark area with text. |
| Hashtags | Optional, multiple separated by commas. One post is sufficient if it includes any of them. |
| Show preview text | Enabled by default. |
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
  with it—regardless of its height. With a fixed step, the section adjusts to the
  stage; with `Section Height`, the stage adjusts to the section.
- **Bottom Spacing** controls the spacing to the next block in the same
  section. The inner spacing of a subsequent section belongs to that section and
  remains unchanged.
- With `Section Height`, the stage takes on the height of the section only if
  it stands alone within it. If there are other blocks in the same section, it retains
  its aspect ratio, and the blocks move up against it without any spacing.
- The controls appear only starting with the second slide. On narrow
  screens, the arrows are hidden; on those screens, you swipe instead.
- A post that is deleted or is not visible to the reader
  takes only its own slide with it. The remaining slides stay in place.
- News slides follow the reader’s language, provided the post
  has been translated; otherwise, they follow the first available version.
- The **Preview** on desktop, tablet, and mobile applies the
  same rules to news entries as the published page. Anything not included there
  will not appear on the stage either.

## Custom Slide

With **Layout: Custom**, the stage in the center is a workspace
with nine zones—top, middle, and bottom, each on the left, center, and right
along the alignment line. The panel on the right contains the catalog of building blocks.

| Building Block | Settings |
| --- | --- |
| Heading | Text, size (**Display**, **H1**–**H3**), color. The first heading on the slide is its main heading. |
| Text | Text, size (**L**, **M**, **S**), Color. |
| Label | Short text above a heading, Color. |
| Buttons | Up to three buttons, as on the fixed slide. |
| Image or Logo | From the media library or via URL, description, size: **S** one-third, **M** two-thirds, **L** the full width of the zone — no more than one-fifth, two-fifths, or three-fifths of the stage height (on mobile, **L** is just under half). To use a large image, make the zone wider (**Width**). Cutout images (PNG, SVG) work on any background. |
| Icon | Symbol, size, color. |

Additionally, for each building block: **Zone** (a 3×3 selection like the stage),
**Hide on mobile**, and at the top: **Move up**, **Move down**, **Duplicate**,
**Delete**. **Color: Auto** matches the slide—white or charcoal, depending on
which is more readable against the background.

**Alignment per zone:** Clicking on a zone’s name (or its empty
area) displays **Horizontally in the Zone** (**Left**, **Center**,
**Right**) and **Vertically in the Zone** (**Top**, **Center**, **Bottom**) on the right. These
apply to all blocks in the zone; the same fields are also available in the
settings of each block. The default is the zone’s position—“bottom left”
is at the bottom left.

**Combine zones:** Under “Alignment,” you’ll find **Width** (**1 column**,
**2 columns**, **3 columns**) and **Height** (**1 row**, **2 rows**,
**3 rows**). For example, the top row becomes a zone (“top, full
width”) or the left column (“left, full height”). The zone expands first
to the right or down, and at the edge to the left or up; the building blocks of the
overlapping zones appear behind their own, and the alignment remains the same. When
resized, the zone remains on the side where its building blocks are located. A
size that would only partially overlap another combined zone is not
offered.

**On mobile**, the zones appear one below the other in reading order (top left, top
center, top right, center left …; a combined zone is positioned at the location
of its top-left corner); right-aligned elements move to the left,
centered elements remain centered, and buttons remain buttons. **Hide on Mobile** hides anything that’s excessive on the phone;
you can check this at the top using **Mobile**.
