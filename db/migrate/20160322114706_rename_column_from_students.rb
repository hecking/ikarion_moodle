class RenameColumnFromStudents < ActiveRecord::Migration
  def change
    rename_column :students, :learning_resources, :accessed_learning_resources

  end
end
