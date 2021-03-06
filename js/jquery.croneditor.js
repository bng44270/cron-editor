Array.prototype.clone = function() {
  retAr = new Array();
  for (i = 0; i < this.length; i++) {
    retAr[i] = this[i];
  }
  return retAr    
};

$.fn.croneditor = function(opts) {

  var el = this;
  
  // Write the HTML template to the document
  $(el).html(tmpl);
  
  $('#cronLine').prop('disabled',true);
  $('#cronString').prop('disabled',true);

  var cronArr = ["*", "*", "*", "*", "*", "*"];
  if (typeof opts.value === "string") {
    cronArr = opts.value.split(' ');
  }

  $( ".tabs" ).tabs({
    activate: function( event, ui ) {
      switch ($(ui.newTab).attr('id')) {

        // Seconds
        case 'button-second-every':
          cronArr[0] = "*";
        break;
        case 'button-second-n':
          cronArr[0] = "*/" + $( "#tabs-second .slider" ).slider("value");
        break;
        case 'button-second-each':
          cronArr[0] = "*";
          $('.tabs-second-format').html('')
          drawEachSeconds();
        break;

        // Minutes
        case 'button-minute-every':
          cronArr[1] = "*";
        break;
        case 'button-minute-n':
          cronArr[1] = "*/" + $( "#tabs-minute .slider" ).slider("value");
        break;
        case 'button-minute-each':
          cronArr[1] = "*";
          // TODO: toggle off selected minutes on load
          //$('.tabs-minute-format input[checked="checked"]').click()
          $('.tabs-minute-format').html('');
          drawEachMinutes();
        break;

        // Hours
        case 'button-hour-every':
           cronArr[2] = "*";
        break;
        case 'button-hour-n':
          cronArr[2] = "*/" + $( "#tabs-hour .slider" ).slider("value");
        break;
        case 'button-hour-each':
          cronArr[2] = "*";
          $('.tabs-hour-format').html('');
          drawEachHours();
         break;

         // Days
         case 'button-day-every':
            cronArr[3] = "*";
         break;
         case 'button-day-each':
           cronArr[3] = "*";
           $('.tabs-day-format').html('');
           drawEachDays();
          break;

          // Months
          case 'button-month-every':
             cronArr[4] = "*";
          break;
          case 'button-month-each':
            cronArr[4] = "*";
            $('.tabs-month-format').html('');
            drawEachMonths();
           break;

           // Weeks
           case 'button-week-every':
              cronArr[5] = "*";
           break;
           case 'button-week-each':
             cronArr[5] = "*";
             $('.tabs-week-format').html('');
             drawEachWeek();
            break;

      }

      drawCron();
	  
    }
  });

  function drawCron () {

    var newCron = cronArr.join(' ');
    $('#cronString').val(newCron);
	$('#cronLine').val(newCron + " " + $('#cronCmd').val());
	checkSeconds();
    // TODO: add back next estimated cron time
    /*
    var last = new Date();
    $('.next').html('');
    var job = new cron.CronTime(newCron);
    var next = job._getNextDateFrom(new Date());
    $('.next').append('<span id="nextRun">' + dateformat(next, "ddd mmm dd yyyy HH:mm:ss") + '</span><br/>');
    */
    /*
    setInterval(function(){
      drawCron();
    }, 500);
    */
    /*
    $('#cronString').keyup(function(){
      cronArr = $('#cronString').val().split(' ');
      console.log('updated', cronArr)
    });
    */
  }

  function checkSeconds() {
    if ($('#useseconds').prop('checked')) {
      var newCron = cronArr.clone();
	  delete newCron[0];
      $('#cronLine').val(newCron.join(' ').replace(/^[ \t]*/,"") + " " + $('#cronCmd').val());
	}
	else {
      $('#cronLine').val(cronArr.join(' ') + " " + $('#cronCmd').val());
	}
  }
  
  $('#cronCmd').keyup(function() {
    $('#cronLine').val($('#cronString').val() + " " + $('#cronCmd').val());
    $('#copyCronLine').removeClass('fa-clipboard-list');
    $('#copyCronLine').addClass('fa-clipboard');
    checkSeconds();
  });

  $('#cronCmd').blur(function() {
    $('#cronLine').val($('#cronString').val() + " " + $('#cronCmd').val());
    $('#copyCronLine').removeClass('fa-clipboard-list');
    $('#copyCronLine').addClass('fa-clipboard');
    checkSeconds();
  });
  
  $('#cronString').keyup(function() {
    $('#cronLine').val($('#cronString').val() + " " + $('#cronCmd').val());
    $('#copyCronLine').removeClass('fa-clipboard-list');
    $('#copyCronLine').addClass('fa-clipboard');
    checkSeconds();
  });
  
  $('#cronString').blur(function() {
    $('#cronLine').val($('#cronString').val() + " " + $('#cronCmd').val());
    $('#copyCronLine').removeClass('fa-clipboard-list');
    $('#copyCronLine').addClass('fa-clipboard');
    checkSeconds();
  });
  
  $('#copyCronLine').click(function() {
    $('#cronLine').prop('disabled',false);
    $('#cronLine').select();
    document.execCommand("Copy");
    $('#cronLine').prop('disabled',true);
    $('#copyCronLine').removeClass('fa-clipboard');
    $('#copyCronLine').addClass('fa-clipboard-list');
  });
  
  $('#useseconds').click(function() {
    checkSeconds();
  });

  $('#showset').click(function() {
    $('#maindiv').hide();
    $('#setdiv').fadeIn();
  });

  $('#setback').click(function() {
    $('#setdiv').hide();
    $('#maindiv').fadeIn();
  });

  $('#showlic').click(function() {
    $('#maindiv').hide();
    $('#license').fadeIn();
  });

  $('#closelic').click(function() {
    $('#license').hide();
    $('#maindiv').fadeIn();
  });

  $('#clear').click(function(){
    cronArr = ["*","*","*","*","*", "*"];
    $('#cronCmd').val('');
    drawCron();
    $('#copyCronLine').removeClass('fa-clipboard-list');
    $('#copyCronLine').addClass('fa-clipboard');
    
  });

  $( "#tabs-second .slider" ).slider({
    min: 1,
    max: 59,
    slide: function( event, ui ) {
      cronArr[0] = "*/" + ui.value;
      $('#tabs-second-n .preview').html('Every ' + ui.value + ' seconds');
      drawCron();
    }
  });

  $( "#tabs-minute .slider" ).slider({
    min: 1,
    max: 59,
    slide: function( event, ui ) {
      cronArr[1] = "*/" + ui.value;
      $('#tabs-minute-n .preview').html('Every ' + ui.value + ' minutes');
      drawCron();
    }
  });

  $( "#tabs-hour .slider" ).slider({
    min: 1,
    max: 23,
    slide: function( event, ui ) {
      cronArr[2] = "*/" + ui.value;
      $('#tabs-hour-n .preview').html('Every ' + ui.value + ' Hours');
      drawCron();
    }
  });

  // TOOD: All draw* functions can be combined into a few smaller methods

 function drawEachSeconds () {
    // seconds
    for (var i = 0; i < 60; i++) {
      var padded = i;
      if(padded.toString().length === 1) {
        padded = "0" + padded;
      }
      $('.tabs-second-format').append('<input type="checkbox" id="second-check' + i + '"><label for="second-check' + i + '">' + padded + '</label>');
      if (i !== 0 && (i+1) % 10 === 0) {
        $('.tabs-second-format').append('<br/>');
      }
    }
    $('.tabs-second-format input').button();
    $('.tabs-second-format').buttonset();

    $('.tabs-second-format input[type="checkbox"]').click(function(){
      var newItem = $(this).attr('id').replace('second-check', '');
      if(cronArr[0] === "*") {
        cronArr[0] = $(this).attr('id').replace('second-check', '');
      } else {

        // if value already in list, toggle it off
        var list = cronArr[0].split(',');
        if (list.indexOf(newItem) !== -1) {
          list.splice(list.indexOf(newItem), 1);
          cronArr[0] = list.join(',');
        } else {
          // else toggle it on
          cronArr[0] = cronArr[0] + "," + newItem;
        }
        if(cronArr[0] === "") {
          cronArr[0] = "*";
        }
      }
      drawCron();
    });

  } 

  function drawEachMinutes () {
    // minutes
    for (var i = 0; i < 60; i++) {
      var padded = i;
      if(padded.toString().length === 1) {
        padded = "0" + padded;
      }
      $('.tabs-minute-format').append('<input type="checkbox" id="minute-check' + i + '"><label for="minute-check' + i + '">' + padded + '</label>');
      if (i !== 0 && (i+1) % 10 === 0) {
        $('.tabs-minute-format').append('<br/>');
      }
    }
    $('.tabs-minute-format input').button();
    $('.tabs-minute-format').buttonset();

    $('.tabs-minute-format input[type="checkbox"]').click(function(){
      var newItem = $(this).attr('id').replace('minute-check', '');
      if(cronArr[1] === "*") {
        cronArr[1] = $(this).attr('id').replace('minute-check', '');
      } else {

        // if value already in list, toggle it off
        var list = cronArr[1].split(',');
        if (list.indexOf(newItem) !== -1) {
          list.splice(list.indexOf(newItem), 1);
          cronArr[1] = list.join(',');
        } else {
          // else toggle it on
          cronArr[1] = cronArr[1] + "," + newItem;
        }
        if(cronArr[1] === "") {
          cronArr[1] = "*";
        }
      }
      drawCron();
    });

  }
  

  function drawEachHours () {
    // hours
    for (var i = 0; i < 24; i++) {
      var padded = i;
      if(padded.toString().length === 1) {
        padded = "0" + padded;
      }
      $('.tabs-hour-format').append('<input type="checkbox" id="hour-check' + i + '"><label for="hour-check' + i + '">' + padded + '</label>');
      if (i !== 0 && (i+1) % 12 === 0) {
        $('.tabs-hour-format').append('<br/>');
      }
    }

    $('.tabs-hour-format input').button();
    $('.tabs-hour-format').buttonset();


    $('.tabs-hour-format input[type="checkbox"]').click(function(){
      var newItem = $(this).attr('id').replace('hour-check', '');
      if(cronArr[2] === "*") {
        cronArr[2] = $(this).attr('id').replace('hour-check', '');
      } else {

        // if value already in list, toggle it off
        var list = cronArr[2].split(',');
        if (list.indexOf(newItem) !== -1) {
          list.splice(list.indexOf(newItem), 1);
          cronArr[2] = list.join(',');
        } else {
          // else toggle it on
          cronArr[2] = cronArr[2] + "," + newItem;
        }
        if(cronArr[2] === "") {
          cronArr[2] = "*";
        }
      }
      drawCron();
    });

  };

  function drawEachDays () {

    // days
    for (var i = 1; i < 32; i++) {
      var padded = i;
      if(padded.toString().length === 1) {
        padded = "0" + padded;
      }
      $('.tabs-day-format').append('<input type="checkbox" id="day-check' + i + '"><label for="day-check' + i + '">' + padded + '</label>');
      if (i !== 0 && (i) % 7 === 0) {
        $('.tabs-day-format').append('<br/>');
      }
    }

    $('.tabs-day-format input').button();
    $('.tabs-day-format').buttonset();

    $('.tabs-day-format input[type="checkbox"]').click(function(){
      var newItem = $(this).attr('id').replace('day-check', '');
      if(cronArr[3] === "*") {
        cronArr[3] = $(this).attr('id').replace('day-check', '');
      } else {

        // if value already in list, toggle it off
        var list = cronArr[3].split(',');
        if (list.indexOf(newItem) !== -1) {
          list.splice(list.indexOf(newItem), 1);
          cronArr[3] = list.join(',');
        } else {
          // else toggle it on
          cronArr[3] = cronArr[3] + "," + newItem;
        }
        if(cronArr[3] === "") {
          cronArr[3] = "*";
        }

      }
      drawCron();
    });

  };


  function drawEachMonths () {
    // months
    var months = [null, 'Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    for (var i = 1; i < 13; i++) {
      var padded = i;
      if(padded.toString().length === 1) {
        //padded = "0" + padded;
      }
      $('.tabs-month-format').append('<input type="checkbox" id="month-check' + i + '"><label for="month-check' + i + '">' + months[i] + '</label>');
    }

    $('.tabs-month-format input').button();
    $('.tabs-month-format').buttonset();


    $('.tabs-month-format input[type="checkbox"]').click(function(){
      var newItem = $(this).attr('id').replace('month-check', '');
      if(cronArr[4] === "*") {
        cronArr[4] = $(this).attr('id').replace('month-check', '');
      } else {

        // if value already in list, toggle it off
        var list = cronArr[4].split(',');
        if (list.indexOf(newItem) !== -1) {
          list.splice(list.indexOf(newItem), 1);
          cronArr[4] = list.join(',');
        } else {
          // else toggle it on
          cronArr[4] = cronArr[4] + "," + newItem;
        }
        if(cronArr[4] === "") {
          cronArr[4] = "*";
        }

      }
      drawCron();
    });

  };

  function drawEachWeek () {
    // weeks
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (var i = 0; i < 7; i++) {
      var padded = i;
      if(padded.toString().length === 1) {
        //padded = "0" + padded;
      }

      $('.tabs-week-format').append('<input type="checkbox" id="week-check' + i + '"><label for="week-check' + i + '">' + days[i] + '</label>');
    }

    $('.tabs-week-format input').button();
    $('.tabs-week-format').buttonset();

    $('.tabs-week-format input[type="checkbox"]').click(function(){
      var newItem = $(this).attr('id').replace('week-check', '');
      if(cronArr[5] === "*") {
        cronArr[5] = $(this).attr('id').replace('week-check', '');
      } else {

        // if value already in list, toggle it off
        var list = cronArr[5].split(',');
        if (list.indexOf(newItem) !== -1) {
          list.splice(list.indexOf(newItem), 1);
          cronArr[5] = list.join(',');
        } else {
          // else toggle it on
          cronArr[5] = cronArr[5] + "," + newItem;
        }
        if(cronArr[5] === "") {
          cronArr[5] = "*";
        }

      }
      drawCron();
    });

  };

  // TODO: Refactor these methods into smaller methods
  drawEachSeconds();
  drawEachMinutes();
  drawEachHours();
  drawEachDays();
  drawEachMonths();
  drawCron();
};

// HTML Template for plugin
var tmpl = '<div id="maindiv">\
<span style="font-size:18px;font-style:italic;">Command:</span><br/>\
<input type="text" id="cronCmd" /><br/>\
<input type="text" id="cronString" value="* * * * * *" style="display:none;"/>\
<span style="font-size:18px;font-style:italic;">Cron Line:</span><br/>\
<input type="text" id="cronLine" /><i class="fas fa-cog fa-3x" id="showset" style="cursor:pointer;" title="Show settings"></i><br/>\
<input type="checkbox" id="useseconds"><span style="font-size:18px;font-style:italic;">Remove Seconds Field</span><br/>\
<br/><br/>\
<i class="fas fa-clipboard fa-3x" id="copyCronLine" style="cursor:pointer;" title="Copy cron line"></i><span style="width:30px;display:inline-block;"></span><i class="far fa-trash-alt fa-3x" id="clear" style="cursor:pointer;" title="Reset cron line"></i><span style="width:30px;display:inline-block;"></span><i class="fas fa-edit fa-3x" id="showlic" style="cursor:pointer;" title="Show License"></i>\
</div>\
<div id="setdiv" style="display:none">\
<!-- TODO: add back next estimated time -->\
<!-- <span>Will run next at:<em><span class="next"></span></em></span> -->\
<!-- the cron editor will be here -->\
<div id="tabs" class="tabs">\
  <ul>\
    <li><a href="#tabs-second">Second</a></li>\
    <li><a href="#tabs-minute">Minute</a></li>\
    <li><a href="#tabs-hour">Hour</a></li>\
    <li><a href="#tabs-day">Day of Month</a></li>\
    <li><a href="#tabs-month">Month</a></li>\
    <li><a href="#tabs-week">Day of Week</a></li>\
  </ul>\
  <div id="tabs-second">\
    <div class="tabs">\
      <ul>\
        <li id="button-second-every"><a href="#tabs-second-every">Every second</a></li>\
        <li id="button-second-n"><a href="#tabs-second-n">Every n seconds</a></li>\
        <li id="button-second-each"><a href="#tabs-second-each">Each Selected Second</a></il>\
      </ul>\
      <div id="tabs-second-every" class="preview">\
        <div>*</div>\
        <div>Every second.</div>\
      </div>\
      <div id="tabs-second-n">\
        <div class="preview"> Every 1 seconds</div>\
        <div class="slider"></div>\
      </div>\
      <div id="tabs-second-each" class="preview">\
        <div>Each selected seconds</div><br/>\
        <div class="tabs-second-format"></div>\
      </div>\
    </div>\
  </div>\
  <div id="tabs-minute">\
    <div class="tabs">\
      <ul>\
        <li id="button-minute-every"><a href="#tabs-minute-every">Every Minute</a></li>\
        <li id="button-minute-n"><a href="#tabs-minute-n">Every n minutes</a></li>\
        <li id="button-minute-each"><a href="#tabs-minute-each">Each Selected Minute</a></li>\
      </ul>\
      <div id="tabs-minute-every" class="preview">\
        <div>*</div>\
        <div>Every minute.</div>\
      </div>\
      <div id="tabs-minute-n">\
        <div class="preview"> Every 1 minutes</div>\
        <div class="slider"></div>\
      </div>\
      <div id="tabs-minute-each" class="preview">\
        <div>Each selected minute</div><br/>\
        <div class="tabs-minute-format"></div>\
      </div>\
    </div>\
  </div>\
  <div id="tabs-hour">\
    <div class="tabs">\
      <ul>\
        <li id="button-hour-every"><a href="#tabs-hour-every">Every Hour</a></li>\
        <li id="button-hour-n"><a href="#tabs-hour-n">Every n Hours</a></li>\
        <li id="button-hour-each"><a href="#tabs-hour-each">Each Selected Hour</a></li>\
      </ul>\
      <div id="tabs-hour-every" class="preview">\
        <div>*</div>\
        <div>Every hour</div>\
      </div>\
      <div id="tabs-hour-n">\
        <div class="preview">Every 1 hours</div>\
        <div class="slider"></div>\
      </div>\
      <div id="tabs-hour-each" class="preview">\
        <div>Each selected hour</div><br/>\
        <div class="tabs-hour-format"></div>\
      </div>\
    </div>\
  </div>\
  <div id="tabs-day">\
    <div class="tabs">\
      <ul>\
        <li id="button-day-every"><a href="#tabs-day-every">Every Day</a></li>\
        <li id="button-day-each"><a href="#tabs-day-each">Each Day</a></li>\
      </ul>\
      <div id="tabs-day-every" class="preview">\
        <div>*</div>\
        <div>Every Day</div>\
      </div>\
      <div id="tabs-day-each" class="preview">\
        <div>Each selected Day</div><br/>\
        <div class="tabs-day-format"></div>\
      </div>\
    </div>\
  </div>\
  <div id="tabs-month">\
    <div class="tabs">\
      <ul>\
        <li id="button-month-every"><a href="#tabs-month-every">Every Month</a></li>\
        <li id="button-month-each"><a href="#tabs-month-each">Each Month</a></li>\
      </ul>\
      <div id="tabs-month-every" class="preview">\
        <div>*</div>\
        <div>Every month</div>\
      </div>\
      <div id="tabs-month-each" class="preview">\
        <div>Each selected month</div><br/>\
        <div class="tabs-month-format"></div>\
      </div>\
    </div>\
  </div>\
  <div id="tabs-week">\
    <div class="tabs">\
      <ul>\
        <li id="button-week-every"><a href="#tabs-week-every">Every Week</a></li>\
        <li id="button-week-each"><a href="#tabs-week-each">Each Week</a></li>\
      </ul>\
      <div id="tabs-week-every" class="preview">\
        <div>*</div>\
        <div>Every Day</div>\
      </div>\
      <div id="tabs-week-each">\
        <div class="preview">Each selected Day</div><br/>\
        <div class="tabs-week-format"></div>\
      </div>\
    </div>\
  </div>\
</div>\
<br/>\
<i class="fas fa-arrow-left fa-3x" id="setback" style="cursor:pointer" title="Go Back"></i>\
</div>\
<div id="license" style="display:none;">\
<p style="font-size:14px;font-style:italic;">\
Copyright (c) 2014 Marak Squires<br/>\
<br/>\
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:<br/>\
<br/>\
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.<br/>\
<br/>\
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.<br/>\
</p>\
<i class="fas fa-arrow-left fa-3x" id="closelic" title="Go Back" style="cursor:pointer;"></i>\
</div>';
