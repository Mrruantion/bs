// JavaScript Document

// window.onload = function () {
	// var id    = document.getElementsByTagName("input")[0],
	// 	pwd   = document.getElementsByTagName("input")[1],
	// 	login = document.getElementsByTagName("input");
	

	// var name = document.getElementById('selectId').children;
	// console.log(name,'dd')
	// console.log(id,'dd')
	// console.log(pwd,'dd')
	// console.log(login,'dd')
// 	// name.forEach(ele => {
// 	// 	console.log(ele,'ele')
// 	// })
	// for(var i = 0; i < name.length; i++){
	// 	var that = i;
	// 	name[i].onclick = function(){getName(that)}
	// }
// 	// console.log($('#selectId'))
// 	// function getName(){
// 	// 	// console.log(i)
// 	// }
// 	// var type1 = 
// 	// console.log($('#type1'))
// 	// console.log($('#type2'))
// 	// console.log($('#type3'))
// 	$('#type1')
// 	// console.log($('#submit'))
// 	var submit = document.getElementById('submit');
// 	// console.log(submit)
// 	submit.onclick = function(){
		// if(id.value==""&&pwd.value==""){
		// 	alert("请输入用户名和密码");
		// 	return false;
		// }else if(id.value==""){
		// 	alert("请输入用户名")
		// 	return false
		// }else if(pwd.value == ""){
		// 	alert('请输入密码')
		// 	return false
		// }
// 	}
// 	// for(var i=2; i<4; i++){
// 	// 	login[i].onclick = function(){
// 	// 		if(id.value=="" || pwd.value==""){
// 	// 			alert("啥都没写就想登录？！")
// 	// 			return false;
// 	// 		};
// 	// 	}
// 	// }
// }

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
			name[i].name = 'reg'
		}
		console.log(name[1].name)
	})
});