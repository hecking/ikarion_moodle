require 'matrix'
# Base Class for the Domain and User models. Transforms a collection of
# dictionaries (pairs concept-score) into an Affiliation Network.
#
# There are no attributes to avoid polluting the Semantic Model with
# redudant data.
#
module Models

  class SemanticModel < Graph
    def initialize(*resources)
      resources = *resources
      concepts = collect_concepts(resources)
      # Calculates the submatrix M
      matrix = Matrix.rows(resources.map { |resource| generate_row(concepts, resource) })
      super(concepts, normalize(concepts_matrix(matrix)))
      #super(concepts, normalized_concepts_matrix(matrix))
    end

    private

      # Extract concepts (order of appearance)
      def collect_concepts(resources)
        resources.map(&:keys).flatten.uniq
      end

      # Generates a row of the matrix. The values correspond to the previous scores
      # from the learning resources or zero, in case a concept is not present,
      def generate_row(concepts, resource)
        concepts.map { |key| resource[key] || 0 }
      end

      # Calculates the product of M^T * M, rounding to 3 digits.
      def concepts_matrix(matrix)
        (matrix.transpose * matrix).round(3)
      end

      #def resources_matrix
      #  matrix * matrix_t
      #end

      # Standard normalization formila
      def normalize_value(x, min, max)
        ( x - min ) / (max - min )
      end

      # Applies nomalization formula to the matrix
      def normalize(matrix)
        max = matrix.max
        min = matrix.min
        matrix = matrix.map { |x| normalize_value(x, min, max).round(3) }
        # Stops any value in the diagonal from being 0
        matrix.each_with_index(:diagonal) do |item, i|
          matrix.send(:[]=, i, i, (item + 0.1) ) if item == 0
        end
      end


      # DEPRECATED


      # Calculates the product of M^T * M and multiplies diagonal by normalizing
      # factor.
      def normalized_concepts_matrix(matrix)
        resources_count = matrix.row_count
        matrix_t = matrix.transpose
        factors = calculate_normalizing_factors(matrix_t, resources_count)
        product = (matrix_t * matrix).round(3)
        multiply_diagonal(product, factors)
        product
      end

      # Takes a matrix and multiplies its diagonal by a given vector
      def multiply_diagonal(matrix, vector)
        vector.each_with_index do |item, i|
          # Matrix are immutable by default, and setting an element is a private
          # operation. This line overrides that behaviour
          matrix.send(:[]=, i, i, (matrix[i,i] * item).round(3))
        end
      end

      # Counts the number of times a concept appears in a column of the submatrix
      # M. For ease of programming, this function operates over M^T (rows instead
      # of columns)
      def count_concepts_ocurrences(transposed_matrix)
        transposed_matrix.to_a.map { |v| v.count { |i| i > 0} }
      end

      # For each concept, its normalizing factor equals
      # score * # ocurrences * (1 / # resources^2 )
      def calculate_normalizing_factors(transposed_matrix, resources_count)
        ocurrences = count_concepts_ocurrences(transposed_matrix)
        ocurrences.map { |x| x.to_f / resources_count**2 }
      end
  end
end
