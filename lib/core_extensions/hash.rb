  class Hash
    def value_in_array(key, value)
      self.key?(key) ? self[key] << value : self[key] = [value]
    end

    def inc_value(key)
      value = self[key]
      self[key] = value.next if value.is_a? Integer
    end
  end
