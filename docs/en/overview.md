# Hero Slider

The Hero Slider is the **stage** at the top of a page: a large image spanning the
full width of the window, with a headline above it, optionally a subheading, and
a button. It is modeled after the stage on man.eu.

If you create multiple slides, you’ll get a carousel: the slides fade
into one another, and you can navigate using the arrows and the dots in the lower left corner.

You don’t have to maintain a slide manually. In addition to your own slides, the
stage can also display **posts from the news**:

- **News post** — a specific post as a slide. The image, headline,
  and teaser come from the post, and the button links to it.
- **News channel** — an entire channel, with one slide per article. The number of slides,
  their order, and the filters applied can be customized. When a new article appears in
  the channel, it automatically appears on the stage without any further action.

The three types appear in the same list and can be freely mixed and
sorted—for example, a separate slide as the lead story, followed by the three most recent
articles from a channel.

## What Readers See

- The image spans the full width of the window—even if the page
  itself has a narrower content column.
- The **text stays aligned with the page’s baseline**: it begins on the same
  vertical line as the header, menu, and the text below the stage. It
  is explicitly not aligned with the edge of the image.
- The text is positioned at the bottom left, on a dark gradient that fades from bottom to
  top. On wide screens, a second gradient is added from the left
  to ensure that light-colored text remains readable against a light background.
- For multiple slides: arrows on the left and right, with a line between them for each slide.
  The line for the current slide is red.
- The transition continues as long as the mouse hovers over the stage or the focus is
  on it. On a phone, you swipe; the arrows are hidden there.
- Users who have “Reduce Motion” enabled in their operating system will not see
  the transition automatically or any fade effect—only the controls.
- Slides from the News section look like any other slide. It’s not apparent from the outside
  that the content comes from a news article.

## What You See in the CMS Editor

The editor displays the stage within the content column, meaning it’s **narrower than on
the published page**. You can only assess how far the image actually extends and where the text
is positioned in the preview or on the published page. Always check there at least once at a narrow
window width—that’s where the portrait-orientation cropping takes effect.
