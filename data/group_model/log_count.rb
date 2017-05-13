require './score_base'

class LogCount < ScoreBase
  def initialize(collection, query)
    super(collection, query)
  end

  def score_collection
    score_posts
    normalize_scores
    zip_scores
  end

  private
  def tf(term, freq)
    if freq > 0
      1 + Math.log(freq)
    else
      0
    end
  end

  def tf_term(post, term)
    vector = text_to_vector(post)
    freq = vector[term]
    tf_score = tf(term, freq)
  end


  def score_posts
    query.each do |concept|
      scores[concept] = posts.map { |post| tf_term(post, concept) }
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
