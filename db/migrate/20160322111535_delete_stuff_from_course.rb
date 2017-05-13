class DeleteStuffFromCourse < ActiveRecord::Migration
  def change
    remove_column :courses, :learning_resources
  end
end
