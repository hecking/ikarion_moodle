require 'csv'
require './post'

# stop_list = []
# File.foreach('stop_list_default.txt') {|x| stop_list << x.chomp }

concepts = ["Stalin", "purge", "army", "leadership", "police", "NKVD", "terror","war"]
concepts = concepts.map(&:downcase)

posts = []

CSV.foreach('stalin_mini.csv', :headers => :first_row, :col_sep => ';') do |row|
  posts << Post.new(*row.fields)
end

def find_concepts(words, concepts)
  words.each_with_object(Hash.new(0)) do |word, list|
    list[word] += 1 if concepts.include? word
  end
end

=begin
count = posts.each_with_object([]) do |post, count|
  count << find_concepts(post.words, concepts)
end
=end

def score_word(post, word, concepts)
  tw = post.total_words
  rw = post.relevant_words
  counted_concepts = find_concepts( post.words, concepts)
  if counted_concepts.empty?
    0
  else
    matches = counted_concepts[word]
    total_matches = counted_concepts.values.reduce(:+) || 0
    (matches**2 / total_matches.to_f) * (tw / rw.to_f)
  end

   #{}"util: #{(rw/tw.to_f).round(3)} matches: #{matches} result: #{result.round(3)}"
end


def total_score(word, posts, concepts)
  scores = posts.each_with_object([]) do |post, scores|
    scores << score_word(post, word.downcase, concepts)
  end
  p "#{word}: Post scores: #{scores.map {|s| s.round(3)}}"
  p "Final: #{(scores.reduce(:+)/scores.count.to_f).round(3)}"
end


total_score("Stalin", posts, concepts)
#total_score("War", posts, concepts)
