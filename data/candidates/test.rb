require 'matrix'

m = Matrix[[1.698, 1.117, 1.891, 1.818], [1.001, 1.251, 1.217, 1.096], [0.0, 0.836, 0.38, 0.0], [0.0, 2.168, 0.908, 1.416], [1.567, 0.884, 0.0, 1.371], [1.48, 1.721, 0.0, 0.0], [0.0, 0.533, 1.215, 1.658], [0.0, 0.798, 0.965, 0.0], [1.278, 0.0, 0.0, 1.81], [1.187, 1.503, 1.162, 1.099]]



def normalize_value(x, min, max)
  ( x - min ) / (max - min )
end

def normalize_matrix(m)
  max = m.max
  min = m.min
  m.map { |x| normalize_value(x, min, max).round(3)}
  #m.each_with_index { |item, i| m.send(:[]=, i, i, 0.1)}
end

m = normalize_matrix(m)
m.each_with_index(:diagonal) do |item, i|
  m.send(:[]=, i, i, item + 0.1 ) if item > 0
end

p m
