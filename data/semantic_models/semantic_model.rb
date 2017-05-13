#require './resources_processor'
#require './graph'

# Base Class for the Domain and User models. Transforms a collection of
# dictionaries (pairs concept-score) into an Affiliation Network.
#
# There are no attributes to avoid polluting the Semantic Model with
# redudant data.
#
class SemanticModel < Graph

	def initialize(*resources)
    resources = *resources
    concepts = collect_concepts(resources)
    matrix = Matrix.rows(resources.map { |resource| generate_row(concepts, resource) })
    # @TODO Composition instead of inheritance
    super(concepts, concepts_matrix(matrix))
	end

  # Extract concepts (order of appearance)
  #
  def collect_concepts(resources)
    resources.map(&:keys).flatten.uniq
  end

  # Generates a row of the matrix. The values correspond to the previous scores
  # from the learning resources or zero, in case a concept is not present,
  def generate_row(concepts, resource)
    concepts.map { |key| resource[key] || 0 }
  end

  def concepts_matrix(matrix)
    (matrix.transpose * matrix).round(3)
  end

  #def resources_matrix
  #  matrix * matrix_t
  #end

end


