class MessagesNotNull < ActiveRecord::Migration
  def change
    change_column_null :messages, :content, false
  end
end
