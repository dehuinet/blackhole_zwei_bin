#!/usr/bin/env ruby
#encoding=utf-8
require 'net/http'
require 'json'
require "open-uri"

require File.expand_path '../helpers/spec_helper.rb', __FILE__
require File.expand_path '../class/user.rb', __FILE__


include SpecHelper


# 全网管理员创建新社区
admin = User.new

# 方法： 更改管理员密码、创建社区

case ARGV.first
when "reset_password"
  current_pwd = ARGV[1]
  new_pwd     = ARGV[2]

  resp = admin.reset_password current_pwd, new_pwd
  puts resp
when "create_network"
  name         = ARGV[1]
  display_name = ARGV[2]

  resp = admin.create_network name, display_name
  puts resp
when "clean_super_token"
	resp = admin.delete_token "VM5LVDn8fe"
	puts resp
when "test"
  resp = get "/api/v1/networks/current", {}, admin.header
  puts resp
else
  puts "reset_password current_pwd new_pwd | create_network name display_name |clean_super_token"
end
