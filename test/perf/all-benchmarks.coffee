require("fs").readdirSync("#{__dirname}/benchmarks").forEach (file) ->
  require("#{__dirname}/benchmarks/#{file}")
