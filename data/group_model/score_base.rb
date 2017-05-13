require 'tokenator'
require 'matrix'

class ScoreBase
  attr_accessor :posts, :query_mask, :scores
  attr_reader :collection, :query, :strategy, :tk

  def initialize(collection, query)
    @collection = collection
    # List of words to look for in text
    @query = query

    @tk = Tokenator.new
    # Query vector with initial 0 scores
    @query_mask = vector_mask
    # Tokenised collection
    @posts = process_collection
    @scores = {}
  end

  def process_collection
    collection.map { |doc| tk.tokenize(doc).map(&:downcase) }
  end

  def vector_mask
    query.each_with_object({}) { |concept, hash| hash[concept] = 0}
  end

   def text_to_vector(post)
    mask = query_mask.clone
    post.each do |word|
      mask[word] += 1 if mask.include? word
    end
    mask
  end

  def zip_scores
    Matrix[*scores.values].transpose.to_a
  end

  def score_collection
    raise NotImplementedError, "Instance a subclass "
  end

end



