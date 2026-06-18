# frozen_string_literal: true

module Jekyll
  module DevSkipRedirects
    def self.clear_redirects!(site)
      site.pages.each { |page| page.data.delete('redirect_from') }

      site.collections.each_value do |collection|
        collection.docs.each { |doc| doc.data.delete('redirect_from') }
      end
    end
  end
end

Jekyll::Hooks.register :site, :post_read do |site|
  next unless site.config['environment'] == 'development'
  next unless site.config.fetch('dev_skip_redirects', false)

  Jekyll::DevSkipRedirects.clear_redirects!(site)
  Jekyll.logger.info 'DevSkipRedirects:', 'redirect_from cleared for all documents'
end
