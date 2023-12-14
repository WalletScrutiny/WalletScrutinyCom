module Jekyll
  module ExceptionFilter
    def raise_error(msg)
    	bad_file = @context.registers[:page]['path']
    	err_msg = "WARNING: On #{bad_file}: #{msg}\n"
      print err_msg
      # raise err_msg
    end
  end
end

Liquid::Template.register_filter(Jekyll::ExceptionFilter)