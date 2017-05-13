module Generators
  # Process the input file (StudentGeneratedContent) and creates an ActiveRecord Group Model,
  # which also contains a serialized Semantic Model.

  # TODO: Improve scoring method
  class GroupModel < Base
    attr_accessor :resources, :posts, :scores
    def initialize(params)
      super(params)
      @resources = process_student_generated_content
      #@posts = create_posts
      # Score posts
      # Only the post text is processed
      collection = resources.map { |post| post['content'] }
      # The list of Domain concepts is used as a query to score the posts
      query = Course.find_by(id: course_id).domain.concepts_list
      @scores = Scoring::MaximumTfNormalization.new(collection, query)

      create_posts
      create_group
    end


    private

      # Creates a Post model and saves into the DB frm the student_generated_content.
      # Every Post is associated to its corresponding Student.
      def create_posts
        scores = self.scores.score_matrix.to_a
        self.resources.each_with_index do |post_data, i|
          # FIX: Student id nil
          student = Student.find_by(
            original_id: post_data['student_id'],
            course_id: course_id)
          post_data['scores'] = scores[i]
          student.posts.create(post_data)
        end
      end

      # Creates Group Model
      def create_group
        Group.create(course_id: self.course_id, score: self.scores.group_score)
      end
  end
end
