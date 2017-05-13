class AddConceptToCourse < ActiveRecord::Migration
  def change
    add_column :courses, :concept, :string
  end
end
