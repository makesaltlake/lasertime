require 'lasertime'

class Event < ApplicationRecord
  ALLOW_DELETE_THRESHOLD = 4.hours

  belongs_to :machine
  belongs_to :person

  def destroy_if_recent
    if created_at > (Time.now - ALLOW_DELETE_THRESHOLD)
      destroy!
    else
      raise Lasertime::NotRecent
    end
  end
end
