# Fails the build on a malformed `flathub:` block (see _includes/review/steps/flathub.html).
# Its values end up in links and in shell commands users copy, so only safe shapes pass.
module Jekyll
  module FlathubValidate
    # Flatpak app ID: at least three dot-separated parts of [A-Za-z0-9_], not starting with
    # a digit; only the last part may contain '-'.
    APP_ID = /\A[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)+\.[A-Za-z_][A-Za-z0-9_-]*\z/
    # File name glob with at most one '*', starting with a letter or digit, so the part
    # before '*' is never empty and never looks like a command-line option.
    WRAPS = /\A[A-Za-z0-9][A-Za-z0-9._+-]*(\*[A-Za-z0-9._+-]*)?\z/
    PUBLISHERS = %w[developer community].freeze
    TYPES = %w[repackage extra-data source].freeze
    KEYS = %w[appId publisher type wraps].freeze

    def self.errors(fh)
      return ['must be a mapping'] unless fh.is_a?(Hash)
      errs = []
      unknown = fh.keys.map(&:to_s) - KEYS
      errs << "unknown keys #{unknown.join(', ')}" unless unknown.empty?
      id = fh['appId']
      errs << "appId #{id.inspect} is not a Flatpak app ID" unless id.is_a?(String) && id.length <= 255 && APP_ID.match?(id)
      errs << "publisher must be one of #{PUBLISHERS.join(', ')}" unless PUBLISHERS.include?(fh['publisher'])
      errs << "type must be one of #{TYPES.join(', ')}" unless TYPES.include?(fh['type'])
      wraps = fh['wraps']
      if fh['type'] == 'source'
        errs << 'wraps is only for repackage and extra-data' unless wraps.nil?
      elsif !(wraps.is_a?(String) && wraps.length <= 100 && WRAPS.match?(wraps))
        errs << "wraps #{wraps.inspect} is not a safe file name glob"
      end
      errs
    end
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  problems = site.collections.values.flat_map(&:docs).filter_map do |doc|
    next unless doc.data.key?('flathub')
    errs = Jekyll::FlathubValidate.errors(doc.data['flathub'])
    "#{doc.relative_path}: flathub #{errs.join('; ')}" unless errs.empty?
  end
  raise Jekyll::Errors::FatalException, problems.join("\n") unless problems.empty?
end
