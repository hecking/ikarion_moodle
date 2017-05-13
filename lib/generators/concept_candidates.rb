module Generators
  class ConceptCandidates
    attr_reader :nodes, :states, :roots, :candidates

    def initialize(params)
      @domain_model = params[:domain_model]
      @nodes = @domain_model.nodes
      # Threshold score (state) to consider a node root.
      root_threshold = params[:root_threshold] || 0.15
      candidate_threshold = params[:candidate_threshold] || 0.85
      # Pairs of [node.name, node.state] sorted from zero (discussed) to one
      # (non-discussed).
      @states = collect_node_states
      # Nodes with a zero (or low) score.
      @roots = find_starting_nodes(root_threshold)
      # Returns the candidates
      @candidates = order_by_concept(find_candidates(candidate_threshold))
    end



    private
      # Returns an Array containing the name and state of each node, ordered by
      # its discussed score (state).
      # TODO: Change 'state' to 'discussed_score'?
      def collect_node_states
        result = Hash[nodes.values.map {|node| [node.name, node.state] }]
        result.sort_by { |name, state| state }
      end

      # Returns an Array containing the nodes that are discussed enough to reach
      # undiscussed concepts (potential candidates)
      def find_starting_nodes(threshold)
        states.select { |_, state| state <= threshold }.map { |name,_| self.nodes[name]}
      end

      # TODO: Account for strength of link between nodes when selecting neighbours.
      # For now, simplest case, just check all neighbours.
      # Returns {root_concept => [concept_1,..., concept_n],...,root2 => [...]}
      def find_candidates(threshold)
        result = {}
        roots.map do |root|
          result[root.name] = root.adjacencies.keys.select do |node_name|
            nodes[node_name].state >= threshold
          end
        end
        result
      end

      # Reverse cardinality of the candidates list.
      # Returns {concept_1 => [root_1, ..., root_n], concept_2...}
      def order_by_concept(candidates)
        result = {}
        candidates.each do |root_concept, list|
          list.each do |concept|
            result.value_in_array(concept, root_concept)
          end
        end
        result
      end
  end
end