#require './node'
require 'matrix'

module Models
  # Creates a Graph from an adjacency matrix (score_matrix) and a list of node
  # names.
  #
  # A Graph is simply a list of Nodes.
  # Each Node contains a list of its neighbours and the weight of the path
  # that connects them.
  class Graph
    # score_matrix
    attr_accessor :score_matrix, :node_names, :nodes, :edges

    def initialize(node_names, score_matrix)
      @node_names = node_names
      @score_matrix = score_matrix
      # Dictionary containing references by name to each Node object in the graph.
      @nodes = {}
      add_nodes
      connect_nodes
    end

    # Instances a new Graph object from a json string.
    # Allows to deserialize objects stored in the DB.
    def self.from_json(data)
      obj = allocate
      obj.node_names = data['node_names']
      # Converts to a Matrix object
      obj.score_matrix = Matrix[*data['score_matrix']]
      obj.nodes = {}
      data['nodes'].each do |key, value|
        obj.nodes[key] = Node.from_json(value)
      end
      obj
    end

    def to_image(filename = "graph", direction="LR")
      File.open("public/img/graphs/#{filename}.dot", "w") do |f|
        f.puts "graph {"
        f.puts "node [ style = filled ]"
        f.puts "rankdir=LR;" if direction == "LR"

        node_names.each do |name|
          print_node(f,name)
        end
        f.puts "}"
      end
        to_png(filename)
    end

    private

      # Returns the diagonal of the adjacency matrix.
      def diagonal
        score_matrix.each(:diagonal).to_a
      end

      # Returns an Array of pairs [Value from matrix_score diagonal, Node name]
      # The diagonal from the score_matrix represents the weights of each node.
      def pack_node_data
        node_scores = diagonal
        node_names.zip(node_scores)
      end

      # Transform the pairs [Value from diagona, Node name] into instances of the
      # Node class.
      def create_nodes
        node_data = pack_node_data
        node_data.map { |item| Node.new(name = item[0], weight = item[1]) }
      end

      # Adds all Node objects to the graph's list of nodes.
      def add_nodes
        create_nodes.each { |node| add_node(node) }
      end

      # Adds one Node object to the graph list of nodes.
      def add_node(node)
        nodes[node.name] = node
      end

      # Given a node name, returns its corresponding row (adjacency list) from
      # the score_matrix
      def adjacency_list(name)
        node_index = index(name)
        node_names.zip(score_matrix.row(node_index))
      end

      # To each Node object passes a list of its adjacencies
      # The Node creates its neighbours.
      def connect_nodes
        node_names.each do |name|
          nodes[name].add_neighbours(adjacency_list(name))
        end
      end

      # Given a name, returns its index in the list of node_names
      def index(name)
        node_names.index(name)
      end

      # Display Graph

      # DEPRECATED. List is processed at Node object level.
      # Given a name, selects the node's correspondent row in the score matrix
      # and returns a reduced adjacency list (non-zero elements only)
      # Used only for facilitating Display
      def reduced_adjacency_list(name)
        node_index = index(name)
        node_adj = adjacency_list(name)[node_index.next..-1]
        node_adj.select { |node_name, weight| [node_name, weight] if weight > 0 }
      end

      # Writes the DOT file info to display a node, given its name
      def print_node(f, name)
        current_node = nodes[name]
        color = assign_color_to_node(current_node)
        f.puts %(   "#{name}" [label="#{name}: #{current_node.weight}"] #{assign_color_to_node(current_node)})
        # Writes down its neighbours
        reduced_adj = reduced_adjacency_list(name)
          reduced_adj.each do |neighbour, weight|
            f.puts %(   "#{name}" -- "#{neighbour}"[label="#{weight}"])
          end
      end

      # Assigns a color to a node based on its state
      # Ligther colors up to 1, darker colors down to 0
      # 1 means non discussed
      def assign_color_to_node(node)
        puts "#######################33}"
        puts node.state
        color = case node.state
        when 0.9..1.0
          "#CAE1E8"
        when 0.65..0.9
          "#80B3C4"
        when 0.3..0.65
          "#49899E"
        when 0..0.3
          "#276073"
        end
        "[color = \"#{color}\"]"
      end

      # Transforms the file into a .png using the Graphviz library
      # Must be installed on the server
      # For Heroku Deployment see: https://github.com/weibeld/heroku-buildpack-graphviz
      def to_png(filename)
        `dot -Tpng public/img/graphs/#{filename}.dot -o public/img/graphs/#{filename}.png`
      end
  end
end
