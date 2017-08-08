const chai = require('chai')
const path = require('path')
const reader = require(path.join(__dirname,'../main.js'))
const io = require(path.join(__dirname,'../csvParser.js'))
const mocha = require('mocha')
const fs = require('fs')

var expect = chai.expect

describe("Testing Final Score Files",function(){
  var dataA;
  var dataB;
  before(function(done){
    reader.generateMemberScores(path.join(__dirname,'../Data/team.csv'),path.join(__dirname,'../Data/scores.csv'),path.join(__dirname,'../Data/tScores.csv'),()=>{
      io.read(path.join(__dirname,'../Data/teamScores.csv'),(correctData)=>{
        correctData.shift()
        io.read(path.join(__dirname,'../Data/tScores.csv'),(generatedData)=>{
          generatedData.shift()
          dataA = correctData
          dataB = generatedData
          done();
        })
      })
    })
  })

  it("parses the input files and generate final scores",function(){
    expect(dataB).to.have.same.deep.members(dataA)
  })
})
