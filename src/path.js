import {sub} from "./vector"
import {clamp} from "./math2"

export function getPointAtLength(path,length){
  let p=path.getPointAtLength(length)
  return {x:p.x, y:p.y}
}
export function getLength(path){
  return path.getTotalLength()
}
export function getPointAtPercent(path,percent){
  if(Array.isArray(path))
    return path[Math.round(clamp(percent)*(path.length-1))]

  return getPointAtLength(path,percent*getLength(path))
}
function distance(pointA,pointB){
  let d=sub(pointA,pointB)
  return Math.sqrt((d.x*d.x)+(d.y*d.y))
}
// This tries to find the point along the path that is closest to
// the point we're asking about.  It accomplishes this by dividing the
// path into 10 subdivisions, finding the closest subdivision, and then
// repeating with that subdivision 5 times
export function getLengthAtPoint(path,point,subdivisionsPerIteration=10,iterations=5){
  let pathLength=getLength(path)

  // call is down below, starts at beginning and ending of path
  return (function iterate(lower,upper){
    // get the length of the path between points
    let delta=upper-lower
    // calculate the size of each subdivision
    let step=delta/(subdivisionsPerIteration-1)

    // split the path into x pieces in an array
    let subdivisions=Array.from(Array(subdivisionsPerIteration))
      .map((v,i)=>{
        let subLength=lower+(step*i)
        let subPoint=getPointAtLength(path,subLength)
        let subDistance=distance(point,subPoint)

        // get the length of this piece, the point it starts at
        // and the straitline distance from that that start point to
        // the point we're calculating
        return {
          length:subLength,
          point:subPoint,
          distance:subDistance,
        }
      })
      // find the subDivision with the smallest distance
      .sort((a,b)=>a.distance-b.distance)
      .map(v=>v.length)
      .slice(0,2)

    // reduce iteration and return when it's 0
    if(!--iterations) return subdivisions[0]

    // repeat the subdividing process with the new subdivision
    return iterate(...subdivisions.sort((a,b)=>a-b))
  }(0,pathLength))
}
export function subdividePath(path,subdivisions,subdivideByDistance=false){
  let length=getLength(path)

  if(subdivideByDistance) subdivisions=length/subdivisions

  let subdivisionLength=length/subdivisions
  return Array.from(Array(Math.floor(subdivisions)))
    .map((cur,i)=>getPointAtLength(path,i*subdivisionLength))
}
