var fs = require('fs')
var readline = require('readline')

var readMembers = function(inputFile,callback){
	let inStream = fs.createReadStream(inputFile)
	let members = {}
	let teams = {}
	let rl = readline.createInterface({
		input:inStream
	})
	rl.on('line',(line)=>{
		line = line.split(',')
		if(line[0]==="studentID" && line[1]==="teamID"){
			return
		}
		members[line[0]] = line[1]
		if(!teams.hasOwnProperty(line[1])){
			teams[line[1]] = 0
		}
	})
	rl.on('close',()=>{
    console.log(members)
    console.log(teams)
		callback(members,teams)
	})
}	


var readScores = function(scoreFile,callback){
	let inStream = fs.createReadStream(scoreFile)
	let scores = []
	let rl = readline.createInterface({
		input:inStream
	})
	rl.on('line',(line)=>{
		line = line.split(',')
    if(line[1]==""){
      line[1]="0"
    }
		if(line[0]==="studentID" && line[1]==="score"){
			return
		}
		scores.push({
			memberID:line[0],
			score:parseInt(line[1])
		})
	})
	rl.on('close',()=>{
		callback(scores)
    console.log(scores)
	})
}

var getFinalScores = function(members,teams,scores,callback){
	scores.forEach((score)=>{
		if(!members.hasOwnProperty(score.memberID)){
			console.log(score.memberID)
		}else{
			let team = members[score.memberID]
			teams[team] = teams[team]>score.score?teams[team]:score.score
		}
	})
	callback(teams)
}

var generateTeamScores = function(teamFile,scoreFile,outFile){
  readMembers(teamFile,(members,teams)=>{
    readScores(scoreFile,(scores)=>{
      getFinalScores(members,teams,scores,(teams)=>{
        console.log(teams)
        let stream = fs.createWriteStream(outFile)
        for(let member in members){
          if(members.hasOwnProperty(member)){
            stream.write(member+","+teams[members[member]]+"\n")
          }
        }
      })
    })
  })
}

module.exports = {
  generateTeamScores:generateTeamScores
}


