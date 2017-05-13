class AddLearningResourcesToStudent < ActiveRecord::Migration
  def change
    add_column :students, :learning_resources, :string, array: true, default: []
  end
end
