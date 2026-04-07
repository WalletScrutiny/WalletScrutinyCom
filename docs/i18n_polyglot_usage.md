# Multi-Language Support with Jekyll Polyglot

This site uses the `jekyll-polyglot` plugin to support multiple languages.

## Enable the feature

To enable the feature, you need to enable the Language Selector and add a new language to the list. Once enabled,
please also remove this section entirely.

### How to Enable the Language Selector

A language selector is already integrated in the navigation bar (masthead), but it's hidden until you decide to
enable the feature. To show it:

1. Open `_sass/_masthead.scss`
2. Find the `.language-selector` class (near the bottom of the file)
3. Change `display: none;` to `display: flex;`

```scss
/* Language Selector */
.language-selector {
  display: flex;  /* Change from 'none' to 'flex' to show the selector */
  align-items: center;
  list-style-type: none;
  ...
}
```

### Add a new language to the Polyglot list

1. Edit `_config.yml`
2. Search for the Polyglot section
3. Add the new language to the list, for example Spanish:

languages: ["en", "es"]

## How to Translate Content

There are two methods to translate content, depending on what you need to translate:

### Method 1: Translated Pages (for full pages)

Use this method when you need to translate entire pages with different content per language.

To create a translated page, use the same `permalink` and `page_id` in both files, and add the `lang` field:

**English version** (`_pages/about.md`):
```yaml
---
permalink: /about/
page_id: about
lang: en
---
```

**Spanish version** (`_pages/es/about.md`):
```yaml
---
permalink: /about/
page_id: about
lang: es
---
```

Polyglot will automatically generate:
- English: `http://localhost:4000/about/`
- Spanish: `http://localhost:4000/es/about/`

### Method 2: Translation Data Files (for includes and layouts)

Use this method when you need to translate strings, labels, or text snippets that appear across multiple pages (like navigation menus, buttons, placeholders, etc.).

Translation strings are stored in `_data/i18n/`:
- `_data/i18n/en.yml` - English translations
- `_data/i18n/es.yml` - Spanish translations

In your includes, use:

```liquid
{% assign lang = page.lang | default: site.active_lang | default: site.default_lang %}
{% assign i18n = site.data.i18n[lang] %}

{{ i18n.nav_about }}
```

To add a new translation string:
1. Add a key to both `_data/i18n/en.yml` and `_data/i18n/es.yml`
2. Use it in your includes with `{{ i18n.your_key }}`

### Creating Translated Includes

You can also create language-specific includes:
- `_includes/header.html` - English
- `_includes/es/header.html` - Spanish

Then include them conditionally:

```liquid
{% assign lang = page.lang | default: site.active_lang | default: site.default_lang %}
{% include {{ lang }}/header.html %}
```

The selector uses JavaScript to detect the current language from the URL and switch between available options.

## Adding New Languages

1. Add the language code to `_config.yml`:
   ```yaml
   languages: ["en", "es", "fr"]
   lang_from_lang:
     en: "English"
     es: "Español"
     fr: "Français"
   ```

2. Create translation file: `_data/i18n/fr.yml`

3. Create translated pages with matching `permalink`, `page_id`, and `lang: fr`.
