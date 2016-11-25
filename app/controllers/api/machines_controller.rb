class Api::MachinesController < ApiController
  def index
    render json: Machine.all
  end
end
