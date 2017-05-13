require 'csv'
require './log_count'
require './tf_idf'
require './okapi_bm25'
# Query space
concepts = ["Stalin", "purge", "army", "leadership", "police", "NKVD", "terror","war"]
concepts = concepts.map(&:downcase)

content = []
CSV.foreach('stalin_mini.csv', :headers => :first_row, :col_sep => ';') do |row|
  content << row.field('Content')
end

p content
sc = TfIdf.new(content, concepts)
p sc.get_agregated_scores