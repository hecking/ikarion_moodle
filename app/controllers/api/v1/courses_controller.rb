module API
  module V1
    class CoursesController < ApplicationController
      before_action :authenticate

      rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

      # Returns all courses for a user
      def index
        @user.courses
        #courses = Course.all
        render json: @user.courses, status: 200
      end

      # Creates new Course
      def create
        
        course = @user.courses.build(course_params)
        if course.save
          messages = Message.where(course_id: course.id)
          render json: messages, status: 200, location: course
        else
          render json: course.errors, status: 422
        end
      end

      # Returns course with the given id
      def show
        course = @user.courses.find(params[:id])
        render json: course, status: 201 unless course.nil?
      end

      def destroy
        @user.courses.find(id:params[:id]).destroy
        render nothing: true, status: 204
      end

      private
        def course_params
          params.permit(:id,:name, :concepts, :activity_log, :student_generated_content)
        end

        # Checks headers for Auth Token or renders "unauthorized"
        def authenticate
          authenticate_token || render_unauthorized
        end

        # Finds user by Auth Token
        def authenticate_token
          authenticate_or_request_with_http_token do |token, options|
            @user = User.find_by(auth_token: token)
          end
        end

        # Returns 'Bad Credentials' for invalid Auth Tokens
        def render_unauthorized
          self.headers['WWW-Authenticate'] = 'Token realm="Application"'
          render json: 'Bad credentials', status: 401
        end

        def record_not_found
          head 204
        end

    end
  end
end


# curl -H "Authorization: Token token=cd1b1c4bc92e4634afe14df5dbc72fba" http://api.lvh.me:3000/v1/courses/
# curl -H "Authorization: Token token=cd1b1c4bc92e4634afe14df5dbc72fba" http://api.lvh.me:3000/v1/courses/1

