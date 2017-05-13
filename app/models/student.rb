class Student < ActiveRecord::Base
  belongs_to :course
  has_many :posts, dependent: :destroy
  has_many :messages, dependent: :destroy

  validates :course_id, presence: true
  validates :original_id, presence: true
  validates :accessed_learning_resources, presence: true
  after_create :create_model#, unless: Proc.new { |student| student.accessed_learning_resources.size < 2 }

  def create_model
    learning_resources = get_learning_resources
    model = Models::StudentModel.new(learning_resources)
    self.model = ActiveSupport::JSON.encode(model)
    self.save
  end

  def deserialize_model
    self.model = Models::StudentModel.from_json(self.model) if self.model.is_a? Hash
  end

  def get_learning_resources
    # Is this optimal? Does one or two queries to the DB? Could it be done in one?
    course = Course.find_by(id: self.course_id)
    learning_resources = course.domain.learning_resources
    # Rails method. Doesn't accept array as argument
    learning_resources.slice(*self.accessed_learning_resources)
  end

  def knowledge_about(concept)
    if has_knowledge_about? concept
      self.model.nodes[concept].weight
    else
      0
    end
  end

  # identical to has_commented_set? but better naming
  # TODO: Change
  def select_commented(roots)
    roots.select { |root| has_commented?(root) }
  end

  # Use after deserialize model
  def has_knowledge_about?(concept)
    self.model.node_names.include?(concept)
  end

  # Returns true if the post_score for a concept is bigger than 0
  def has_commented?(concept)
    self.posts_scores[concept].to_f > 0
  end

  # Returns an array containing the concepts that have been commented by the student.
  def has_commented_set?(concepts)
    concepts.select { |c| has_commented?(c) }
  end

  def posts_scores_for(array)
    self.posts_scores.values_at(*array)
  end

end
