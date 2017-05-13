require 'csv'

# @TODO: Sanitise input. Is nput correct?
# @TODO: Refactor CSV reading method. Block as an argument?
include CoreExtensions

# Namespace for methods that handle CSV processing.
module InputReader
  # Reads list of Concepts and Scores.
  # Expected format:
  #   ResourceId;Concept;Score
  # @example Process a file
  # ResourceId;Concept;Score
  # 1;purge;0.9
  # 1;war;0.7
  # 2;purge;0.3
  # 2;stalin;0.6
  # 3;stalin;0.6
  # InputReader::learning_resources('concepts.csv')
  # =>{"1"=>{"purge"=>"0.9", "war"=>"0.7"}, "2"=>{"purge"=>"0.3", "stalin"=>"0.6"}, "3"=>{"stalin"=>"0.6"}}
  # @return Hash of hashes
  def self.concepts(filename)
    resources = {}

    CSV.foreach(filename, headers: :first_row, col_sep: ';') do |row|
      if !row.fields.empty?
        res = row.field('ResourceId')
      if !resources.key?(res)
        resources[res] = {}
      end
      resources[res][row.field('Concept')] = row.field('Score').to_f
      end
    end
    resources
  end

  def self.student_generated_content(filename)
    posts = []
    CSV.foreach(filename, headers: :first_row, col_sep: ';') do |row|
      post_data = {}
      post_data["original_id"] = row.field('PostId')
      post_data["student_id"] = row.field('StudentId')
      post_data["content"] = row.field('Content')
      posts << post_data
    end
    posts
  end

  def self.activity_log(filename)
    user_models = {}
    CSV.foreach(filename, headers: :first_row, col_sep: ';') do |row|
      user_models.value_in_array(row.field('StudentId'), row.field('ResourceId'))
    end
    user_models
  end
end
