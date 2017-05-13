module Generators
  # TODO: Document properly. Define styleguide
  # Idea: Redo with iterators. iter.next()
  # Assigns a Student to a Concept and returns pairs of
  # [Student, Concept]
  class StudentCandidates
    attr_reader :students, :concept_candidates, :domain_model, :a

    def initialize(params)
      # Posts ordered by number of posts
      # TODO: Take in account last contribution, Timestamps needed
      @students = params[:students].sort_by { |s| s.posts.size}
      deserialize_students_models
      @concept_candidates = params[:concept_candidates]
      @domain_model = params[:domain_model]
      @a = params[:alpha] || 0.5

    end

    # Ask all Student objects to deserialize its model
    def deserialize_students_models
      self.students.each do |student|
        student.deserialize_model
      end
    end

    def evaluate_all_students
      self.students.each_with_object({}) do |student, result|
        result[student.original_id] = Hash[evaluate_all_concept_candidates(student)]
      end
    end

    def evaluate_all_concept_candidates(student)
      self.concept_candidates.map do |key, value|
        evaluate_candidate_concept(student, key, value)
      end
    end

    # Returns a pair [String, Float]
    def evaluate_candidate_concept(student, concept, roots)
      return [concept, -1] if student.has_commented?(concept)
      knowledge = student.knowledge_about(concept)
      root_ratio = student.select_commented(roots).size / roots.size.to_f 
      utility = a *  knowledge + ( 1 - a ) * root_ratio

      [concept, utility]
    end

    def assign_candidates
      data = evaluate_all_students
      candidates =  self.concept_candidates.keys
      # Counts many times a concept has been picked
      # If there are more students than concepts, it cycles around the list
      # THis way prevents the same concept being chosen over and over
      use_count = Hash.fill_with_value(candidates, 0)

      result = []
      data.each do | student_id, scores|
        ordered_scores = scores.sort_by {|_,value| value }.reverse
        i, final_choice = 0, false
        until final_choice || i > candidates.size do
          choice = pick_concept(ordered_scores, i)
          if use_count.value_is_min?(choice)
            use_count.inc_value(choice)
            result << { id: student_id,
                        concept: choice,
                        root_concepts: concept_candidates[choice]
                      }
            final_choice = true
          else
            i +=1
          end
        end
      end
      result
    end


    def pick_concept(scores, index)
      scores[index][0]
    end
  end
end