class ChangePostStudentIdToInteger < ActiveRecord::Migration
  def change
    change_column :posts, :student_id, :integer
  end
end
