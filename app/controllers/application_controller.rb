class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception unless ENV['LASERTIME_DISABLE_AUTHENTICITY_CHECK'].present?
end
