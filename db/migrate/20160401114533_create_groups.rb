class CreateGroups < ActiveRecord::Migration
  def change
    create_table :groups do |t|
      t.references :course, null: false
      t.float :score, array: true, null: false

      t.timestamps null: false
    end
  end
end
