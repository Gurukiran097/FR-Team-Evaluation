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
		if(line[0]==="memberID" && line[1]==="teamID"){
			return;
		}
		members[line[0]] = line[1]
		if(!teams.hasOwnProperty(line[1])){
			teams[line[1]] = 0
		}
	})
	rl.on('close',()=>{
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
		if(line[0]==="memberID" && line[1]==="score"){
			return
		}
		scores.push({
			memberID:line[0],
			score:parseInt(line[1])
		})
	})
	rl.on('close',()=>{
		callback(scores)
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

readMembers('MOCK_DATA.csv',(members,teams)=>{
	readScores('MOCK_DATA_SCORE_2.csv',(scores)=>{
		getFinalScores(members,teams,scores,function(teams){
			console.log(teams)
		})
	})
})