class AddLearningResourcesToCourse < ActiveRecord::Migration
  def change
    add_column :courses, :learning_resources, :hstore
  end
end
