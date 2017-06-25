var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		document.addEventListener("backbutton",back_handler,false);
		
		// Retrieve database
		var value={};
		var r_key;
		for(var i=0,len=localStorage.length;i<len;i++){
			r_key=localStorage.key(i);
			if(r_key.split("_")[0]==r_key){
				value=JSON.parse(localStorage.getItem(r_key));
				if(value!=null){
					title=value.title;
					title=title.replace(/[<>]/g,"");
					desc=value.desc;
					desc=desc.replace(/[<>]/g,"");
					date=Date.parse(value.date).toString("d-MMM-yyyy");
					time=Date.parse(value.time).toString("hh:mm tt");
					slider_val=localStorage.getItem(r_key+'_slider');
					//Create visual div
					$('#main').append('<div id="id_'+r_key+'" class="entry w3-card-4 w3-round w3-leftbar w3-rightbar w3-border-white w3-gray"><div id="id_'+r_key+'_title"  class="en_title w3-large">'+title+'</div><div id="id_'+r_key+'_desc" style="display:none;"><br>'+desc+'</div><br><div class="del_btn img_btn w3-ripple" onclick="del_task('+r_key+')"></div>Deadline: <span id="id_'+r_key+'_date">'+date+'</span>, <span id="id_'+r_key+'_time">'+time+'</span><br><br><div class="edit_btn img_btn w3-ripple" onclick="edit_task('+r_key+')"></div>Progress:<span id="id_'+r_key+'_slidervalue">'+slider_val+'</span>%<br><br><br><input id="id_'+r_key+'_slider" type="range" value="'+slider_val+'" step="10" oninput="update_slider('+r_key+')" onchange="store_slider('+r_key+')" ></div>');
				
				//Increment key
					key=parseInt(r_key)+1;
			
				}
			}
			
			//Load completed tasks
			else if(r_key.split("_")[1]=="completed"){
				value=JSON.parse(localStorage.getItem(r_key));
				if(value!=null){
					title=value.title;
					title=title.replace(/[<>]/g,"");
					desc=value.desc;
					desc=desc.replace(/[<>]/g,"");
					date=Date.parse(value.date).toString("d-MMM-yyyy");
					time=Date.parse(value.time).toString("hh:mm tt");
					date_now=localStorage.getItem(r_key+'date');
					time_now=localStorage.getItem(r_key+'time');
					//Create visual div
					$('#complete').append('<div id="id_'+r_key+'" class="entry w3-card-4 w3-round w3-leftbar w3-rightbar w3-border-white w3-gray"><div id="id_'+r_key+'_title"  class="en_title w3-large">'+title+'</div><div id="id_'+r_key+'_desc" style="display:none;"><br>'+desc+'</div><br><div class="del_btn img_btn w3-ripple" onclick="del_complete_task('+r_key.split("_")[0]+')"></div>Deadline: <span id="id_'+r_key+'_date">'+date+'</span>, <span id="id_'+r_key+'_time">'+time+'</span><br><br>Completed on: <span id="id_'+r_key+'date_date">'+date_now+'</span>, <span id="id_'+r_key+'time_time">'+time_now+'</span><br></div>');
				}
			}
		}
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

    }
};

//Global variables
var key=10000,key_for_editing=10000;
var title,desc,date=new Date(),time=new Date();
var max_title_chars=70;
var max_desc_chars=200;
var slider_val=0;
var store_slider_val=0;
var div_on_focus=0;
var tasker_mode=0;
var date_now=new Date(),time_now=new Date(),notif_date=new Date();	

//Fades input screen on clicking save and adds task
$('#tasker_save').click(function(e){
	//Create new entry
	if(tasker_mode==0){
		//Verify required inputs are not null
		if($('#task_assign_title').val()!="" && $('#task_assign_date').val()!="" && $('#task_assign_time').val()!=""){
			var jobj={};
		
			//Generate JSON object
			var elements=document.getElementById("task_assign_form").elements;
			for(var i=0; i<elements.length; i++){
				var item=elements.item(i);
				jobj[item.name]=item.value;
			}
			store_slider_val=0;
			title=jobj.title;
			title=title.replace(/[<>]/g,"");
			desc=jobj.desc;
			desc=desc.replace(/[<>]/g,"");
			if(desc==""){
				desc="No description";
				jobj['desc']="No description";
			}
			//Parsing using datejs
			date=Date.parse(jobj.date).toString("d-MMM-yyyy");
			time=Date.parse(jobj.time).toString("hh:mm tt");
		
			//Create visual div
			$('#main').append('<div id="id_'+key+'" class="entry w3-card-4 w3-round w3-leftbar w3-rightbar w3-border-white w3-gray"><div id="id_'+key+'_title"  class="en_title w3-large">'+title+'</div><div id="id_'+key+'_desc" style="display:none;"><br>'+desc+'</div><br><div class="del_btn img_btn w3-ripple" onclick="del_task('+key+')"></div>Deadline: <span id="id_'+key+'_date">'+date+'</span>, <span id="id_'+key+'_time">'+time+'</span><br><br><div class="edit_btn img_btn w3-ripple" onclick="edit_task('+key+')"></div>Progress:<span id="id_'+key+'_slidervalue">0</span>%<br><br><br><input id="id_'+key+'_slider" type="range" value="0" step="10" oninput="update_slider('+key+')" onchange="store_slider('+key+')"></div>');
			localStorage.setItem(key.toString(),JSON.stringify(jobj));
			localStorage.setItem(key+'_slider',store_slider_val);
			
			//Schedule notifications
			notif_date=Date.parse(date+' '+time);
			cordova.plugins.notification.local.schedule({
  				id         : key,
				title      : title,
				text       : desc,
				at         : notif_date
			});
			
					
			$('#tasker').fadeOut(500);
			
			//Increment key
			key++;
			
			//Clear form
			$('#task_assign_form')[0].reset();
		}
		else{
			//Warning toast
			$('#toastbar').text("You must enter a goal, date & time!");
			$('#toastbar').fadeIn(500);
			$('#toastbar').fadeOut(1000);
		}
	}
	
	//Edit entry
	else{
		//Verify required inputs are not null
		if($('#task_assign_title').val()!="" && $('#task_assign_date').val()!="" && $('#task_assign_time').val()!=""){
			var elements=document.getElementById("task_assign_form").elements;
			var jobj={};
			for(var i=0; i<elements.length; i++){
				var item=elements.item(i);
				jobj[item.name]=item.value;
			}
			title=jobj.title;
			desc=jobj.desc;
			if(desc==""){
				desc="No description";
				jobj['desc']="No description";
			}
			//Parsing using datejs
			date=Date.parse(jobj.date).toString("d-MMM-yyyy");
			time=Date.parse(jobj.time).toString("hh:mm tt");
			
			//Store JSON object using key_for_editing
			localStorage.setItem(key_for_editing.toString(),JSON.stringify(jobj));
			
			$('#id_'+key_for_editing+'_title').text(title);
			$('#id_'+key_for_editing+'_desc').text(desc);
			$('#id_'+key_for_editing+'_date').text(date);
			$('#id_'+key_for_editing+'_time').text(time);
			
			//Update notifications
			cordova.plugins.notification.local.cancel(key_for_editing);
			notif_date=Date.parse(date+' '+time);
			cordova.plugins.notification.local.schedule({
  				id         : key_for_editing,
				title      : title,
				text       : desc,
				at         : notif_date
			});
			
			$('#tasker').fadeOut(500);
			$('#task_assign_form')[0].reset();
			tasker_mode=0;
		}
		else{
			//Warning toast
			$('#toastbar').text("You must enter a goal, date & time!");
			$('#toastbar').fadeIn(500);
			$('#toastbar').fadeOut(1000);
		}
	}
});

//Shows input screen
function showinput(){
	$('#tasker').fadeIn(500);
	div_on_focus=1;
}

//Shows/hides description
$('body').on('click','.entry',function(e){
	if($(e.target).is('.img_btn') || $(e.target).is('.rangeslider__handle')){
		return;
	}
	else{
		$('#'+$(this).attr('id')+'_desc').slideToggle(500);
	}
});

//Deletes task
function del_task(k){
	navigator.notification.confirm('Are you sure?',final_del_task,'Delete task','Okay,Cancel');
	function final_del_task(button){
		if(button==1){
			localStorage.removeItem(k.toString());
			$('#id_'+k).slideUp(500);
			cordova.plugins.notification.local.cancel(k);
		}
	}
}

function del_complete_task(k){
	navigator.notification.confirm('Are you sure?',final_del_task,'Delete task','Okay,Cancel');
	function final_del_task(button){
		if(button==1){
			localStorage.removeItem(k+'_completed');
			$('#id_'+k+'_completed').slideUp(500);
		}
	}
}

function edit_task(k){
	key_for_editing=k;
	tasker_mode=1;
	$('#task_assign_title').val($('#id_'+k+'_title').text());
	if($('#id_'+k+'_desc').text()=="No description"){
		$('#task_assign_desc').val("");
	}
	else{
		$('#task_assign_desc').val($('#id_'+k+'_desc').text());
	}
	$('#task_assign_date').val(Date.parse($('#id_'+k+'_date').text()).toString("yyyy-MM-dd"));
	$('#task_assign_time').val(Date.parse($('#id_'+k+'_time').text()).toString("HH:mm"));
	showinput();
}

//Updates slider value
function update_slider(k){
	slider_val=document.getElementById("id_"+k+"_slider").value;
	$('#id_'+k+'_slidervalue').text(slider_val);
}

//Stores slider value
function store_slider(k){
	store_slider_val=document.getElementById("id_"+k+"_slider").value;
	if(store_slider_val==100){
		navigator.notification.confirm('Mark task as complete?',task_complete_handle,'Well done!','Okay,Nope');
		function task_complete_handle(button){
			if(button==1){
				//Mark as completed task and transfer across divs
				$('#id_'+k).slideUp(500);
				cordova.plugins.notification.local.cancel(k);
				title=$('#id_'+k+'_title').text();
				desc=$('#id_'+k+'_desc').text();
				date=$('#id_'+k+'_date').text();
				time=$('#id_'+k+'_time').text();
				date_now=Date.parse('now').toString('d-MMM-yyyy');
				time_now=Date.parse('now').toString('hh:mm tt');
				//Create visual div
				$('#complete').append('<div id="id_'+k+'_completed" class="entry w3-card-4 w3-round w3-leftbar w3-rightbar w3-border-white w3-gray"><div id="id_'+k+'_completed_title"  class="en_title w3-large">'+title+'</div><div id="id_'+k+'_completed_desc" style="display:none;"><br>'+desc+'</div><br><div class="del_btn img_btn w3-ripple" onclick="del_complete_task('+k+')"></div>Deadline: <span id="id_'+k+'_completed_date">'+date+'</span>, <span id="id_'+k+'_completed_time">'+time+'</span><br><br>Completed on: <span id="id_'+k+'_completeddate_date">'+date_now+'</span>, <span id="id_'+k+'_completedtime_time">'+time_now+'</span><br></div>');
				localStorage.setItem(k+'_completed',localStorage.getItem(k));
				localStorage.setItem(k+'_completeddate',date_now);
				localStorage.setItem(k+'_completedtime',time_now);
				localStorage.removeItem(k.toString());
			}
			else{
				//Reset back to 90
				$('#id_'+k+'_slidervalue').text('90');
				store_slider_val=90;
				localStorage.setItem(k+'_slider',store_slider_val);
				$('#id_'+k+'_slider').val(90).change();
			}
		}
	}
	else{
		localStorage.setItem(k+'_slider',store_slider_val);
	}
}

//Input validation
$('#task_assign_title').keyup(function(e){
	if($(this).val().length>max_title_chars){
		$(this).val($(this).val().substr(0,max_title_chars));
	}
});

$('#task_assign_desc').keyup(function(e){
	if($(this).val().length>max_desc_chars){
		$(this).val($(this).val().substr(0,max_desc_chars));
	}
});

//Show/hide menu
$('#viewmenu').click(function(){
	if(!($('#menu').hasClass('visible'))){
		$('#menu').animate({"left":"0%"},500).addClass('visible');
		div_on_focus=2;
	}
});

$('#main').click(function(e){
	if($('#menu').hasClass('visible') && $(e.target).is('.edit_btn')){
		div_on_focus=1;
		$('#menu').animate({"left":"-70vw"},500).removeClass('visible');
	}
	else if($('#menu').hasClass('visible') && !($(e.target).is('.edit_btn'))){
		div_on_focus=0;
		$('#menu').animate({"left":"-70vw"},500).removeClass('visible');
	}
});

//About app
function about_app(){
	div_on_focus=3;
	$('#menu').animate({"left":"-70vw"},500).removeClass('visible');
	$('#about_app').fadeIn(500);
}

//Show current tasks
function show_current_tasks(){
	$('#menu').animate({"left":"-70vw"},500).removeClass('visible');
	$('#complete').hide();
	$('#plus').show();
	$('#main').show();
}

//Show completed tasks
function show_completed_tasks(){
	$('#menu').animate({"left":"-70vw"},500).removeClass('visible');
	$('#main').hide();
	$('#plus').hide();
	$('#complete').show();
}

//Handles hardware back key
function back_handler(){
	if(div_on_focus==0){
		navigator.notification.confirm('',exit_app,'Exit','Okay,Cancel');
		function exit_app(button){
			if(button==1){
				navigator.app.exitApp();
			}
		}
	}
	else if(div_on_focus==1){
		$('#tasker').fadeOut(500);
		$('#task_assign_form')[0].reset();
		if(tasker_mode==1){
			tasker_mode=0;
		}
		div_on_focus=0;
	}
	else if(div_on_focus==2){
		div_on_focus=0;
		$('#menu').animate({"left":"-70vw"},500).removeClass('visible');
		$('#viewmenu').blur();
	}
	else if(div_on_focus==3){
		div_on_focus=0;
		$('#about_app').fadeOut(500);
	}
}