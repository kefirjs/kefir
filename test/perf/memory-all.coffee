require("fs").readdirSync("#{__dirname}/memory-specs").forEach (file) ->
  require("#{__dirname}/memory-specs/#{file}")
