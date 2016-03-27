#!/usr/bin/env ruby
#encoding=utf-8
def exec_cmd cmd
  puts "==== cmd start ===="
  puts "ewhine $> #{cmd}"
  system cmd
  puts "==== cmd  end  ===="
  puts "\n"
end

exec_cmd "ip a"
exec_cmd "cat /etc/hosts"
exec_cmd "free -m"
exec_cmd "cat /etc/redhat-release"
exec_cmd "df -h"
exec_cmd "redis-cli info Replication"
exec_cmd "redis-cli info Keyspace"
exec_cmd 'ps axu|grep "stunnel\|mqtt\|maquettelepathy\|sidekiq\|rainbow\|nginx\|monit\|mxpp.js"|grep -v monitor | grep -v grep'
exec_cmd %q(cd /home/ewhine/deploy/; chown ewhine:ewhine -R ewhine_NB/ || du ewhine_NB/|awk '{ print "ls -l \""$2"\""}'|bash|grep -v "total\|总用量"|awk '{ print $3" "$9}'|grep -v "ewhine ")
