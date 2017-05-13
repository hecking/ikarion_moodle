require 'test_helper'

class ListCoursesTest < ActionDispatch::IntegrationTest
  # For testing purposes. Basically a mask over localhost
  # Allows to prepend a the 'api' subdomain
  setup do
    host! 'api.lvh.me'
    @user = User.create!(
      name:'test_user',
      email:'test@fake.com',
      password:'testfake')
  end
  # Helper method for Auth header
  def token_header(token)
    ActionController::HttpAuthentication::Token.encode_credentials(token)
  end

  test "Return all courses with missing credentials" do
    get '/v1/courses'
    assert_equal 401, response.status
  end

  test "Return all courses with fake credentials" do
    get '/v1/courses', {}, { 'Authorization' => token_header("fake")}
    assert_equal 401, response.status
  end


  test "Return all courses with credentials" do
    get '/v1/courses', {}, { 'Authorization' => token_header(@user.auth_token)}
    assert_equal 200, response.status
    assert_equal Mime::JSON, response.content_type
  end

  # fixture_file_upload is not taking fixture_path by default...
  # Will fail in testing because of the handle of the fake uploaded files. Should
  # work in the real api, since the controller is identical to the front-end and
  # the Auth works
  test "Create new course" do
    post '/v1/courses',
    { course:
      { name: 'example',
        concepts: fixture_file_upload(fixture_path + 'concepts.csv', 'text/csv'),
        activity_log: fixture_file_upload(fixture_path + 'resources_usage.csv', 'text/csv'),
        student_generated_content: fixture_file_upload(fixture_path + 'forum_posts.csv', 'text/csv')
      }
    }.to_json,
    { 'Accept' => Mime::JSON, 'Content-Type' => Mime::JSON.to_s, 'Authorization' => token_header(@user.auth_token)}

    assert_equal 204, response.status
    assert_equal Mime::JSON, response.content_type
    course = json(response.body)

    assert_equal course_url(course[:id]), response.location
  end

  test "Return course by id" do

  end
end
