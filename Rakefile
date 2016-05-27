HOST_DIR = '/var/www/default'
SITE_DIR = File.basename Dir.pwd
DEST_DIR = "#{HOST_DIR}/#{SITE_DIR}"


task :default => :deploy


desc 'Clean previous site builds'
task :clean do
  # Clean local files
  rm_rf '_site'

  # Clean deployed files
  rm_rf DEST_DIR
  rm_f "#{HOST_DIR}/lib"
end

desc 'Build Jekyll site'
task :build do
  # Create a local config file
  File.open '_local.yml', 'w' do |f|
    f.write "baseurl: /#{SITE_DIR}\n"
  end

  # Build the site
  sh 'jekyll', 'build', '--config', '_config.yml,_local.yml'

  # Remove local config file
  rm_f '_local.yml'
end

desc 'Deploy site locally'
task :deploy => [:clean, :build] do
  # Move the site to deployment
  mv '_site', "#{DEST_DIR}"

  # Link libraries
  ln_sf "#{DEST_DIR}/lib", "#{HOST_DIR}/lib"
end
