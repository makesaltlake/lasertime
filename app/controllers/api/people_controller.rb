class Api::PeopleController < ApiController
  def index
    render json: Person.all
  end
end
