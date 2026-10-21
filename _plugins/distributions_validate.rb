# Fails the build on a malformed `distributions:` list (see _includes/review/steps/distributions.html).
# Its values end up in links and in shell commands users copy, so only safe shapes pass.
#
#   distributions:
#   - channel: flathub            # the store; only channels in CHANNELS are accepted
#     id: network.bisq.Bisq       # the package's ID in that store
#     publisher: community        # developer | community, checked against the store by
#                                 # scripts/checkDistributionPublishers.mjs
#     type: repackage             # repackage | extra-data | source
#     wraps: Bisq-64bit-*.deb     # the official file a repackage or extra-data package uses
module Jekyll
  module DistributionsValidate
    # A channel is accepted only once it has a template, trust text and a publisher check.
    # AUR, Homebrew, winget, Snap, Debian and Nix are planned, each with its own ID pattern.
    CHANNELS = {
      # Flatpak app ID: at least three dot-separated parts of [A-Za-z0-9_], not starting
      # with a digit; only the last part may contain '-'.
      'flathub' => /\A[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)+\.[A-Za-z_][A-Za-z0-9_-]*\z/
    }.freeze
    # File name glob with at most one '*', starting with a letter or digit, so the part
    # before '*' is never empty and never looks like a command-line option.
    WRAPS = /\A[A-Za-z0-9][A-Za-z0-9._+-]*(\*[A-Za-z0-9._+-]*)?\z/
    PUBLISHERS = %w[developer community].freeze
    TYPES = %w[repackage extra-data source].freeze
    KEYS = %w[channel id publisher type wraps].freeze

    def self.entry_errors(d)
      return ['must be a mapping'] unless d.is_a?(Hash)
      errs = []
      unknown = d.keys.map(&:to_s) - KEYS
      errs << "unknown keys #{unknown.join(', ')}" unless unknown.empty?
      channel = d['channel']
      id_re = CHANNELS[channel]
      if id_re.nil?
        errs << "channel #{channel.inspect} is not supported (#{CHANNELS.keys.join(', ')})"
      else
        id = d['id']
        errs << "id #{id.inspect} is not a #{channel} ID" unless id.is_a?(String) && id.length <= 255 && id_re.match?(id)
      end
      errs << "publisher must be one of #{PUBLISHERS.join(', ')}" unless PUBLISHERS.include?(d['publisher'])
      errs << "type must be one of #{TYPES.join(', ')}" unless TYPES.include?(d['type'])
      wraps = d['wraps']
      if d['type'] == 'source'
        errs << 'wraps is only for repackage and extra-data' unless wraps.nil?
      elsif !(wraps.is_a?(String) && wraps.length <= 100 && WRAPS.match?(wraps))
        errs << "wraps #{wraps.inspect} is not a safe file name glob"
      end
      errs
    end

    def self.errors(list)
      return ['must be a list'] unless list.is_a?(Array)
      errs = list.each_with_index.flat_map do |d, i|
        entry_errors(d).map { |e| "[#{i}] #{e}" }
      end
      seen = list.select { |d| d.is_a?(Hash) }.map { |d| [d['channel'], d['id']] }
      dupes = seen.select { |k| seen.count(k) > 1 }.uniq
      errs + dupes.map { |c, id| "#{c} #{id} is listed twice" }
    end
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  problems = site.collections.values.flat_map(&:docs).filter_map do |doc|
    errs = []
    errs << 'flathub: is now an entry in distributions:' if doc.data.key?('flathub')
    errs += Jekyll::DistributionsValidate.errors(doc.data['distributions']) if doc.data.key?('distributions')
    "#{doc.relative_path}: distributions #{errs.join('; ')}" unless errs.empty?
  end
  raise Jekyll::Errors::FatalException, problems.join("\n") unless problems.empty?
end
