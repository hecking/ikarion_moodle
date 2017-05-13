module CoursesHelper
  def has_file?(file)
    !file.url.nil?
  end

  def graph_image_exists?(name)
    FileTest.exist?("#{Rails.root}/public/img/graphs/#{name}.png")
  end
end
