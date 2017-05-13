# Represents the Domain Model for a given set of learning resources.
# Transforms them into an Ontology Map (Weighted Graph)
#
# @attr_reader [String] name - To identify Domain Model
# @attr_reader [Array of] name - To identify Domain Model
#
class DomainModel < SemanticModel
  attr_reader :resourcesIDs

  def initialize(resources)
    super(*resources.values)
  end
end
