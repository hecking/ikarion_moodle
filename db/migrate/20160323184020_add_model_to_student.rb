class AddModelToStudent < ActiveRecord::Migration
  def change
    add_column :students, :model, :json
  end
end
