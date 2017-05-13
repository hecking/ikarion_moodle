# Public: Matrices are immutable in Ruby by default. This module reopens the
# Matrix class  and adds a new method.
module MutableMatrix
  refine Matrix do
    # Public: Modifies an element of the Matrix.
    #
    # i - row
    # j - col
    # x - value to replace the previous one.
    def []=(i, j, x)
      @rows[i][j] = x
    end
  end
end
