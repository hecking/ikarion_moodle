class CreateStudents < ActiveRecord::Migration
  def change
    create_table :students do |t|
      t.string :original_id
      t.references :course, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :students, [:course_id, :updated_at]
  end
end
