module Updaters
  # Updates Domain Model, assigning a percentage score to every concept (node).
  # This score indicates if a concept has been discussed enough or nt
  class DomainModel
    attr_accessor :domain, :group, :percentage

    def initialize(params)
      @domain = params[:domain]
      @group = params[:group]
      @percentage = params[:percentage] || 0.1
      check_nodes
      domain.save
    end

    private

    # Assigns a state to every node
      def check_nodes
        nodes = domain.model['nodes']
        nodes.each_with_index do |(key, value), index |
          nodes[key]['state'] = compare_scores(value['weight'], group.score[index])
        end
      end

      # Calculates the percentage in which two values x and y differs.
      # The percentage is zero if y is bigger than x or close enoug to is value.
      def compare_scores(x, y)
        return 0 if inside_threshold?(x, y)
        ((x - y) / x).round(3)
      end

      # Check that the value y is bigger (or within a threshold) than x
      # Returns true or alse
      def inside_threshold?(x,y)
        percentage = 0.1
        threshold = x * percentage
        x - y <= threshold
      end

  end
end