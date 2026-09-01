# Hero Slider

The Hero Slider is the **stage** at the top of a page: a large image spanning the
full width of the window, with a headline above it, optionally a subheading, and
a button. It’s modeled after the stage on man.eu.

If you create multiple slides, you’ll get a carousel: the slides fade
into one another, and you can navigate using the arrows and the lines in the bottom left corner.

## What Readers See

- The image spans the full width of the window—even if the page
  itself has a narrower content column.
- The **text stays aligned with the page’s baseline**: it starts on the same
  vertical line as the header, menu, and the text below the stage. It
  is explicitly not aligned with the edge of the image.
- The text appears in the bottom-left corner, on a dark gradient that fades from bottom to
  top. On wide screens, a second gradient is added from the left
  to ensure that light-colored text remains readable against a light background.
- For multiple slides: arrows on the left and right, with a line between them for each slide.
  The line for the current slide is red.
- The transition continues as long as the mouse hovers over the stage or the focus is
  on it. On a phone, you swipe; the arrows are hidden there.
- Users who have “Reduce Motion” enabled in their operating system will not see
  the transition automatically or the fade effect—only the controls.

## What You See in the CMS Editor

The editor displays the stage within the content column, meaning it’s **narrower than on
the published page**. You can only assess how far the image actually extends and where the text
is positioned in the preview or on the published page. Always check there at least once at a narrow
window width—that’s where the portrait-orientation cropping takes effect.
