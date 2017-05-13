class StaticPagesController < ApplicationController
  def home
    @course = current_user.courses.build if logged_in?
  end

  def help
    render json: "help"
  end

  def about

  end
end
