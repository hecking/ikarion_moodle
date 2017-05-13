class Domain < ActiveRecord::Base
  belongs_to :course

  def deserialize_model
    self.model = Models::StudentModel.from_json(self.model) if self.model.is_a? Hash
  end

  # Returns an Array containing the keys (resource IDs) of the learning resources
  # that contain a given concept.
  # ==== Example
  # self.learning_resources = {"1"=>{"a"=>1.0, "b"=>0.9}, "2"=>{"c"=>0.9}, "3"=>{"a"=>1.0}}
  # learning_resources_with("a") # => ["1","3"]
  def learning_resources_with(concept)
    self.learning_resources.each_with_object([]) do |(key, value), result|
      result << key if value.keys.include?(concept)
    end
  end
end
