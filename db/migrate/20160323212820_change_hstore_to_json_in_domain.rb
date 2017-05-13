class ChangeHstoreToJsonInDomain < ActiveRecord::Migration
  def change
    remove_column :domains, :learning_resources
    add_column :domains, :learning_resources, :json
  end
end
