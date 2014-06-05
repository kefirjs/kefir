# FIXME: doesn't work correctly with async tests


require("fs").readdirSync("#{__dirname}/perf-specs").forEach (file) ->
  require("#{__dirname}/perf-specs/#{file}")
