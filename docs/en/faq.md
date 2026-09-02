# FAQ

**Question:** I created a slide, but the stage remains blank.

Answer: The slide is missing an image. Slides without an image are not displayed—an
empty dark area would be indistinguishable from an error on the page.
Open the editor and select an image under **Image**.

**Question:** I entered a label for the button, but
it doesn’t appear.

Answer: The button needs **both**—a label and a destination. As long as
one of the fields is empty, it won’t be displayed.

**Question:** The image doesn’t span the full width of the window.

Answer: There are two possible causes. Either **Show Full Width**
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

Answer: There are three possible causes: There is only one slide; **Seconds per Slide**
is set to `0`; or “Reduce motion” is enabled in the operating system.
In the latter case, this is by design—you can still navigate using arrows
and lines.

**Question:** I don’t see any arrows on my phone.

Answer: That’s by design. On narrow screens, you swipe; the
lines below the text still indicate which slide is currently on top.

**Question:** My image is cropped at the edges.

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

**Question:** My channel entry shows fewer slides than I’ve set.

Answer: Most likely, the filters are too restrictive. **Only posts with images** is
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
full-screen stage. In the entry, under **Override stage image**,
upload your own image—landscape orientation and at least 1920 px wide.
