# FAQ

**Question:** I created a slide, but the stage remains blank.

Answer: The slide is missing an image. Slides without an image are not displayed—an
empty dark area on the page would be indistinguishable from an error.
Open the editor and select an image under **Image or Video**
or enter a URL.

**Question:** I entered a video URL, but the slide only shows
a dark area.

Answer: Usually, the video isn’t accessible without logging in, or **Type** is set
to **Image** because the URL lacks an extension. Open the URL in
a private browser window: if it doesn’t play there, readers
won’t be able to see it either. A message directly below the field indicates that the address
was not accepted—it must begin with `https://`.

**Question:** I entered a label for the button, but
it doesn’t appear.

Answer: The button needs **both**—a label and a destination. As long as
one of the fields is empty, it won’t be displayed.

**Question:** The image doesn’t span the full width of the window.

Answer: Two possible causes. Either **Show Full Width**
is turned off, or the widget is in a column next to other content.
Place it on its own line at the top of the page.

**Question:** The text isn’t where the rest of the page content begins.

Answer: The stage adjusts to the content width reported by the page.
If it differs, please report the issue along with the page URL.

**Question:** Instead of the editor, I see a text field labeled “Entries” with curly
braces inside it.

Answer: The editor was unable to integrate into the dialog. Close
the settings and open them again. The text in the field is the
raw version of the entries; do not edit it manually—a typo
in it will cause all slides to disappear.

**Question:** The stage doesn’t change on its own.

Answer: Three possible causes: There is only one slide; **Seconds per Slide**
is set to `0`; or “Reduce motion” is enabled in the operating system.
In the latter case, this is intentional—you can still navigate using arrows
and lines.

**Question:** I don’t see any arrows on my phone.

Answer: This is by design. On narrow screens, you swipe; the
lines below the text still indicate which slide is currently on top.

**Question:** My image is cropped at the edge.

Answer: Depending on the window width, the stage crops the image to 21:9 or 4:3. Choose
an image with some space around the subject, or upload your own portrait-oriented crop under **Image for
Portrait Orientation**.

**Question:** Can I create more than eight slides?

Answer: No. At five seconds per slide, a full cycle takes forty seconds even with
just eight slides—no one stays on a stage that long.
The limit of eight applies to all slides combined: A channel entry with five posts
allows for only three additional slides alongside it.

**Question:** Do I have to update the stage when a new post
appears in the News?

Answer: Not for a **News Channel** entry—it always displays the latest
posts from the channel based on the set filters. A **News Post**
entry, on the other hand, stays with the post you selected.

**Question:** A slide from the News section has suddenly disappeared.

Answer: The post was deleted, moved, or is not visible to the reader. Only this one slide is missing; the rest remain.

**Question:** My channel entry shows fewer slides than I set.

Answer: Most often, the filters are too restrictive. **Only posts with images** is
the default setting—so a channel without images won’t display anything. Check the
preview in the editor: it shows exactly what will appear on the stage.

**Question:** There isn’t a single channel listed in the channel selection; instead, there’s a
text field for an ID.

Answer: The list of news channels was unavailable. Reload the dialog
box. If that doesn’t help, enter the channel ID manually; you’ll find it
in the channel’s URL in the CMS.

**Question:** Why is the image of a news post on the stage blurry or
strangely cropped?

Answer: Article images are cropped for the feed format, not for a
full-screen stage. In the entry, under **Override Stage Image**,
upload your own image—landscape orientation and at least 1920 px wide.

**Question:** What happens to the stage when the
page is automatically translated?

Answer: All user-written text is translated: the headline,
subheading, button label, and image description of a slide,
as well as the overridden title and label of a news entry.
Images, link destinations, channels, filters, and the order remain unchanged.

**Question:** A news entry displays different text on the translated page than in
the source language—is this an error?

Answer: No. The title and summary text of a news post come from the post
itself, and they are displayed in the language the reader has set
in the app. Only what you’ve written in the entry itself is translated.
If a language version of the post is missing, the available version appears instead of
leaving the slide blank.

**Question:** I selected “Before the breadcrumbs,” but nothing changes.

Answer: This setting only takes effect if three conditions are met: the page has
a breadcrumb trail at all, the stage is positioned at the very top of the page, and
there is no other content above it. If any of these conditions are not met, the
stage will remain below the breadcrumbs—a breadcrumb bar in the middle of the page would be
worse than no change at all. In the editor, a note appears
above the stage in this case. It does not appear on the published page; there,
the setting cannot be changed.

**Question:** There used to be a white strip above the stage. Where did it go?

Answer: The section containing the stage maintains an
inner margin above its first block. This is correct above text, but above a stage,
it creates a white strip between the menu or breadcrumbs and the image. The stage
compensates for this spacing on its own as soon as it is positioned at the very top. If there is
another block above it, the spacing remains as set by the page.

**Question:** I selected “No Spacing,” but there’s still space below the stage.

Answer: “No Spacing” removes the spacing between two blocks. If the
stage is the last block in its section, the inner spacing of the
section and the start of the next section follow below it—both belong to the page. If you set the height
to “Section Height,” the section’s internal spacing is removed; otherwise, place the
following content in the same section, and it will align directly with it.

**Question:** Without controls—how do you turn the pages?

Answer: Swipe with your finger, use the arrow keys to scroll, or let it run automatically:
the set time per slide remains unchanged. For the keyboard, the
stage itself becomes selectable as soon as the controls are missing.
