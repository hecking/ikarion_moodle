require './data_faker.rb'

# Number of students
s = 10
# Number of Candidate concepts
c = 4
m =  DataFaker::fake(s, c)
#DataFaker::prettify(m)
# Calculate maximum number of times a concept can be chosen.

limit = (s / c.to_f).ceil

class ConceptChooser
  attr_reader :limit, :students, :concepts
  attr_accessor :chosen_count, :matrix

  def initialize(matrix)
    @matrix = matrix
    # Number of students and concepts, matrix dimensions.
    @students = matrix.size
    @concepts = matrix[0].size
    @limit = (students / concepts.to_f).ceil
  end

  def create_counter(n)
    range = (0..n-1).to_a
    range.each_with_object({}) { |v,h| h[v] = 0 }
  end

  def pick_concepts
    @chosen_count = create_counter(concepts)
    selection = []
    matrix.each do |row|
      chosen = row.index(row.max)
      selection << chosen
      chosen_count[chosen] += 1
    end
    selection
  end

  def variety_penalization(assigned_times)
    ( 1 - ( assigned_times / limit.to_f )).round(3)
  end

  def calculate_variety_penalization
    chosen_count.values.map { |c| variety_penalization(c) }
  end

  def recalculate_matrix(weight=0.2)
    variety_utilities = calculate_variety_penalization
    @matrix = matrix.map do |row|
      row.map.with_index do |knowledge_utility, index|
        (weight * variety_utilities[index] + 1-weight * knowledge_utility).round(3)
      end
    end
    pick_concepts
  end

  def selection_is_ok?
    !chosen_count.values.any? { |v| v == 0 || v > limit}
  end

  def final_candidates
    pick_concepts
    p chosen_count
    recalculate_matrix unless selection_is_ok?
    p chosen_count
  end
end


cc = ConceptChooser.new(m)
p cc.final_candidates
