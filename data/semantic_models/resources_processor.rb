require 'matrix'
#require './mutable_matrix'

module ResourcesProcessor

  class ScoreCalculator
    attr_reader :resources, :keywords, :matrix, :matrix_t

    def initialize(*resources)
      @resources = *resources
      @keywords = collect_keywords
      @matrix = Matrix.rows(resources.map { |resource| generate_row(resource) })
      @matrix_t = matrix.transpose
    end

    # Extract keywords (order of appearance)
    def collect_keywords
      resources.map(&:keys).flatten.uniq
    end

    def generate_row(resource)
      keywords.map { |key| resource[key] || 0 }
    end

    def keywords_matrix
      matrix_t * matrix
    end

    def resources_matrix
      matrix * matrix_t
    end
  end


  # Public API

  def self.process(*resources)
    @@sc = ScoreCalculator.new(*resources)
  end

  def self.score_keywords(ndigits = 3)
    @@sc.keywords_matrix.round(ndigits)
  end

  def self.score_resources(ndigits = 3)
    @@sc.resources_matrix.round(ndigits)
  end

  def self.keywords
    @@sc.keywords
  end

  def self.diagonal
    @@sc.diagonal_scores
  end
end
