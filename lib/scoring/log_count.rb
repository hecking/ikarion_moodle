module Scoring
  class LogCount < ScoreBase
    attr_accessor :score_matrix, :group_score
    def initialize(collection, query)
      super(collection, query)
      @score_matrix = calculate_score_matrix
      @group_score = calculate_group_score
    end

    # Transforms the tf_matrix into a score matrix using log normalization
    # as a Weighting Scheme
    def calculate_score_matrix
      # Esto no funciona :(
      tf_matrix.to_a.map do |v|
        v.map { |tf_t| tf_t > 0 ? (1 + Math.log10(tf_t)) : 0 }
      end
    end

    # Reduces the matrix into a single vector by adding all the columns and
    # then dividides by the avg number
    def calculate_group_score
      score_matrix.transpose.to_a.map {|v| v.reduce(&:+).to_f / v.size}
    end

  end
end