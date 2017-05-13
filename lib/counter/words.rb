require 'lingua/stemmer'
require 'levenshtein'

module Counter
  # Counts the number of times a set of words appear in a text.
  #
  # @attr_reader ref_wordset [Array] collection of words to count.
  # @attr_reader stemmer [Lingua::Stemmer] Reduces words to their roots.
  # @attr_reader tk [PragmaticTokenizer::Tokenizer] Split strings into arrays of words.
  class Words
    attr_reader :ref_wordset, :stemmer, :tk

    # Instantiates a Stemmer, Tokenizer and preprocess wordset
    # @param ref_words [Array] of String
    def initialize(wordset)
      @stemmer = Lingua::Stemmer.new
      options = {
        punctuation: :none,
        expand_contractions: false
      }
      @tk = PragmaticTokenizer::Tokenizer.new(options)
      @ref_wordset = preprocess(wordset)
    end

    # Returns a Hash of { word => number of ocurrences in text }
    def count(text)
      processed_text = process(text)
      self.ref_wordset.each_with_object({}) do |(ref_word, matcher), result|
        result[ref_word] = if matcher.is_a? Array
          count_multiword_matches(matcher, processed_text)
        else
          count_simple_matches(matcher, processed_text)
        end
      end
    end

    private
      # Returns Hash of Amatch::Sellers matchers.
      # In case a word can be divided into several, its hash entry contains an
      # Array of matchers.
      def preprocess(wordset)
        wordset.each_with_object({}) do |word, result|
          # Try to divide into words
          segmented = self.tk.tokenize(word)
          # Multiword string
          if segmented.size > 1
            matchers = segmented.each_with_object([]) do |segment, res|
              res << self.stemmer.stem(segment.downcase)
            end
            result[word] = matchers
          # One word string
          else
            result[word] = self.stemmer.stem(word.downcase)
          end
        end
      end

      # Converts text into array of stemmed words (reduces to their roots).
      def process(text)
        words = self.tk.tokenize(text)
        words = words.map { |word|  self.stemmer.stem(word.downcase) }
      end

      # Given a matcher and a collection of words, returns the number of words
      # within a distance of the matcher
      def count_simple_matches(matcher, words, distance = 1)
        words.select { |word| Levenshtein.distance(matcher, word) <= distance }.size
      end

      # Given a matcher and a collection of words, returns an array of the edit
      # distance between matcher and collection.
      def calculate_distances(matcher, words)
        words.map { |word| Levenshtein.distance(matcher, word) }
      end

      # Given a matcher and a collection of words, returns the number of words
      # within a distance of the matcher
      def count_multiword_matches(matchers, words, distance = 1)
        # Calculates match scores for each matcher (individual word)
        matchers = matchers.map { |m| calculate_distances(m, words) }
        # Selects the position of the words within a distance of the matcher
        matchers = matchers.map { |m| m.each_index.select { |i| m[i] <= distance } }
        # For a multiword match to occur, there needs to be consecutive individual matches
        # Example:
        # Looking for "newton's law", "newton's" is found in position 19
        # There should be a match for "law" in position 20
        # We can substract its offset to ease the comparison
        matchers = matchers.map.with_index { |m, i|  m.map { |x| x - i }}
        # Separated word matches are reduced to only one applying union of
        # arrays (& operation). The number of complete matches is returned.
        matchers.reduce(:&).size
      end

  end
end
