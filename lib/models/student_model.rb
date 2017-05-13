module Models
  # Represents the Studen Model for a given set of accessed learning resources.
  # Transforms them into an Ontology Map (Weighted Graph)
  #
  class StudentModel < SemanticModel
    def initialize(resources)
      super(*resources.values)
    end

  end
end
