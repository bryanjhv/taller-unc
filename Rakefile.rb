Dir.chdir File.dirname __FILE__

WWW_DIR = ENV['WWW_DIR'] || '/var/www/default'
SITE_DIR = File.basename Dir.pwd
LIB_DIR = File.join WWW_DIR, 'lib'
DEST_DIR = File.join WWW_DIR, SITE_DIR


task :default => :deploy

desc 'Clean previous site builds'
task :clean do
  # Clean local files
  rm_rf '_site'

  # Clean deployed files
  rm_rf DEST_DIR
  rm_f LIB_DIR
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
  mv '_site', DEST_DIR

  # Move libraries
  mv File.join(DEST_DIR, 'lib'), LIB_DIR
end
