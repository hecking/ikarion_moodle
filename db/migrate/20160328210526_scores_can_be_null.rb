class ScoresCanBeNull < ActiveRecord::Migration
  def change
    change_column_null :posts, :scores, true
  end
end
