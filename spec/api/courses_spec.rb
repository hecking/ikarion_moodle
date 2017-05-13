require 'rails_helper'

describe ApiCoursesController do
  before do
    setup { host! 'http://api.lvh.me:3000'}
  end

  it "lists courses" do
    get '/v1/courses'
  end


end