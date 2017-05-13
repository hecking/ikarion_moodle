class AddPostsScoreToStudent < ActiveRecord::Migration
  def change
    add_column :students, :posts_score, :float, array: true
  end
end
