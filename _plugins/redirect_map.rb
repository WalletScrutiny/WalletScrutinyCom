# frozen_string_literal: true

# Writes /redirects.map, an nginx `map` body, from every page's and document's
# `redirect_from` front matter. This replaces jekyll-redirect-from: instead of
# one "Redirecting…" stub page (HTTP 200 + meta refresh) per old URL, nginx
# answers a real 301 from an in-memory hash table.
#
# nginx side (see external/configs/webserver_nginx/redirects-maps.conf):
#   map $uri $ws_key { ~^(.*?)/?$ $1/; }                          # normalise trailing slash
#   map $ws_key $ws_redirect { default ""; include <webroot>/redirects.map; }
#   if ($ws_redirect) { return 301 $ws_redirect; }               # in the server block
#
# Rules:
# - every key gets a trailing slash so it matches the normalised $uri;
# - nginx map keys are case-insensitive, so sources that differ only by case
#   are emitted as case-sensitive regex keys instead of plain strings;
# - the same source pointing at two different targets fails the build, because
#   nginx would reject the file at reload time and the deploy would go live
#   with a stale map.
module Jekyll
  class RedirectMapGenerator < Generator
    safe true
    priority :lowest

    OUTPUT = 'redirects.map'

    def generate(site)
      entries = collect(site)
      site.pages << MapPage.new(site, OUTPUT, render(entries))
      Jekyll.logger.info 'RedirectMap:', "#{entries.size} redirects written to /#{OUTPUT}"
    end

    private

    def collect(site)
      targets = {} # source => target
      items = site.pages + site.collections.values.flat_map(&:docs)
      items.each do |item|
        Array(item.data['redirect_from']).each do |from|
          source = normalise(from.to_s)
          next if source.empty?
          target = normalise(item.url)
          if targets.key?(source) && targets[source] != target
            raise Jekyll::Errors::FatalException,
                  "redirect_from #{source} points at both #{targets[source]} and #{target} (#{item.relative_path})"
          end
          targets[source] = target
        end
      end
      targets.sort.to_a
    end

    def normalise(path)
      path = path.strip
      path = "/#{path}" unless path.start_with?('/')
      path = "#{path}/" unless path.end_with?('/')
      path
    end

    def render(entries)
      by_fold = entries.group_by { |source, _| source.downcase }
      lines = entries.map do |source, target|
        if by_fold[source.downcase].size > 1
          # case-only collision: `~` regex keys are case-sensitive, plain keys are not
          "\"~^#{Regexp.escape(source)}$\" \"#{target}\";"
        else
          "\"#{source}\" \"#{target}\";"
        end
      end
      "#{lines.join("\n")}\n"
    end
  end

  # A plain text output file with no layout, no Liquid and no front matter.
  class MapPage < PageWithoutAFile
    def initialize(site, name, content)
      super(site, site.source, '/', name)
      self.content = content
      self.data = { 'layout' => nil, 'sitemap' => false, 'render_with_liquid' => false }
    end
  end
end
