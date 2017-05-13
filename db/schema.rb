# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20160912204158) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"
  enable_extension "hstore"

  create_table "courses", force: :cascade do |t|
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
    t.string   "concepts"
    t.string   "activity_log"
    t.string   "student_generated_content"
  end

  add_index "courses", ["user_id", "created_at"], name: "index_courses_on_user_id_and_created_at", using: :btree
  add_index "courses", ["user_id"], name: "index_courses_on_user_id", using: :btree

  create_table "domains", force: :cascade do |t|
    t.integer  "course_id"
    t.json     "model"
    t.string   "concepts_list",      null: false, array: true
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
    t.json     "learning_resources"
  end

  create_table "groups", force: :cascade do |t|
    t.integer  "course_id",  null: false
    t.float    "score",      null: false, array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "messages", force: :cascade do |t|
    t.text     "content",    null: false
    t.integer  "student_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string   "course_id"
  end

  add_index "messages", ["student_id"], name: "index_messages_on_student_id", using: :btree

  create_table "posts", force: :cascade do |t|
    t.integer  "student_id"
    t.text     "content",     null: false
    t.float    "scores",                   array: true
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
    t.string   "original_id"
  end

  create_table "students", force: :cascade do |t|
    t.string   "original_id"
    t.integer  "course_id"
    t.datetime "created_at",                               null: false
    t.datetime "updated_at",                               null: false
    t.string   "accessed_learning_resources", default: [],              array: true
    t.json     "model"
    t.float    "posts_score",                                           array: true
    t.hstore   "posts_scores"
  end

  add_index "students", ["course_id", "updated_at"], name: "index_students_on_course_id_and_updated_at", using: :btree
  add_index "students", ["course_id"], name: "index_students_on_course_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "name"
    t.string   "email"
    t.datetime "created_at",      null: false
    t.datetime "updated_at",      null: false
    t.string   "password_digest"
    t.string   "remember_digest"
    t.string   "auth_token"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree

  add_foreign_key "courses", "users"
  add_foreign_key "messages", "students"
  add_foreign_key "students", "courses"
end
