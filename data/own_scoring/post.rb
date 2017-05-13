#require 'lemmatizer'
require 'tokenator'

# Post should be a model just mapping a Database entry/CSV row
# It makes sense to make a "processor" that receives content and returns word analisys
class Post
  attr_reader :content
  attr_accessor :words, :total_words, :relevant_words
  # To fix -> they should be 'services to communicate with'
  #@@lem = Lemmatizer.new
  @@tk = Tokenator.new

  def initialize(user_id, post_id, content)
    @user_id = user_id
    @post_id = post_id
    @content = content

    @stop_list = []
    File.foreach('stop_list_default.txt') {|x| @stop_list << x.chomp }
    @words = process_content
    @total_words = words.count
    words = eliminate_stop_words
    @relevant_words = words.count

  end

  def process_content
    words = tokenize(content)
    words.map(&:downcase)
    #words.map { |word| lemmatize(word) }
  end

  def tokenize(text)
    @@tk.tokenize(text)
  end

  def lemmatize(word)
    @@lem.lemma(word)
  end

  def eliminate_stop_words
    words.map {|word| word if !@stop_list.include? word}.compact
  end
end

