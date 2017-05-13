module Generators
  # Process the input file (Activity log) and creates an ActiveRecord Student Model,
  # which also contains a serialized Semantic Model.
  class StudentModel < Base
    def initialize(params)
      # `params` contains:
      # course_id: Integer
      # uploader: CarrierWaveUploader
      # Invoke ancestor initializer
      super(params)
      create
    end

    # Invokes the file processing and Model creation process
    def create
      student_data = process_activity_log
      student_data.each do |key, value|
        Student.create(
          course_id: course_id,
          original_id: key,
          accessed_learning_resources: value)
      end
    end
  end
end
