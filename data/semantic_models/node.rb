class Node

  attr_reader :name, :weight
  attr_accessor :adjacencies, :state

  def initialize(name, weight)
    @name = name
    @weight = weight
    # why hash instead of list
    @adjacencies = Hash.new
    @state = ""
  end

  def add_neighbours(adj_list)
    adj_list.each do |item|
      neighbour_name, weight = item
      add_neighbour(neighbour_name, weight) if neighbour_name != name && weight > 0
    end
  end

  def add_neighbour(name, weight)
    adjacencies[name] = weight
  end

  def list_neighbours
    adjacencies.keys
  end

  def to_s
    "#{name}:#{weight}"
  end
end




