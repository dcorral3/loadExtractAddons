#!/usr/bin/env ruby
require 'fileutils'

main_file_path=ARGV[0]
addon_min_path=ARGV[1]
main=File.open(main_file_path)
addon_min=File.open(addon_min_path, "w")

l=main.gets
while l != nil
  if l.include? "// start-addon-section //"
    main.gets
    l=main.gets
    while !l.include? "// end-addon-section //" do
      addon_min<<l
      l=main.gets
    end
  end
  if l.include? "'addons/start'"
    l=main.gets
    addon_min<<"// list-start //\n"
    while !l.include? "'addons/end'"
      addon_min<<l
      l=main.gets
    end
    break
  end
  l=main.gets
end
addon_min.close
main.close

