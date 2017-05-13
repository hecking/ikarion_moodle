class Message < ActiveRecord::Base
  belongs_to :student

  validates :student_id, presence: true
  validates :content, presence: true


end
