# jekyll-dev

Using livereload for gem-based Jekyll theme development.

## Installation

```shell
npm install -g jekyll-dev
```

## Usage & Workflow

1. Create a jekyll site and a theme:

   ```shell
   ## create a site named jekyll-site
   jekyll new jekyll-site

   ## create a theme named jekyll-theme-sample
   jekyll new-theme jekyll-theme-sample
   ```

2. Add the theme to your site's `Gemfile`

   ```ruby
   ## replace default theme `gem "minima", ...`
   gem "jekyll-theme-sample", :path => "../jekyll-theme-sample"
   ```

3. Add the following to your site's `_config.yml` to activate the theme:

   ```yaml
   ## replace default `theme: minima`
   theme: jekyll-theme-sample
   ```

4. Start to develop:

   ```shell
   cd jekyll-site
   jekyll-dev
   ```

   > Notice:
   > You may need to tweak your site and theme to solve some console errors. See `sample/` of this repository.

## License

MIT
