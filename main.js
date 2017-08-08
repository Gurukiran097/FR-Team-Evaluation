const csvParser = require('./csvParser')


var readMembers = function(inputFile,callback){
	csvParser.read(inputFile,(members)=>{
		members.shift()
		let memberObj = {}
		let teams = {}
		members.forEach((member)=>{
			memberObj[member[0]] = member[1]
			if(!teams.hasOwnProperty(member[1])){
				teams[member[1]] = 0;
			}
		})
		callback(memberObj,teams)
	})
}


var readScores = function(scoreFile,callback){
	csvParser.read(scoreFile,(scores)=>{
		scores.shift()
		let len = scores.length
		for(let i=0;i<len;i++){
			if(scores[0][1]==""){
				scores[0][1]="0"
			}
			scores.push({
				memberID:scores[0][0],
				score:scores[0][1]
			})
			scores.shift()
		}
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

var generateMemberScores = function(teamFile,scoreFile,outFile,callback){
  readMembers(teamFile,(members,teams)=>{
    readScores(scoreFile,(scores)=>{
      getFinalScores(members,teams,scores,(teams)=>{
				let finalMembers = []
				finalMembers.push(["studentID","score"])
        for(let member in members){
          if(members.hasOwnProperty(member)){
						finalMembers.push([member,teams[members[member]]])
          }
        }
				csvParser.write(outFile,finalMembers,callback)
      })
    })
  })
}

module.exports = {
  generateMemberScores:generateMemberScores
}
