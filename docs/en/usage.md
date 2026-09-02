# Step by step

## Set up a stage with a picture

1. Place the image in the Staffbase media library beforehand. Landscape, at least
   1920 px wide; the stage cuts it to 21:9 depending on the width of the window or
   4:3 — the motif should therefore not reach the edges. 
2. Place the **Hero Slider** widget at the top of the page, in one row
   without any other widgets next to it. Is it in one column next to others
   content, it cannot run meaningfully over the full width. 
3. Open the widget's settings. The editor opens from
   himself. 
4. Click **New + ** above the list and select **Slide**. 
5. Under **Image**, click on the dashed area **Select Image** and
   select the image from the media library. Without an image, the slide will not
   shown. 
6. Under **Image description**, enter what can be seen. Leave the
   Field blank only if the image is purely decorative. 
7. Enter the **heading**. It is set in capital letters; until about
   It remains a single line for 24 characters. 
8. Optional: **Subline** and **Button**. The button will appear
   only if label **and** target are filled in. 
9. Click on **Apply**. 
10. Set **seconds per slide** to '0' — for a single slide, there is
    there is nothing to change. 
11. Save the page and preview it, once wide
    and once in a narrow window. 

## Create multiple slides

1. Open the settings and thus the editor. 
2. For each additional slide, under **New +**, select **Slide** and
   fill them in as above. More than eight slides are not possible — as far as scrolls
   Nobody. 
3. Sort using the **↑** and **↓** arrows in the top right. The first slide
   is the one that can be seen when the page loads. 
4. Check that **seconds per slide** is set to '5' (default). 
5. **Apply**, save, check in preview. 

## Bring a single news post to the stage

1. Open the settings and thus the editor. 
2. Click **New +** above the list and select **News Post**. 
   On the left, an entry with the brand **Post** appears. 
3. Under **Channel**, select the news channel. Only then can the
   Select post. 
4. Under **Post**, select the desired post. You can choose from
   the channel's fifty most recent posts, newest first. 
5. Check the **Preview** below: it shows image, headline and
   Teaser exactly as the foil looks later. 
6. Optional: **Overwrite headline**, **Show teaser as subheading** 
   or change the **label of the button**. The target of the
   Button is always the post itself. 
7. Optional: **Overwrite stage design**. The featured image is for the feed
   cut and does not always carry a high stage. 
8. **Apply**, save, check in preview. 

## Show all posts of a channel

1. Open the settings and thus the editor. 
2. Click **New +** above the list and select **News Channel**. 
   On the left, an entry appears with the brand **Channel**. 
3. Under **Channel**, select the News channel. 
4. Set **Number of Slides** (default '3', maximum eight). 
5. Select the **Order**: 'Newest First' or 'Oldest First'. 
6. Set **Filter** if necessary: 
   - **Featured posts only** — limited to what's in the News
     is pinned. 
   - **Only posts with image** — switched on by default. Without image would remain
     of the foil only a dark area with text. 
   - **Keywords** — separate several with a comma; one contribution is sufficient if it
     one of them. 
7. Check the **Preview**: it shows exactly the posts that have the filters
   . If it remains empty, the filters are too narrow. 
8. **Apply**, save, check in preview. 

The entry counts as **one** in the list, but comes with several slides. 
In total, the stage never shows more than eight slides; anything beyond that 
falls away at the back. 

## Store an image for portrait format

1. Place an upright cropped section of the same motif in the
   Media library. 
2. In the editor, select the affected slide. 
3. Under **Image for portrait format**, click on **Choose image**. 
4. **Apply**, save, and save in a narrow window or on the
   Check the phone. 

## Change afterwards

1. Open the widget's settings; the editor will open with the
   existing entries. 
2. Select the entry you want to change on the left. The marker above the title says, 
   which type it is: **Foil**, **Post** or **Channel**. 
3. Change the fields on the right. **Duplicate** creates a copy of the
   selected entry directly behind it, via **Delete** it disappears. Arrows, 
   Duplication and deletion apply equally to all three types. 
4. **Apply** writes the changes to the widget — only then does the
   saving the page. 

## When something doesn't work

1. **The stage remains empty.** At least one picture is missing: slides without a picture
   are not shown. Open the editor and check each entry for
   an image — in the case of news entries in the preview. 
2. **The image does not run over the full width.** If the widget is in a
   column next to other content? Then put it in its own row. 
   Otherwise, check if **Show over full width** is turned on
   . 
3. **The text does not sit on the vanishing line.** This can be due to a
   different content width of the page. Report the case with the
   Page address — the stage is based on the width that the page itself
   reports. 
4. **Instead of the editor, you'll see an "Entries" text box with JSON.**
   Editor could not mount. Reload the dialog. Edit
   not the text by hand. 
5. **The channel selector will remain blank and a text box will appear for a
   Identifier.** The list of news channels was not available. Download the
   dialog new; this does not help, enter the identifier of the channel. You
   is in the address of the channel in the CMS. 
6. **A news slide is missing from the page.** The post is deleted, 
   moved or not visible to the person reading. The remaining slides
   remain unaffected. Check the entry in the editor's preview. 
7. **A channel entry brings less foils than set.** The filters are
   too tight — usually **Only posts with picture** on a channel without pictures — or
   the stage is already full with eight slides.