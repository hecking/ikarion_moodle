module Updaters
  class StudentModel
    attr_accessor :student

    def initialize(params)
      @student = params[:student]
      concepts_list = params[:concepts_list]
      score = calculate_agregated_score

      self.student.posts_scores = Hash[concepts_list.zip(score)]
      self.student.save
    end

    private

      def calculate_agregated_score
        scores = get_posts_scores
        if scores.size > 1
          Matrix[*scores].transpose.to_a.map {|v| v.reduce(:+)}
        else
          scores
        end
      end

      # Returns an Array of Arrays containing all the post scores.
      # { Concept => score }
      def get_posts_scores
        self.student.posts.map { |post| post.scores}
      end

  end
end
