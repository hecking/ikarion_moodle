module Generators
  # Assigns a Concept to each Student.
  # Returns list of [Student, Concept]
  class StudentCandidatesGreedy
    # Student and Domain Model are previously serialized
    attr_reader :students, :concept_candidates, :domain_model, :a, :student_ids, :concepts

    def initialize(params)
      @students = params[:students]
      deserialize_students_models

      @concept_candidates = params[:concept_candidates]
      @domain_model = params[:domain_model]
      @a = params[:alpha] || 0.3

      @student_ids = students.map { |s| s.original_id }
      @concepts = concept_candidates.keys
    end

    # Ask all Student objects to deserialize its model
    def deserialize_students_models
      self.students.each do |student|
        student.deserialize_model
      end
    end
    
    # Returns normalized utility [0, 1]
    # Constraint: cannot recommend already commented concept. Represented with -1
    # 'a' value determines the weight to each attribute:
    # (knowledge and ratio of commented related concepts)
    def calculate_utility(student, concept, roots)
      # Constraint: only commented
      return -1 if student.has_commented?(concept)
      knowledge = student.knowledge_about(concept)
      root_ratio = student.select_commented(roots).size / roots.size.to_f 
      a *  knowledge + ( 1 - a ) * root_ratio
    end

    # Returns a matrix containing all the utility values
    def calculate_utility_matrix
      students.map do |student| 
        concept_candidates.map do |key, value|
          calculate_utility(student, key, value)
        end
      end
    end

    # Returns a vector containing the index of
    def calculate_max_utility_vector
      matrix = calculate_utility_matrix
      matrix.each_with_object([]) do |row, candidates|
        candidates << row.index(row.max) #index
      end
    end

    def assign_candidates
      max_utility_vector = calculate_max_utility_vector
      max_utility_vector.map.with_index do |u, i|
        {
          id: self.student_ids[i],
          concept: concepts[u],
          root_concepts: concept_candidates[concepts[u]]
        }
      end
    end

  end
end