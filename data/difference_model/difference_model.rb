# The Domain Model concepts are compared to the scores obtained in the Group
# Model. Each Concept (Node) state is marked as:
# - unmentioned - Concept has a zero score in the Group Model.
# - mentioned - the difference between the Domain and Group score is bigger than
# a predefined percentage
# - discussed - the difference between the Domain and Group score is smaller than
# a predefined percentage or negative.
# @attr_reader [Set of Node objects] nodes - Concepts with its scores and
# adjacencices.
# @attr_reader [Integer] percentage - Defines a threshold to make the comparison
# @attr_reader [Hash] group_scores - Pairs of concept-score
#

  class DifferenceModel
  attr_reader :nodes, :group_scores, :percentage

  def initialize(nodes, percentage, group_scores)
    # graph
    @nodes = nodes
    @percentage = percentage
    # hash
    @group_scores = group_scores
  end

  # Mark each node with one of the aforementioned states.
  def mark_nodes_state
    nodes.each_value do |node|
      group_score = group_scores[node.name]
      if group_score == 0
        node.state = "unmentioned"
      elsif
        node.state = if difference_above_threshold(node.name)
          "mentioned"
        else
          "discussed"
        end
      end
    end
  end

  # Check that the difference between Domain and Group model score for a given
  # concept is smaller than a threshold based on percentage
  def difference_above_threshold(node_name)
    domain_weight = nodes[node_name].weight
    threshold = domain_weight * percentage
    domain_weight - group_scores[node_name] < threshold
  end

end