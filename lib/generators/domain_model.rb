module Generators
  # Process the input file (Concepts) and creates an ActiveRecord Domain Model,
  # which also contains a serialized Semantic Model.
  class DomainModel < Base
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
      resources = process_concepts
      # Creates Semantic Model
      domain_model = Models::DomainModel.new(resources)
      # Serializes model to JSON
      json_domain = ActiveSupport::JSON.encode(domain_model)
      # Stores in DB
      Domain.create(
        course_id: course_id,
        learning_resources: resources,
        concepts_list: domain_model.node_names,
        model: json_domain)
    end
  end
end
