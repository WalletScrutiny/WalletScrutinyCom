require 'digest'

# Content hash for a Sass stylesheet's URL, so browsers refetch it only when
# it changes: {{ 'assets/css/main.scss' | sass_digest }} -> "1a2b3c4d".
# Hashes the entry file plus every partial under the sass dir, since the
# compiled CSS doesn't exist yet when pages render.
module Jekyll
  module SassDigestFilter
    DIGESTS = {}

    def sass_digest(entry)
      DIGESTS[entry] ||= begin
        site = @context.registers[:site]
        sass_dir = File.join(site.source, site.config.dig('sass', 'sass_dir') || '_sass')
        partials = Dir.glob(File.join(sass_dir, '**', '*')).select { |f| File.file?(f) }.sort
        digest = Digest::SHA256.new
        ([File.join(site.source, entry)] + partials).each { |f| digest << f.delete_prefix(site.source) << "\0" << File.binread(f) }
        digest.hexdigest[0, 8]
      end
    end

    # The same for a plain file: {{ 'assets/js/x.js' | file_digest }} -> "1a2b3c4d".
    def file_digest(path)
      DIGESTS[path] ||= Digest::SHA256.file(File.join(@context.registers[:site].source, path)).hexdigest[0, 8]
    end
  end
end

# jekyll serve rebuilds in the same process
Jekyll::Hooks.register :site, :after_reset do
  Jekyll::SassDigestFilter::DIGESTS.clear
end

Liquid::Template.register_filter(Jekyll::SassDigestFilter)
