module Lasertime
  class ApiException < Exception
    def response
      {error: message}
    end
  end

  class NotRecent < Exception
  end
end