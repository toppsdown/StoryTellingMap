import 'babel-polyfill'
import CanvasMap from './canvas-map'

let map=CanvasMap({
  textContainer:document.querySelector('.text'),
  // mapSrc:'img/map.svg',
  mapSrc:'../mymaps/svgs/denver_trip_working.svg',
  trailVisitedColor:'#47DBB4',
  fontPresentColor:'#5D5C56',
}).appendTo('.container')
