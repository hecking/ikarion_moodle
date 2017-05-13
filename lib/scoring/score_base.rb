require 'matrix'
# Contains scoring related classes.
module Scoring
  # Base class for scoring methods. Allows for the implementation of different
  # strategies
  # @param collection [Posts] - collection of posts to be scored
  # @param query [Array of String] - Words to search
  class ScoreBase
    attr_accessor :tf_matrix, :counter
    attr_reader :collection, :query

    def initialize(collection, query)
      @collection = collection
      # Word counter with stemming and multi-word partial matches
      @counter = Counter::Words.new(query)
      @tf_matrix = calculate_tf_matrix
    end

    # Transform text into a vector containing the number of ocurrences of
    # a query.
    def to_vsm(post)
      counter.count(post).values
    end

    # Returns a matrix containing the number of occurrences of each term
    # across the collection of posts.
    def calculate_tf_matrix
      vector_scores = collection.map { |post| to_vsm(post) }
      Matrix[*vector_scores]
    end

    # Abstract method to implement different weighting schemes to transform
    # the tf_matrix
    def calculate_score_matrix(collection)
      raise NotImplementedError, "Instance a subclass "
    end

    # Abstract method to implement different weighting schemes to obtain the
    # total collection score
    def calculate_group_score(collection)
      raise NotImplementedError, "Instance a subclass "
    end

  end
end


