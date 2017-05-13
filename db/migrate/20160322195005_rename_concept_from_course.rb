class RenameConceptFromCourse < ActiveRecord::Migration
  def change
    rename_column :courses, :concept, :concepts

  end
end
