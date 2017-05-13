Rails.application.routes.draw do

  get 'sessions/new'

  root 'static_pages#home'
  get 'help'    => 'static_pages#help'
  get 'about'   => 'static_pages#about'
  get 'signup'   => 'users#new'
  post 'courses/create_messages'   => 'courses#create_messages'
  post 'courses/create_domain_graph'   => 'courses#create_domain_graph'

  get 'login' => 'sessions#new'
  post 'login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'
  resources :users
  resources :courses, only: [:create, :destroy]

  constraints subdomain: 'api' do
    namespace :api, path: '/' do
      namespace :v1, path: '/v1' do
        resources :courses
      end
    end
  end
end
