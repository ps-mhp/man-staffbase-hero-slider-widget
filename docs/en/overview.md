# Hero Slider

The Hero Slider is the **stage** at the top of a page: a large image spanning the
full width of the window, with a headline above it, optionally a subheading, and
a button. It is modeled after the stage on man.eu.

If you create multiple slides, you’ll get a carousel: the slides fade
into one another, and you can navigate using the arrows and the dots in the lower-left corner.

You don’t have to update a slide manually. In addition to your own slides, the
stage can also display **posts from the news**:

- **News post** — a specific post as a single slide. The image, headline,
  and teaser come from the post, and the button links to it.
- **News channel** — an entire channel, with one slide per post. You can configure how many,
  in what order, and according to which filters. When a new post appears in
  the channel, it automatically appears on the stage without any further action.

The three types appear in the same list and can be freely mixed and
sorted—for example, a separate slide as the lead, followed by the three most recent
articles from a channel.

## What Readers See

- The image spans the full width of the window—even if the page
  itself has a narrower content column.
- The stage is positioned **flush at the top**: If the page has a breadcrumb trail,
  the stage appears immediately below it; if it doesn’t, it connects directly to the
  menu. The empty white strip that the page would otherwise leave above the first
  piece of content is omitted.
- The **text remains aligned with the page’s baseline**: it begins on the same
  vertical line as the header, the menu, and the text below the stage. It
  is explicitly not aligned with the edge of the image.
- The text is positioned at the bottom left, on a dark gradient that fades from bottom to
  top. On wide screens, a second gradient is added from the left
  to ensure that light-colored text remains legible against a light background.
- For multiple slides: arrows on the left and right, with a line between them for each slide.
  The line for the current slide is red.
- The transition continues as long as the mouse hovers over the stage or the focus is
  on it. On a phone, you swipe; the arrows are hidden there.
- **On a phone** (less than 768 pixels wide), only the headline appears
  on the image, up to four lines long; anything beyond that ends with “...”.
  The subtitle and button are hidden there—instead, tapping
  anywhere on the slide takes you to the button’s destination. For screen readers,
  the button’s label remains the name of this link. If a slide has no destination, it
  cannot be tapped.
- Users who have “Reduce Motion” enabled in their operating system will not see
  any transitions or fade effects—only the controls.
- Slides from the News section look like any other slide. It is not apparent from the outside
  that the content comes from a news article.

## What You See in the CMS Editor

The editor displays the stage within the content column, meaning it’s **narrower than on
the published page**. How far the image actually extends and where the text
is positioned can only be assessed in the preview or on the published page. Always check there at least once in a narrow
window width—that’s where the portrait-orientation cropping takes effect.
