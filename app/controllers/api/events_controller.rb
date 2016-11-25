class Api::EventsController < ApiController
  def index
    events = Event.all
    events = events.where(machine_id: params[:machine_id]) if params[:machine_id]
    render json: events.order(created_at: :desc).limit(50)
  end

  def create
    params.require([:machine_id, :name, :seconds, :mode])

    machine = Machine.find(params[:machine_id])
    event = machine.log_event(params[:name], params[:seconds], params[:mode])

    render json: event
  end

  def destroy
    Event.find_by!(id: params[:event_id]).destroy_if_recent
    render json: {}
  end
end
