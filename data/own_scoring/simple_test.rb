require 'csv'
require 'lemmatizer'
require 'tokenator'
#require 'fuzzy_match'

content = []
words_database = []

CSV.foreach('stalin_mini.csv', :headers => :first_row, :col_sep => ';') do |row|
  content << row.field('Content')
end
tokenizer = Tokenator.new

lemmatizer = Lemmatizer.new

content.each do |line|
  words = tokenizer.tokenize(line)
  words_database << words.map { |word| lemmatizer.lemma(word) }
end

  domain_vocabulary = ["purge", "terror", "military","stalin","soviet"]

  p domain_vocabulary.include? "purge"


def word_counter(collection)
  collection.each_with_object(Hash.new(0)) { |word,counts| counts[word] += 1 }
end

p word_counter(words_database[0])
