module Scoring
  class MaximumTfNormalization < ScoreBase
    attr_accessor :score_matrix, :group_score
    def initialize(collection, query)
      super(collection, query)
      @score_matrix = calculate_score_matrix
      @group_score = calculate_group_score
    end

    # Transforms the tf_matrix into 0/1 values
    def calculate_score_matrix
      tf_matrix.to_a.map do |v|
        v.map { |tf_t| tf_t > 0 ? 1 : 0 }
      end
    end

    # Reduces the tf_matrix into a single vector by adding all the columns and
    # then dividides by the avg number
    def calculate_group_score
      tf_vector = tf_matrix.transpose.to_a.map { |v| v.reduce(&:+) }
      tf_max = tf_vector.max
      tf_vector.map { |tf_t| tf_t.to_f / tf_max }
    end

  end
end
