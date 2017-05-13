class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.references :student
      t.text :content, null: false
      t.float :scores, array: true, null: false

      t.timestamps null: false
    end
  end
end
