/**
* Self-adjusting interval to account for drifting
*
* @param {function} workFunc  Callback containing the work to be done
*                             for each interval
* @param {int}      interval  Interval speed (in milliseconds) - This
* @param {function} errorFunc (Optional) Callback to run if the drift
*                             exceeds interval
*/
function AdjustingInterval(workFunc, interval, errorFunc) {
  var that = this;
  var expected, timeout;
  this.interval = interval;

  this.start = function() {
    expected = Date.now() + this.interval;
    timeout = setTimeout(step, this.interval);
  }

  this.stop = function() {
    clearTimeout(timeout);
  }

  function step() {
    var drift = Date.now() - expected;
    if (drift > that.interval) {
      // You could have some default stuff here too...
      if (errorFunc) errorFunc();
    }
    workFunc();
    expected += that.interval;
    timeout = setTimeout(step, Math.max(0, that.interval-drift));
  }
}
//set bpm
$(document).ready(function() {

  var tick;
  var step = 0;
  var bpm = 120;
  var click = 0;
  var bar = 0;
  var current_tick = 0;
  var timer;
  var sound;
  var track = 1;
  var start_time = new Date();
  render()
  //render()
  $('#bpm').on('change', function(ev, value){
    bpm =  $('#bpm').val();
    console.log('bpm', bpm)
  })
  $('#track').on('change', function(ev, value){
    track =  $('#track').val();
    console.log('track', track)
  })
  $(document).keypress(function(event) {
     if (event.which == 32 ) {

          console.log('press', timer);
    if(current_tick) {
      stop()
    } else {
      start()
    }
  } //space

  })

  function render() {
    $('.led').css('background', 'yellow')
    $('.led:eq(' + click + ')').css('background', 'red')
    $('#current').text(bar)
    $('#steps').text(step + '/' + (track * 4))
    var time = new Date(Date.now() - start_time)
    $('#time').text(time.getMinutes() + ':' + (time.getSeconds()<10?'0':'')+time.getSeconds())
  }
  //timer
  function start() {
    if(timer) {
      timer.stop()
    }
    start_time = new Date();
    var bps = (bpm / 60)
    tick = 1000 /bps;
    bar= 0;
    console.log('start',click, bpm, bps, tick, current_tick,track)
    timer = new AdjustingInterval(function() {

      if(current_tick % (track * 4) === 0) {
        bar++
      }

      current_tick++;
      step = (current_tick % (track * 4)) ;
      if(step == 0) step = (track * 4) //last step
      sound = document.getElementById("audio2");
      if(click === 0) {
        sound = document.getElementById("audio1");
      }
      if($('[name="sound"]').is(':checked')) {
        sound.play();
      }
  console.log(current_tick, bar,  click, step, track)
      render()

      if(click === 3) {
        click = 0;
      } else {
        click++
      }


    }, tick)
    timer.start()
  }
  $('#start').on('click', start)

  function stop(){
    click = 0;
    bar= 0;
    step=0;
    current_tick = 0;
    start_time = new Date();
    timer.stop()
    render()
  }
  $('#stop').on('click', stop)

})
