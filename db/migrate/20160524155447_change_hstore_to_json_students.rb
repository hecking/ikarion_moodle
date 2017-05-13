class ChangeHstoreToJsonStudents < ActiveRecord::Migration
  def change
    add_column :students, :posts_scores, :hstore
  end
end
