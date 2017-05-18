

$(document).ready(function(){

	var id    = document.getElementsByTagName("input")[0],
		pwd   = document.getElementsByTagName("input")[1],
		login = document.getElementsByTagName("input");
	var name = document.getElementById('selectId').children;
	console.log(name,'dd')
	console.log(id,'dd')
	console.log(pwd,'dd')
	console.log(login,'dd')
	console.log($('#submit'))
	$('#submit').click(function(){
		if(id.value==""&&pwd.value==""){
			alert("请输入用户名和密码");
			return false;
		}else if(id.value==""){
			alert("请输入用户名")
			return false
		}else if(pwd.value == ""){
			alert('请输入密码')
			return false
		}
	})


	$('#type1').click(function(){
		for(var i = 0; i < name.length; i++){
			name[i].name = 'stu_login'
		}
	})
	$('#type2').click(function(){
		for(var i = 0; i < name.length; i++){
			name[i].name = 'teacher_login'
		}
		console.log(name[1].name)
	})
	$('#type3').click(function(){
		for(var i = 0; i < name.length; i++){
			name[i].name = 'manager'
		}
		console.log(name[1].name)
	})
	$('#type4').click(function(){
		for(var i = 0; i < name.length; i++){
			name[i].name = 'admin'
		}
		console.log(name[1].name)
	})
});