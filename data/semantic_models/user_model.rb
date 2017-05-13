# Represents the User Model based on a set of accessed learning resources.
# Transforms them into an Ontology Map (Weighted Graph)
#
# @attr_reader [String] UserID - To identify User Model
# @attr_reader [Array of Strigs] - To identify accessed resources
#
class UserModel < SemanticModel
  attr_reader :UserID
  attr_reader :resourcesIDs

  def initialize(userID, resources)
    @userID = userID
    @resourceIDs = resources.keys
    super(*resources.values)
  end
end
