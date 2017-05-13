require 'csv'

# TODO: Refactor this logic into components?
# Logic outside of the Model.

# Defines the relationships between model.
# A course is created through a set of input files:
# - Concepts: List of manually tagged 3-uples <ResourceID, Concept, Score>
# - ActivityLog: List of pairs <StudentId,ResourceID>
# - StudentGeneratedContent: List of 3-uples <PostID, StudentID, Content>
# containing forum posts
class Course < ActiveRecord::Base
  # Relationships
  belongs_to :user
  has_one :domain, dependent: :destroy
  has_one :group, dependent: :destroy
  has_many :students, dependent: :destroy

  # Uploaders
  default_scope -> { order(created_at: :desc) }
  mount_uploader :concepts, ConceptsUploader
  mount_uploader :activity_log, ActivityLogUploader
  mount_uploader :student_generated_content, StudentGeneratedContentUploader

  # Validations
  validates :user_id, presence: true
  validates :name, presence: true, length: { minimum: 6, maximum: 140 }
  validates :concepts, presence: true

  #after_save :process_concepts, if: Proc.new { |course| !course.concept.url.nil? }
  after_save :create_domain
  after_save :create_students, unless: Proc.new { |course| course.activity_log.url.nil? }
  after_save :create_group, unless: Proc.new { |course| course.student_generated_content.url.nil? }
  after_save :update_domain, unless: Proc.new { |course| course.group.nil?}
  after_save :update_students
  after_save :create_messages
  # Calls Domain Model Generator
  def create_domain
    Generators::DomainModel.new(course_id: self.id, uploader: self.concepts)
  end

  # Calls Student Model Generator
  def create_students
    Generators::StudentModel.new(course_id: self.id, uploader: self.activity_log)
  end

  # Calls Group Model Generator
  def create_group
    Generators::GroupModel.new(course_id: self.id, uploader: self.student_generated_content)
  end

  # Calls Domain Updater
  def update_domain
    Updaters::DomainModel.new(domain: self.domain, group: self.group)
  end

  def update_students
    concepts_list = self.domain.concepts_list
    self.students.each do |student|
      Updaters::StudentModel.new(student: student , concepts_list: concepts_list)
    end
  end

  def create_messages
    # To avoid querying the db twice?
    domain_model = Models::DomainModel.from_json(self.domain.model)
    cc = Generators::ConceptCandidates.new(domain_model: domain_model)
    sc = Generators::StudentCandidates.new(
      students: self.students,
      concept_candidates: cc.candidates,
      domain_model: domain_model)
    # TODO: Refactor this couple of lines
    messages_info = sc.assign_candidates
    messages_info.each do |msg_info|
      Generators::Messages.new(
        msg_info: msg_info,
        course_id: self.id,
        domain: self.domain)
    end
  end

  def create_domain_graph
    domain_model = Models::DomainModel.from_json(self.domain.model)
    filename = "#{self.name}-#{self.id}"
    domain_model.to_image(filename)
  end
end
