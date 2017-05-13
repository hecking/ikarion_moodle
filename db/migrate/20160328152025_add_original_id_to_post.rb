class AddOriginalIdToPost < ActiveRecord::Migration
  def change
    add_column :posts, :original_id, :string
  end
end
