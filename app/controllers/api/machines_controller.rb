class Api::MachinesController < ApiController
  def index
    render json: Machine.all.order(:id)
  end
end
