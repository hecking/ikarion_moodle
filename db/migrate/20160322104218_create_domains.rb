class CreateDomains < ActiveRecord::Migration
  def change
    create_table :domains do |t|
      t.references :course
      t.json :model
      t.string :concepts_list, array: true, null: false
      t.hstore :learning_resources, null: false

      t.timestamps null: false
    end
  end
end
