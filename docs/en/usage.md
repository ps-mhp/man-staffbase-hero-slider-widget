# Step by Step

## Setting Up a Stage with an Image

1. Upload the image to the Staffbase media library beforehand. Landscape orientation, at least
   1920 px wide; depending on the window width, the stage will crop it to a 21:9 or
   4:3 — so the image should not extend all the way to the edges.
2. Place the **Hero Slider** widget at the top of the page, in a row
   with no other widgets next to it. If it’s placed in a column next to other
   content, it won’t display properly across the full width.
3. Open the widget’s settings. The editor will open
   automatically.
4. Click **New +** above the list and select **Slide**.
5. Under **Image**, click the dotted area labeled **Select Image** and
   select the image from the media library. The slide will not be
   displayed without an image.
6. Under **Image Description**, enter a description of what is shown. Leave the
   field blank only if the image is purely decorative.
7. Enter the **Title**. It will be displayed in all caps; up to about
   24 characters, it will remain on a single line.
8. Optional: **Caption** and **Button**. The button appears
   only if both the label **and** the destination are filled in.
9. Click **Apply**.
10. Set **Seconds per Slide** to `0` — for a single slide, there’s
    nothing to change.
11. Save the page and preview it, once in full-width
    mode and once in a narrow window.

## Creating Multiple Slides

1. Open the settings to launch the editor.
2. For each additional slide, select **Slide** under **New +** and
   fill it out as described above. You cannot have more than eight slides—no one scrolls
   that far.
3. Sort the slides using the **↑** and **↓** arrows in the upper-right corner. The first slide
   is the one that appears when the page loads.
4. Make sure that **Seconds per Slide** is set to `5` (default).
5. **Apply**, save, and check the preview.

## Bringing a Single News Post to the Stage

1. Open the settings to launch the editor.
2. Click **New +** above the list and select **News Post**.
   An entry labeled **Post** will appear on the left.
3. Under **Channel**, select the news channel. Only then can you
   select the post.
4. Under **Post**, select the desired post. You can choose from
   the channel’s fifty most recent posts, with the newest ones listed first.
5. Check the **Preview** below: it shows the image, headline, and
   teaser exactly as the slide will appear later.
6. Optional: **Override the headline**, **display the teaser as a subheading**
   or change the **button label**. The destination of the
   button is always the post itself.
7. Optional: **Override the thumbnail**. The post image is cropped for the feed
   and doesn’t always include a prominent thumbnail.
8. **Apply**, save, and check the preview.

## Show all posts from a channel

1. Open the settings to access the editor.
2. Click **New +** above the list and select **News Channel**.
   An entry labeled **Channel** appears on the left.
3. Under **Channel**, select the news channel.
4. Set the **Number of Slides** (default `3`, maximum eight).
5. Select the **Order**: `Newest first` or `Oldest first`.
6. Set **Filters** as needed:
   - **Featured posts only** — limited to what is pinned in the News
     section.
   - **Only posts with images** — enabled by default. Without an image,
     the slide would be nothing more than a dark area with text.
   - **Keywords** — separate multiple keywords with commas; a post qualifies if it
     contains any one of them.
7. Check the **Preview**: it shows exactly the posts that the filters
   allow through. If it remains empty, the filters are too restrictive.
8. **Apply**, save, and check the preview.

The entry counts as **one** in the list but includes multiple slides.
In total, the stage never displays more than eight slides; anything beyond that
is omitted.

## Set an Image for Portrait Orientation

1. Upload a portrait-oriented crop of the same image to the
   media library.
2. Select the relevant slide in the editor.
3. Under **Image for Portrait Orientation**, click **Select Image**.
4. Click **Apply**, save, and preview in a narrow window or on your
   phone.

## Making Changes Later

1. Open the widget’s settings; the editor will open with the
   existing entries.
2. Select the entry you want to change on the left. The label above the title indicates
   which type it is: **Slide**, **Post**, or **Channel**.
3. Edit the fields on the right. Clicking **Duplicate** creates a copy of the
   selected entry right next to it; **Delete** removes it. The arrows,
   **Duplicate**, and **Delete** apply equally to all three types.
4. **Apply** saves the changes to the widget—only then will
   saving the page take effect.

## If something isn’t working

1. **The stage remains blank.** At least one image is missing: Slides without an image
   are not displayed. Open the editor and check each entry for
   an image—for news entries, check the preview.
2. **The image doesn’t span the full width.** Is the widget in a
   column next to other content? If so, place it on its own line.
   Otherwise, check whether **Show full width** is enabled
  .
3. **The text isn’t aligned with the guide line.** This may be due to a
   different content width on the page. Report the issue with the
   page URL—the stage adjusts to the width reported by the page itself
  .
4. **Instead of the editor, you see a “Entries” text field with JSON.** The
   editor was unable to load. Reload the dialog. Do not edit
   the text manually.
5. **The channel selection remains empty, and a text field for an
   ID appears.** The list of news channels was unavailable. Reload the
   dialog; if that doesn’t help, enter the channel’s ID. It
   can be found in the channel’s URL in the CMS.
6. **A news slide is missing from the page.** The post has been deleted,
   moved, or is not visible to the reader. The remaining slides
   are not affected. Check the entry in the editor’s preview.
7. **A channel entry displays fewer slides than set.** The filters are
   too restrictive—usually **Only posts with images** for a channel without images—or
   the stage is already full with eight slides.
