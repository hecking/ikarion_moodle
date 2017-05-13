require './score_base'

class AugmentedTfIdf < ScoreBase
  def initialize(collection, query)
    super(collection, query)
    @tf_list = []

  end

  def score_collection
    score_posts
    normalize_scores
    zip_scores
  end

  private
  def get_tfs
    posts.each do |post|
      tf_listtext_to_vector(post)
    freq = vector[term]
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
    query.each do |concept|
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
