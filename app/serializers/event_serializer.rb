class EventSerializer < ActiveModel::Serializer
  attributes :id, :person_name, :seconds, :mode, :created_at

  def person_name
    object.person.name # TODO: N+1
  end
end
