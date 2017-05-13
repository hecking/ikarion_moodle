require 'csv'
require 'tokenator'
require 'matrix'

# Query space
concepts = ["Stalin", "purge", "army", "leadership", "police", "NKVD", "terror","war"]
concepts = concepts.map(&:downcase)

content = []
CSV.foreach('stalin_mini.csv', :headers => :first_row, :col_sep => ';') do |row|
  content << row.field('Content')
end

class ScoreCalculator
  attr_reader :concepts, :collection, :tk
  attr_accessor :posts, :vector, :scores

  def initialize(collection, concepts)
    @collection = collection
    @concepts = concepts
    @tk = Tokenator.new
    @posts = preprocess
    @vector = vector_mask
    @scores = {}
  end

  def preprocess
    collection.map { |doc| tk.tokenize(doc).map(&:downcase) }
  end

  def text_to_vector(post)
    mask = vector.clone
    post.each do |word|
      mask[word] += 1 if mask.include? word
    end
    mask
  end

  def vector_mask
    concepts.each_with_object({}) { |concept, hash| hash[concept] = 0 }
  end

  def zip_scores
    Matrix[*scores.values].transpose.to_a
  end

  def score_collection
    score_posts
    normalize_scores
    zip_scores
  end

  def tf(term, freq)
    if freq > 0
      1 + Math.log(freq)
    else
      0
    end
  end

  def tf_idf(post, term)
    idf_score = idf(term)
    vector = text_to_vector(post)
    freq = vector[term]
    tf_score = tf(term, freq)
    tf_score * idf_score
  end

  def idf(term)
    n = collection.size
    df = posts.reduce(0) { |sum, post| sum += post.include?(term) ? 1:0 }
    if df > 0
      Math.log(n / df.to_f)
    else
      0
    end
  end

  def score_posts
    concepts.each do |concept|
      scores[concept] = posts.map { |post| tf_idf(post, concept) }
    end
  end

  def normalize(term)
    cosine = calculate_cosine(term)
    term.map { |item| cosine > 0 ? (item / cosine) : 0 }
  end

  def calculate_cosine(term)
    Math.sqrt(term.reduce(0) { |total, item| total += item * item })
  end

  def normalize_scores
    scores.each { |key, value| scores[key] = normalize(value) }
  end

end


p sc = ScoreCalculator.new(content, concepts).score_collection

