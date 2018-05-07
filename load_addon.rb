require 'fileutils'
require 'pry'

addons_location = "./adist/*"
main_file_path = "./dist/main.js"
tmp_file = "file.tmp"
tmp=File.open(tmp_file, "w")
main=File.new(main_file_path)
filesArr = Dir[addons_location].select{ |f| File.file? f }

l=main.gets
while l != nil
  tmp<<l
  if l.include? "// start-addon-section //"
    filesArr.each do |file|
      add=File.new(file)
      boolist=false
      add.each do |line|
        if line.include? "// list-start //"
          boolist = true
        end
        if !boolist
          tmp<<line
        end
      end
      add.close
    end
  end
  if l.include? "'addons/start'"
    filesArr.each do |file|
      add=File.new(file)
      line=add.gets
      while line != nil
        if line.include? "// list-start //"
          line=add.gets
          while line != nil
            tmp<<line
            line=add.gets
          end
        end
        line=add.gets
      end
      add.close
    end
  end
  l=main.gets
end
FileUtils.mv(tmp_file, main_file_path)
filesArr.each do |file|
  FileUtils.rm(file)
end
