class AddCourseToMessages < ActiveRecord::Migration
  def change
    add_column :messages, :course_id, :string
  end
end
