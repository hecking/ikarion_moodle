=begin

  Greedy approach: Just take highest score
  - Problem: Unassigned concepts. Others got assigned all the time
  - Problem: Scors are not necessarily random -> skewe to the same concept.


=end
module DataFaker
  def self.fake(students, concepts)
    Array.new(students) { vector(concepts)}
  end

  def self.knowledge_score
    x = rand.round(3)
    x > 0.35 ? x : 0
  end

  def self.related_concepts_score(concepts)
    # Pick randomly a few
   Array.new(4) { rand }.select { |x| x > 0.75}.map { |x| x / 2.1}.reduce(:+) || 0
  end

  def self.total_score(concepts)
    ks = knowledge_score
    ks > 0 ? ks + related_concepts_score(concepts) : 0
  end

  def self.vector(concepts)
    Array.new(concepts) { total_score(concepts).round(3)}
  end

  def self.prettify(data)
    puts ('A'..'Z').to_a.take(data[0].count).map {|i| "#{i.ljust(10)}"}.join
    puts
    data.each { |vector| puts vector.map {|i| "#{i.to_s.ljust(10)}"}.join}
  end
end

m =  DataFaker::fake(10, 4)
p m
