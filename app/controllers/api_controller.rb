require 'lasertime'

class ApiController < ApplicationController
  rescue_from Exception, with: :handle_unknown_api_exception
  rescue_from Lasertime::ApiException, with: :handle_api_exception

  def handle_api_exception(exception)
    render status: 500, json: exception.response
  end

  def handle_unknown_api_exception(exception)
    render status: 500, json: {error: exception.message}
  end
end