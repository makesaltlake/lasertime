Rails.application.routes.draw do
  namespace :api do
    get 'machines', to: 'machines#index'
    get 'people', to: 'people#index'

    get 'events', to: 'events#index'
    get 'machines/:machine_id/events', to: 'events#index'

    post 'events', to: 'events#create'
    delete 'events/:event_id', to: 'events#destroy'
  end
end
