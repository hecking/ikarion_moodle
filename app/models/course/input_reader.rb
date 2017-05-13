require 'csv'

# @TODO: Sanitise input. Is nput correct?
# @TODO: Refactor CSV reading method. Block as an argument?
class Course
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
    def self.learning_resources(filename)
      resources = {}

      CSV.foreach(filename, :headers => :first_row, :col_sep => ';') do |row|
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

    def self.user_generated_content(filename)
      content = []
      CSV.foreach(filename, :headers => :first_row, :col_sep => ';') do |row|
        content << row.field('Content')
      end
      content
    end

    def self.resources_usage(filename)
      user_models = {}
      CSV.foreach(filename, :headers => :first_row, :col_sep => ';') do |row|
        user_models.value_in_array(row.field('UserId'), row.field('ResourceId'))
      end
      user_models
    end
  end


  class Hash
    def value_in_array(key, value)
      self.key?(key) ? self[key] << value : self[key] = [value]
    end

  end
end