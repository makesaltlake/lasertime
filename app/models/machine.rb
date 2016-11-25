class Machine < ApplicationRecord
  has_many :events

  def log_event(name, seconds, mode)
    person = Person.find_or_create_by!(name: name)
    events.create!(person: person, seconds: seconds, mode: mode)
  end
end
