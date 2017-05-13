#require './node'

# Use TomDOC to document
class Graph
  attr_reader :score_matrix, :node_names, :nodes
  attr_accessor :nodes, :edges

  def initialize(node_names, score_matrix)
    @node_names = node_names
    @score_matrix = score_matrix

    @nodes = {}
    add_nodes
    connect_nodes
  end

  def diagonal
    score_matrix.each(:diagonal).to_a
  end

  def pack_node_data
    node_scores = diagonal
    node_names.zip(node_scores)
  end

  def create_nodes
    node_data = pack_node_data
    node_data.map { |item| Node.new(name = item[0], weight = item[1]) }
  end

  def add_nodes
    create_nodes.each { |node| add_node(node) }
  end

  def add_node(node)
    nodes[node.name] = node
  end

  def adjacency_list(name)
    node_index = index(name)
    node_names.zip(score_matrix.row(node_index))
  end

  def connect_nodes
    node_names.each do |name|
      nodes[name].add_neighbours(adjacency_list(name))
    end
  end

  def index(name)
    node_names.index(name)
  end

  def reduced_adjacency_list(name)
    node_index = index(name)
    node_adj = adjacency_list(name)[node_index.next..-1]
    node_adj.select { |node_name, weight| [node_name, weight] if weight > 0 }
  end

  def display(filename = 'graph', direction='LR')
    File.open("#{filename}.dot", 'w') do |f|
      f.puts 'graph {'
      f.puts 'rankdir=LR;' if direction == 'LR'

      node_names.each do |name|
        current_node = nodes[name]
        f.puts %(   #{name} [label="#{name}: #{current_node.weight}"])

        reduced_adj = reduced_adjacency_list(name)
        reduced_adj.each do |neighbour, weight|
          f.puts %(   #{name} -- #{neighbour}[label="#{weight}"])
        end
      end

      f.puts '}'
    end
    to_png(filename)
  end

  def to_png(filename)
    `dot -Tpng #{filename}.dot -o #{filename}.png`
  end
end
