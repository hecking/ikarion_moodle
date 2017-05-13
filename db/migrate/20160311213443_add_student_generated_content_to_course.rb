class AddStudentGeneratedContentToCourse < ActiveRecord::Migration
  def change
    add_column :courses, :student_generated_content, :string
  end
end
