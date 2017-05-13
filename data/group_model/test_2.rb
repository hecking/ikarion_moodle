require 'csv'

content = []
CSV.foreach('concepts.csv', :headers => :first_row, :col_sep => ';') do |row|
  content << row.field('Content')
end

