# Porter Stemmer
require 'lingua/stemmer'
# Damerau-Levenshtein edit distance, includes transposition as edit primitive.
require 'levenshtein'
# Rule based tokenizer
require 'pragmatic_tokenizer'

module Counter
  # Counts the number of times a set of words appear in a text.
  #
  # @attr_reader ref_wordset [Array] collection of words to count.
  # @attr_reader stemmer [Lingua::Stemmer] Reduces words to their roots.
  # @attr_reader tk [PragmaticTokenizer::Tokenizer] Split strings into arrays of words.
  class Words
    attr_reader :ref_wordset, :stemmer, :tk

    # Instantiates a Stemmer, Tokenizer and preprocess wordset
    # @param ref_words [Array]
    def initialize(wordset)
      @stemmer = Lingua::Stemmer.new
      options = {
        punctuation: :none,
        expand_contractions: false
      }
      @tk = PragmaticTokenizer::Tokenizer.new(options)
      @ref_wordset = preprocess(wordset)
    end

    def count(text)
      words = self.tk.tokenize(text)
      words = words.map { |word|  self.stemmer.stem(word.downcase) }
      self.ref_wordset.each_with_object({}) do |(ref_word, matcher), result|
        result[ref_word] = count_matches(matcher, words)
      end
    end

    private
      def preprocess(wordset)
        wordset.each_with_object({}) do |word, result|
          result[word] = self.stemmer.stem(word.downcase)
        end
      end

      # Counts
      def count_matches(matcher, words, distance = 1)
        words.select { |word| Levenshtein.distance(matcher, word) <= distance }.size
      end
  end
end

wordset = ["gravity", "mass", "defin"]
cw = Counter::Words.new(wordset)

p cw.count("gravity is a gravitational problem").values
