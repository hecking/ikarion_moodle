module Generators
  # Base class for processing input files and creating their respective
  # Models.
  class Base
    attr_reader :uploader, :course_id, :mounted_file
    def initialize(params)
      @course_id = params[:course_id]
      @uploader = params[:uploader]
      @mounted_file = uploader.mounted_as

      # Defines a proxy method to process data file using InputReader
      # through dynamic dispatch
      self.class.send(:define_method, "process_#{mounted_file}") do
        unless uploader.url.nil?
          url = "#{Dir.pwd}/public#{uploader.url}"
          return InputReader::send(mounted_file, url)
        end
      end
    end
  end
end
