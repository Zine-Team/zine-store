---
title: Markdown
layout: layouts/markdown.njk
---

GitHub uses its own Markdown processor, which is a variant of the CommonMark specification. This means that while it supports most of the standard Markdown syntax, there are some GitHub-specific extensions and features.
You can use Markdown syntax, along with some additional HTML tags, to format your writing on GitHub, in places like
repository READMEs and comments on pull requests and issues.

For more examples, see the [GitHub Flavored Markdown Spec](https://github.github.com/gfm/).

See [Writing on GitHub](https://docs.github.com/en/get-started/writing-on-github) for more details.

## Basic writing and formatting syntax

### Headings

To create a heading, add one to six # symbols before your heading text. The number of # you use
will determine the hierarchy level and typeface size of the heading.

###### This is the smallest heading

### Styling text

**This text is bold**
**This text is bold and [this](/) is a link**

_This text is italic_

~~This text is strikethrough~~

**This text is bold with _nested italic_**

**_This text is bold and italic_**

This text is <sub>subscript</sub>

This text is <sup>superscript</sup>

This text is <ins>underlined</ins>

This is a <kbd>keyboard shortcut</kbd>

### Quoting text

> This is a blockquote.

### Empty Quotes

>

### Quoting code

This is a `inline code` example.

```python3
print("This is a Python3 code block")
```

### Supported color models

In issues, pull requests, and discussions, you can call out colors within a sentence by using backticks. A supported
color model within backticks will display a visualization of the color.

The background color is `#ffffff` for light mode and `#000000` for dark mode, also `rgb(9, 105, 218)`.

### Links

This site was built using [GitHub Pages](https://pages.github.com/).

### Section links

You can link to a section of a page by using the section's heading text, with spaces replaced by hyphens and all
lowercase.

Link to the previous section: [Links](#links).

### Relative links

Link to a file in the same repository: [README.md](./README.md).

### Custom anchors

Some body text of this section.

<a name="my-custom-anchor-point"></a>
Some text I want to provide a direct link to, but which doesn't have its own heading.

(… more content…)

[A link to that custom anchor](#my-custom-anchor-point)

### Line breaks

To create a line break, end a line with two or more spaces, and then type return.

Line one.

Line two.

or use the HTML `<br>` tag.

Line one.<br/>Line two.

### Images

#### Hosted images

![This is a hosted image](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)

### Lists

You can make an unordered list by preceding one or more lines of text with -, \*, or +.

- George Washington

* John Adams

- Thomas Jefferson

To order your list, precede each line with a number.

1. James Madison
2. James Monroe
3. John Quincy Adams

### Nested Lists

1. First list item
   - First nested list item
     - Second nested list item

### Ignoring Markdown formatting

You can tell GitHub to ignore (or escape) Markdown formatting by using \ before the Markdown character.

Let's rename \*our-new-project\* to \*our-old-project\*.

### Adding an image to suit your visitors

#### Example of a responsive image

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/25423296/163456776-7f95b81a-f1ed-45f7-b7ab-8fa810d529fa.png">
  <source media="(prefers-color-scheme: light)" srcset="https://user-images.githubusercontent.com/25423296/163456779-a8556205-d0a5-45e2-ac17-42d089e3c3f8.png">
  <img alt="Shows an illustrated sun in light mode and a moon with stars in dark mode." src="https://user-images.githubusercontent.com/25423296/163456779-a8556205-d0a5-45e2-ac17-42d089e3c3f8.png">
</picture>

### Adding a table

Hi, I'm Mona. You might recognize me as GitHub's mascot.

| Rank | Languages  |
| ---: | ---------- |
|    1 | JavaScript |
|    2 | Python     |
|    3 | SQL        |

### Adding a collapsed section

<details>
<summary>My top languages</summary>

| Rank | Languages  |
| ---: | ---------- |
|    1 | JavaScript |
|    2 | Python     |
|    3 | SQL        |

</details>

### Adding a divider

---

### Adding a video

We can't use an `<iframe>` tag to embed a video, but we can link to a video on YouTube or another site and display a
thumbnail image that links to the video.

[![Watch the video](https://img.youtube.com/vi/T-D1KVIuvjA/maxresdefault.jpg)](https://youtu.be/T-D1KVIuvjA)

### Adding a quote

#### Example of a quote

> If we pull together and commit ourselves, then we can push through anything.

— Mona the Octocat

## Work with advanced formatting

### Creating a table

| Left-aligned | Center-aligned | Right-aligned |
| :----------- | :------------: | ------------: |
| git status   |   git status   |    git status |
| git diff     |    git diff    |      git diff |
| Pipe         |       \|       |               |

| Command      | Description                                        |
| ------------ | -------------------------------------------------- |
| `git status` | List all _new or modified_ files                   |
| `git diff`   | Show file differences that **haven't been** staged |

### Creating a collapsed section

<details open>

<summary>Tips for collapsed sections</summary>

#### You can add a header

You can add text within a collapsed section.

You can add an image or a code block, too.

```ruby
   puts "Hello World"
```

</details>

### iframe tag

The `<iframe>` tag is not supported in GitHub Markdown. You can link to an external site instead.

<iframe width="100%" style="aspect-ratio: 16 / 9"
src="https://www.youtube.com/embed/T-D1KVIuvjA?si=VdBgta3ALERtul4u" title="YouTube
video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;
picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
