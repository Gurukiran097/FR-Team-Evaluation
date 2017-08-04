const fs = require('fs')
const readline = require('readline')

const read = function(inFile,callback){
  let inStream = fs.createReadStream(inFile)
  let data = []
  let rl = readline.createInterface({
    input:inStream
  })
  rl.on('line',(line)=>{
    line = line.split(",")
    data.push(line)
  })
  rl.on('close',()=>{
    inStream.close()
    callback(data)
  })
}



const write = function(data,outFile){
  let outStream = fs.createWriteStream(outFile)
  let counter = 0;
  data.forEach((line)=>{
    line = line.join(",")
    outStream.write(line+"\n",()=>{
      counter++;
      if(counter===data.length){
        outStream.close()
      }
    })
  })
}

module.exports = {
  read:read,
  write:write
}

