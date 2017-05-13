class AddActivityLogToCourse < ActiveRecord::Migration
  def change
    add_column :courses, :activity_log, :string
  end
end
