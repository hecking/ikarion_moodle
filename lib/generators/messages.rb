module Generators
  # Generates a list of messages from the following information
  # student [Models::Student]
  # candidate_concept { concept => [root_concepts] } [ Hash of Strings]
  #
  class Messages
    attr_accessor :msg
    attr_reader :course_id, :domain, :student, :concept, :lang, :root_concepts

    def initialize(params)
      @concept = params[:msg_info][:concept]
      @root_concepts = params[:msg_info][:root_concepts]
      @course_id = params[:course_id]

      @domain = params[:domain]
      self.domain.deserialize_model

      @lang = params[:language] || :ENG
      @student = find_student(params[:msg_info][:id])
      self.student.deserialize_model
      create_message
    end

    # Creates and insert a message into the DB.
    def create_message
      Message.create(student_id: self.student.id, course_id: self.course_id, content: compose_message)
    end

    private

      # Contains the flow of the message generation
      def compose_message
        msg = ''
        # Greeting message. Identical for everyone
        msg << message_db(id: self.student.original_id, msg: :greeting)
        # Student has concept in its model?
        if self.student.has_knowledge_about?(self.concept)
          msg << message_db(msg: :knowledge)
          # Student has written about related concepts?
          roots = self.student.has_commented_set?(self.root_concepts)
          if roots.size > 0
            # Show student which related concepts has he commented.
            msg << message_db(msg: :commented, plural: roots.size > 1, root_concepts: roots)
          else
            # Ends sentence if he hasn't commented any.
            msg << '. '
          end
          res = unused_resources
          if res.size > 0
            # Recommends unused resources
            msg << message_db(msg: :recommend, resources: unused_resources, plural: res.size > 1)
          else
            # If he has used all
            msg << message_db(msg: :read_all)
          end
        # If Student has no knowledge about concept.
        else
          msg << message_db(
            msg: :recommend_new,
            resources: self.domain.learning_resources_with(self.concept))
        end
      end

      # Returns a list of learning resources that student hasn't accessed yet.
      def unused_resources
        useful_resources = self.domain.learning_resources_with(self.concept)
        accessed_resources = self.student.accessed_learning_resources
        useful_resources - accessed_resources
      end


      # Returns a student based on its original id and the current course and
      # deserialize its model.
      def find_student(original_id)
        Student.find_by(original_id: original_id, course_id: self.course_id)
      end

      # Returns a message based on the following params:
      # :lang: Language of the message
      # :msg: Selects type of message to return
      # Other params are interpolated in the returned string.
      #
      # Information is written between <> to be parsed and interpolated through an
      # external application.
      #
      # ==== Example
      # message_db(msg: :greeting, concept: 'example')
      # => "Hello, <self.id}>. The concept <example> hasn't been discussed enough. "
      def message_db(params)
        lang = params[:lang] || self.lang
        concept = params[:concept] || self.concept
        root_concepts = params[:root_concepts] || self.root_concepts
        resources = params[:resources] || []
        # TODO: Try as class variable for perfomance reasons.
        template = {
          'ENG': {
            'greeting': "Hello, <#{params[:id]}>. The concept <#{concept}> hasn't been discussed enough. ",
            'knowledge': "It seems that you have knowledge about <#{concept}>",
            'commented': "and you have also commented about the related concept#{'s' if params[:plural]} #{pretty_print root_concepts}. ",
            'recommend': "Why don't you write something about it? You can expand your knowledge on <#{concept}> through the following resource#{'s' if params[:plural]}:
              #{pretty_print resources}",
            'recommend_new': "You can learn about <#{concept}> through the following resources:
              #{pretty_print resources}",
            'read_all': "You also have consulted all the learning resources regarding <#{concept}>. "
          }
        }
        return template[lang][params[:msg]]
      end

      def pretty_print(resources)
        resources.map { |item| "<#{item}>"}.to_sentence
      end

  end
end
