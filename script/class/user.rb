#encoding=utf-8
class User
  require File.expand_path '../../helpers/spec_helper', __FILE__
  require 'base64'
  
  include SpecHelper

  attr_accessor :login_name, :password, :access_token, :network_id, :response_obj, :mqtt_client


  def reset_password current_pwd, new_pwd
    response = post "/api/v1/users/reset_password", {current_pwd: current_pwd, new_pwd: new_pwd}, header
    response
  end

  def create_network name, display_name
    response = post "/api/v1/networks", {name: name, display_name: display_name}, header
    response
  end

	def delete_token access_token
		response = delete "/api/v1/oauth/tokens/#{access_token}", header
		response
	end

  def initialize options={}
     @access_token = "VM5LVDn8fe"
     @network_id = 1
     @login_name = "admin"
     @password = "workasadmin001"
  end

  def params
    p = {grant_type: GRANT_TYPE, login_name: self.login_name, password: self.password,
         app_id: APP_ID, app_secret: APP_SECRET}
    p
  end

  def header
    {Authorization: "Bearer #{access_token}", NETWORK_ID: network_id}
  end

  def id
    response_obj[:id]
  end

  def name
    response_obj[:name]
  end


end
