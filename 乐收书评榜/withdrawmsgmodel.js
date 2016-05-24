function initExpressescs() {
		 var ajax = new AjaxHelper();
	 ajax.OnWaitting = function(){};
		ajax.AsyncGet("/services/manage/getnodeexpress/"+$.cookie("ckstation")+"?id="+Math.random(),function (args) {
			
			  var rs =  eval('('+args+')');
			  
			  var expressSet = rs.result.expresses;
			
			  if (expressSet && typeof(expressSet) != "undefined")
			  {
				  for(var i=0;i<rs.result.expresses.length;i++)
				  {
					 if(rs.result.expresses[i].name){
 						 if( rs.result.expresses[i].name.substring(0,2)!= "顺丰")
						$("#sel_express").append("<option value='"+rs.result.expresses[i].id+"'>"+rs.result.expresses[i].name+"</option>");
					  
					  var option = "<option value='"+rs.result.expresses[i].id+"'>"+rs.result.expresses[i].name+"</option>";
					  
					  $("#ck_check_status").append($(option));



}
					 
				  }
				  
				  $("#sel_express").attr("disabled",false); 
				  $("#ck_check_status").attr("disabled",false); 
			  }
			  else
			  {
				  $("#sel_express").append("<option value='-999'>空缺</option>");
				  $("#sel_express").attr("disabled",true); 
			  }
		});
	
}

function billreg(index)
{
	if(!iswritable()) return;
	var raws = $('#dg').datagrid('getData').rows; 
      	var row  = raws[index];

	$("#sel_exp_billreg").text("(" + row.name+ ")");

	$("#billreg_expid").val(row.id);
	$("#billreg_operator").val($.cookie("userid"));
	$("#billreg_batchid").val(row.batch.id);
	$("#billreg_num").val("");
	$("#sel_num_billreg").text(parseInt(row.batch.num) - parseInt(row.batch.nimport)); 

	$('#billreg').window('open'); 
}

function billregsubmit()
{
	var expid = $("#billreg_expid").val();
	var operator = $("#billreg_operator").val();
	var num = $("#billreg_num").val();
	var batchid = $("#billreg_batchid").val();
	var barcodestart = $.trim($("#billreg_barcodestart").val());


	var numold = $.trim($("#sel_num_billreg").text());

	if(isNaN(num)) 
	{
		var msg = "请输入整数！";
		dialog("text", "提示", msg );
		return;
	};

	if (parseInt(num) == 0) 
	{
		var msg = "面单登记数不能为0！";
		dialog("text", "提示", msg );
		return;
	}

	if (parseInt(numold) < parseInt(num) )
	{
		dialog("text", "提示", "实际发放数量不能超过申请数量！" );
		return;
	}

	 $.messager.confirm('面单登记确认!', '首单单号【<b>' + barcodestart  + '</b>】 个数【<b>' + num + "</b>】<br />请确认录入是否正确?",function(r){   

      	 if (r){   
		var postData = "nodeid=" + $.cookie("ckstation") + "&expid=" + expid
				+ "&batchid=" + batchid + "&barcodestart=" + barcodestart + "&operator=" + operator + "&num="
				+ num + "&remark=thanks";

		var ajax = new AjaxHelper();		

		ajax.AsyncPost("/services/manage/expbillimport", postData, function(args) {
			var result = eval('(' + args + ')');

			if (result.result && result.result.code == 200) {
				//alert(args + 'test' + postData);
				var msg = "登记成功！";
				dialog("text", "提示", msg );

				setTimeout(function(){Search_click(0);},1500);
				top.checkdanstatus();
				
			}
			else
			{
				var msg = "提交失败！";
				dialog("text", "提示", msg );
			}

		})
		
     		$('#billreg').window('close');
	 }   

  	});  
	

	
}

function billregcancel()
{
	$('#billreg').window('close');
}

function billapply(index)
{
 	if(!iswritable()) return;
	var raws = $('#dg').datagrid('getData').rows; 
        var row  = raws[index];

	$("#sel_exp_bill").text("(" + row.name+ ")");
	$("#billapply_expid").val(row.id);
	$("#billapply_unitprice").val(row.batch.unitprice);
	$("#billapply_operator").val($.cookie("userid"));
	$("#billapply_num").val(row.batch.num);
	$('#billapply').window('open');
}

function billbatchdiscard()
{	

	

	

 	var barcode = $.trim($("#billdis_barcode").val());
	var operator = $.cookie("userid");
	var expid = $("#sel_express").val();
	var   type = "checkcode";

	$("#errmsg").html("");

	if(barcode.length == 11)
	{
		type  = "mobile";
		$("#suffix_mobile_pan").hide();	
	}
	else if ( barcode.length == 4 && $("#suffix_mobile_pan").is(":hidden"))
	{		

		$("#suffix_mobile_pan").show();	
		$("#suffix_mobile").focus();
		return

	}
	else
	{

		var msg ="";

		if("" == barcode)
		{ 
		   msg = "请输入手机或取件密码！"; $("#billdis_barcode").focus();
		}
		else if ( barcode.length  != 4 && barcode.length  != 11) 
		{
		    msg = "请输入手机11位号码或取件密码4位数字！";
		}
		/*else if ( $("#suffix_mobile").val().length  != 4 || $("#suffix_mobile").val() == "") 
		{
		    msg = "请输入手机后四位！";$("#suffix_mobile").focus();
		}

		if ( $("#suffix_mobile").val().length  != 4 || barcode.length  != 4) 
		{
		   	$("#errmsg").html("<span style='color:#ff0000;'>" + msg + "</span>");
			return;
		}


		*/
		if ( barcode.length  != 4) 
		{
		   	$("#errmsg").html("<span style='color:#ff0000;'>" + msg + "</span>");
			return;
		}

		

	}
	getuserdepositpackages();

	
}


function getuserdepositpackages()
{	
 	var barcode = $.trim($("#billdis_barcode").val());
	var operator = $.cookie("userid");
	var expid = $("#sel_express").val();
	var   type = "checkcode";

	$("#errmsg").html("");

	if(barcode.length == 11)
	{
		type  = "mobile";
		
	}
	else if ( barcode.length == 4)
	{		

		type  = "checkcode";

	}
	
	
	var ajax = new AjaxHelper();	

			ajax.AsyncGet("/services/manage/getuserdepositpackages/" + $.cookie("ckstation")+ "/" + type + "/" + barcode + "?id=" + Math.random(), function(args) {		
	
			var result = eval('(' + args + ')');

			if (result.result.code == 200) {
			
			
			var resultdata = {};

			resultdata.rows = result.result.packages;
			resultdata.total = result.result.total;


				if(resultdata.rows && resultdata.rows.length >0 )
			{
				//if ( type == "checkcode"  && resultdata.rows[0].mobile.indexOf( $.trim($("#suffix_mobile").val())) != -1)
				if ( type == "checkcode")
				{
					$('#comfirmDetails').window('open');
					$('#createtaskbtn').focus();

					$('#userpkgs').datagrid('loadData', resultdata);
					getpkguser(resultdata.rows);

					return 

				}

				if( type == "mobile")
				{
					$('#comfirmDetails').window('open');
					$('#createtaskbtn').focus();

					$('#userpkgs').datagrid('loadData', resultdata);

					getpkguser(resultdata.rows);

					return

				}
				
				$("#errmsg").html("<span style='color:#ff0000'>电话不匹配!</span>");
			  
			}
			else{$("#errmsg").html("<span style='color:#ff0000'>没有找到包裹!</span>")}
			

		
			
			}
			else
			{  
			   $("#errmsg").html("<span style='color:#4C6ACD'>" + result.result.message + "</span>");
			   return;

			}		
			})


	

	
}

function clearsearchdata()
{

	$("#billdis_barcode").val("");
	$("#suffix_mobile").val("");
	
	
}

	var   _pkgs;
	var       _pkgparams = {};


function getpkguser(pkgs)
{

	clearsearchdata();

	_pkgs = pkgs

	var mobile = "";
	var barcodes = [];
	_pkg_list = [];
	_pkgparams.autonum = 0;
	var  rgnum = 0;
	_pkgparams.total= pkgs.length;
	var outsend = 0;

	_pkgparams.outhouse =  0;
	_pkgparams.outsending = 0;

	for( var i = 0; i < pkgs.length; i++)
	{

		mobile  =  pkgs[i].mobile;

		var barcode = '"' + pkgs[i].barcode + '"';

		if (pkgs[i].locker.category== "1")
		{

			rgnum++;
			
			barcodes.push(barcode);
			_pkg_list.push(barcode);
		}
		else if(pkgs[i].locker.category== "0")
		{

			_pkgparams.autonum++;
		}

		if (pkgs[i].outsend== "1")
		{

			outsend++;
		}

		if (pkgs[i].outsend== "1" && pkgs[i].event== "outsend" &&  pkgs[i].subevent == "withdraw")
		{

			_pkgparams.outsending++;
		}

		if ((pkgs[i].outsend== "1" && pkgs[i].event== "deposit" &&  pkgs[i].subevent == "outsend")
			|| (pkgs[i].outsend== "1" && pkgs[i].event== "outsend" &&  pkgs[i].subevent == "return"))

		{

			_pkgparams.outhouse++;
		}


		

	}

	$("#c_total").html(_pkgparams.total);
	
	if (parseInt(_pkgparams.total) == 0)
	{
		
		$("#c_total").parent().hide();

	}


	$("#c_auto").html(_pkgparams.autonum);
	if (parseInt(_pkgparams.autonum) == 0)
	{
		
		$("#c_auto").parent().hide();

	}
	else
	{
		$("#c_auto").parent().show();

	}

	$("#c_rg").html(rgnum);
	if (parseInt(rgnum) == 0)
	{
		
		$("#c_rg").parent().hide();

	}	
	
	$("#c_out").html(outsend);

	$("#c_ow").html(_pkgparams.outsending);
	$("#c_house").html(_pkgparams.outhouse);

	querywebuserdeliverytaskpackages(barcodes.join(","),mobile,"-");

	return;

	var ajax = new AjaxHelper();	

			ajax.AsyncGet("/services/manage/getpkguser/" + mobile+ "?id=" + Math.random(), function(args) {		
	
			var result = eval('(' + args + ')');

			if (result.result.code == 200) {

				var userinfo = result.result.user;	
				
				querywebuserdeliverytaskpackages(barcodes.join(","),mobile,userinfo.uid);


			}
			else
			{  
			   $("#errmsg").html("<span style='color:#4C6ACD'>" + result.result.message + "</span>");
			   return;

			}		
			})



}

var _barcodes;
var _mobile;
var _uid;

var _pkg_list = [];
var _tsk_list = [];

function querywebuserdeliverytaskpackages(barcodes,mobile,uid)
{
	_barcodes = barcodes;
	_mobile = mobile;
	_uid = uid ;

	var postData = "nodeid=" + $.cookie("ckstation") +  "&barcodes=" + barcodes +"&mobile=" + mobile +"&uid=" + uid;
             	var ajax = new AjaxHelper();
             	
                 ajax.AsyncPost("/services/manage/querywebuserdeliverytaskpackages/" + "?id=" + Math.random(),postData,function (args) 
                 {

			var result = eval('(' + args + ')');

			if (result.result.code == 200) {
			
			
			var resultdata = {};

			resultdata.rows = result.result.taskpackages;
			resultdata.total = resultdata.rows.length;

			for(var i = 0;i < resultdata.rows.length;i++)
			{
				var tbarcode = '"' + resultdata.rows[i].barcode + '"';
				 _tsk_list.push(tbarcode);
			}

			_pkgparams.taskwding = resultdata.total;	
			_pkgparams.waitwd = _pkgparams.total - _pkgparams.taskwding - _pkgparams.outsending - _pkgparams.autonum;
			
			$("#c_ts").html(_pkgparams.taskwding);
			$("#c_wait").html(_pkgparams.waitwd);

			$('#usertasks').datagrid('loadData', resultdata);

				
				
			
			}
			else
			{  
			   $("#errmsg").html("<span style='color:#4C6ACD'>" + result.result.message + "</span>");
			   return;

			}
                    
                 });

}

function getreqbarcodes(pkg_list,tsk_list)
{
	var result = [];

	for(var i = 0; i < pkg_list.length; i++)
	{
		var barcode = pkg_list[i];

		if(!istaskcode(barcode,tsk_list))
		{
			result.push(barcode);
		}

	}

	return result.join(","); 

}

function istaskcode(barcode,tsk_list)
{
	for(var i = 0; i < tsk_list.length; i++)
	{
		if (barcode == tsk_list[i])
		{
			return true;
		}
	
	}

	return false;
}


function tasksubmitweb()
{

	var barcodes = getreqbarcodes(_pkg_list,_tsk_list) ;
	var mobile = _mobile ;
	var uid = _uid ;


	//alert(barcodes );

	if ($.trim(barcodes) == "")
	{
		$("#errmsg").html("<span style='color:#ff0000'>没有待取件！</span>");

		return;
		
	}

		var postData = "nodeid=" + $.cookie("ckstation") +  "&barcodes=" + barcodes +"&mobile=" + mobile +"&uid=" + uid;
             	var ajax = new AjaxHelper();
             	
                 ajax.AsyncPost("/services/manage/createwebdeliverytask/" + "?id=" + Math.random(),postData,function (args) 
                 {
			$('#comfirmDetails').window('close');
			var result = eval('(' + args + ')');

			if (result.result.code == 200) {
			
			$("#errmsg").html("<span style='color:#10A317'>创建取件任务成功</span>");
			
			Search_click(0);
			return;
			}
			else
			{  
			$("#errmsg").html("<span style='color:#4C6ACD'>" + result.result.message + "</span>");
			return;

			}		
                    	$("#billdis_barcode").focus();
                 });

		$("#billdis_barcode").focus();

}

function tasksubmit()
{


	var barcode = $.trim($("#billdis_barcode").val());
	var operator = $.cookie("userid");
	var expid = $("#sel_express").val();
	var   type = "checkcode";

	$("#errmsg").html("");

	if(barcode.length == 11)
	{
		type  = "mobile";
		$("#suffix_mobile_pan").hide();	
	}
	else if ( barcode.length == 4 && $("#suffix_mobile_pan").is(":hidden"))
	{		

		$("#suffix_mobile_pan").show();	
		$("#suffix_mobile").focus();
		return

	}
	else
	{

		var msg ="";

		if("" == barcode)
		{ 
		   msg = "请输入手机或取件密码！";
		}
		else if ( barcode.length  != 4 && barcode.length  != 11) 
		{
		    msg = "请输入手机11位号码或取件密码4位数字！";
		}
		else if ( $("#suffix_mobile").val().length  != 4 || $("#suffix_mobile").val() == "") 
		{
		    msg = "请输入手机后四位！";
		}

		if ( $("#suffix_mobile").val().length  != 4 || barcode.length  != 4) 
		{
		   	$("#errmsg").html("<span style='color:#ff0000'>" + msg + "</span>");
			return;
		}

	}



	var ajax = new AjaxHelper();	

			ajax.AsyncGet("/services/manage/createpasswddeliverytask/" + $.cookie("ckstation")+ "/" + type + "/" + barcode + "?id=" + Math.random(), function(args) {		
	
			var result = eval('(' + args + ')');

			if (result.result.code == 200) {
			
			$("#errmsg").html("<span style='color:#10A317'>创建取件任务成功</span>");
			Search_click(0);
			return;
			}
			else
			{  
			$("#errmsg").html("<span style='color:#4C6ACD'>" + result.result.message + "</span>");
			return;

			}		
			})

	$('#comfirmDetails').window('close');


}

function billapplysubmit()
{
 	var expid = $("#billapply_expid").val();
	var unitprice = $("#billapply_unitprice").val();
	var operator = $("#billapply_operator").val();
	var num = $.trim($("#billnum").val());
	var remark = $.trim($("#billremark").val());
	if(isNaN(num)) 
	{
		var msg = "请输入整数！";
		dialog("text", "提示", msg );
		return;
	};
	if (parseInt(num) == 0) 
	{
		var msg = "面单申请数不能为0！";
		dialog("text", "提示", msg );
		return;
	}

	if (parseInt(num) > 10000) 
	{
		var msg = "面单一次申请数量不能超过1万！";
		dialog("text", "提示", msg );
		return;
	}

	 $.messager.confirm('面单申请确认!', '面单申请数量【<b>' + num + "</b>】<br />请确认申请数量是否正确?",function(r){   

      	 if (r){   


	var postData = "nodeid=" + $.cookie("ckstation") + "&expid=" + expid
				+ "&unitprice=" + unitprice + "&operator=" + operator + "&num="
				+ num + "&remark="+ encodeURI(remark);

		var ajax = new AjaxHelper();		

		ajax.AsyncPost("/services/manage/expbillbatchapplyp", postData, function(args) {
			var result = eval('(' + args + ')');

			if (result.result && result.result.code == 200) {
				var msg = "申请已经提交等待审核！";
				dialog("text", "提示", msg );
				Search_click(0);
			}
			else
			{
				var msg = "提交失败！";
				dialog("text", "提示", msg );
			}

		})

		$('#billapply').window('close');
	}
	})
}

function billapplycancel()
{
	$('#billapply').window('close');
}

 function onLoadSuccess(data){
         /*   for(var i=0; i<merges.length; i++){
                $(this).datagrid('mergeCells',{
                    index: merges[i].index,
                    field: 'taskid',
                    rowspan: merges[i].rowspan
                });
            }
	 */
        }


var merges = [];
function getdata(pageindex, pagesize, flag) {
	var pagenumber = pageindex;
	var pagerows = pagesize;
	var ajax = new AjaxHelper();
	
	if(pagerows == 10 && pagesize == 5)
	{pagerows = 5;}

	if(typeof(pagenumber) == "undefined")
	{pagenumber = 1;}

	

	ajax.AsyncGet("/services/manage/querydeliverytasks/" + $.cookie("ckstation") + "/" + pagerows + "/" + pagenumber + "?id=" + Math.random(), function(args) {
		
		var result = eval('(' + args + ')');
		if (result.result.code == 200) {

			
			var resultdata = {};
			var rowindex = 0;
			var packages = result.result.packages;
			var taskrows = [];
	

				for(var j = 0; j < packages.length; j++)
				{
					var item = {};
					
					item.taskid =  packages[j].taskid;
					item.taskcreatetime =  packages[j].taskcreatetime;
					item.ptaskid = packages[j].taskid;
item.seqno= packages[j].seqno;

item.scannergettime= packages[j].scannergettime;

item.barcode= packages[j].barcode;

item.nodeid= packages[j].nodeid;


item.lockercategory= packages[j].lockercategory;


item.freight= packages[j].freight;


item.lockeraddress= packages[j].lockeraddress;


item.event= packages[j].event;


item.expressname= packages[j].expressname;

item.boxid= packages[j].boxid;

item.checkcode= packages[j].checkcode;

item.mobile= packages[j].mobile;

item.subevent= packages[j].subevent;

item.lockerid= packages[j].lockerid;

item.staffid = packages[j].scannerstaffid;

item.cod= packages[j].cod;

item.dpsttime= packages[j].dpsttime;

item.outsend= packages[j].outsend;
item.expressid= packages[j].expressid;

				
taskrows.push(item);

				  
				}

				

			resultdata.rows = taskrows;
			resultdata.total = taskrows.length;
		

			$('#dg').datagrid('loadData', resultdata);
		}

		$('#dg').datagrid("loaded");

	});
}

function expbilldiscard() {
	
	var pagenumber = pageindex;
	var pagerows = pagesize;
	var ajax = new AjaxHelper();
	

	ajax.AsyncGet("/services/manage/expbilldiscard/"  + $.cookie("ckstation")+ "/"+ $.trim($("#dbarcode").val())+"?id="+
Math.random(), function(args) {
		
	
		var result = eval('(' + args + ')');
		if (result.result.code == 200) {
 			dialog("text", "系统提示!", "此单已经成功废弃！");
		}
		

	});
}

function gettpldata() {
	return;
	var status = $("#sel_status").val();
	var expid = $("#sel_express").val();
	var orderid = $("#orderid").val();
	var mobile = $("#mobile").val();
	var keyword = $("#keyword").val();
	var key_tplname_tpl = $.trim($("#key_tplname_tpl").val());

	var dayfrom = $("#date_from").val().replace(/\-/g, "");
	var dayto = $("#date_to").val().replace(/\-/g, "");

	if (status == "") {
		status = "-999";
	}

	if (expid == "") {
		expid = "-999";
	}

	if (orderid == "") {
		orderid = "-999";
	}

	if (mobile == "") {
		mobile = "-999";
	}

	if (keyword == "") {
		keyword = "-999";
	}

	if (key_tplname_tpl == "") {
		key_tplname_tpl = "-999";
	}

	var ajax = new AjaxHelper();

	// getnodepickups($nodeid,$status,$orderid,$expid,$mobile,$keyword,$dayfrom,$dayto,$pagerows,$pagenumber)
	ajax.AsyncGet("/services/manage/getshippingtpl/" + $.cookie("ckstation")
			+ "/" + key_tplname_tpl + "?id=" + Math.random(), function(args) {

		
		var result = eval('(' + args + ')');


	});
}

var barcoderepeat = "";
function submit_goods() {

	if (!isEditMode) {

		if (isrepeatbarcode(barcode)) {
			barcoderepeat = barcode;

			$.messager.alert("操作提示", '包裹条码【' + barcoderepeat
					+ '】已经使用，不能重复使用该条码录寄件单!', "warning", function() {
				$("#barcode").val('');
				$("#barcode").focus();

			});
			$("#barcode").focus();
			return;
		}
	}

	if ($("#quick_ck").attr("checked")) {

		if ($.trim($("#aname").val()) == "") {
			$("#aname").val("--");
		}

		if ($.trim($("#saddr").val()) == "") {
			$("#saddr").val("--");
		}
		if ($.trim($("#amobile").val()) == "") {
			$("#amobile").val("00000000000");
		}
	}

	if ($("#form1").form('validate')) {
		$('#bt_submit').linkbutton('disable');

		if ($.trim($("#aaddr").val()) == "") {
			$("#aaddr").val("--");
		}

		if ($.trim($("#sname").val()) == "") {
			$("#sname").val("--");
		}

		var nodeid = $.trim($("#nodeid").val());
		var orderid = $.trim($("#order_id").val());
		var expressid = $.trim($("#expressid").val());
		var barcode = $.trim($("#barcode").val());

		var smobile = $.trim($("#smobile").val());
		var sname = $.trim($("#sname").val());
		var scity = $.trim($("#cityId_input").val().replace(/\d{3}$/, ""));
		var sdistrict = $.trim($("#cityId_input").val().replace(/^\d{3}/, ""));
		var saddr = $.trim($("#saddr").val());

		var aname = $.trim($("#aname").val());
		var amobile = $.trim($("#amobile").val());
		var acity = $.trim($("#cityId_input_2").val().replace(/\d{3}$/, ""));
		var adistrict = $
				.trim($("#cityId_input_2").val().replace(/^\d{3}/, ""));
		var aaddr = $.trim($("#aaddr").val());

		var weight = $.trim($("#weight").val());
		var isfad = "0";
		var freight = $.trim($("#freight").val());
		var cod = $.trim($("#cod").val());
		var premium = $.trim($("#premium").val());
		var remark = $.trim($("#remark").val());

		var ptype = $("input[name='ptype']:checked").val();

		smobile = smobile.replace("-", "", "g");
		amobile = amobile.replace("-", "", "g");

		/**
		 * 判断重量是否大于价格
		 */
		// 重量
		var weight_num = parseFloat(weight);
		// 价格
		var freight_num = parseFloat(freight);
		if(weight_num > freight_num)
			{
			    dialog("text", "系统提示!", "重量大于寄件费用，请检查！");
			    return;
			}
		weight = Math.round((parseFloat(weight) * 1000)).toString();
		freight = Math.round((parseFloat(freight) * 100)).toString();
		cod = Math.round((parseFloat(cod) * 100)).toString();
		premium = Math.round((parseFloat(premium) * 100)).toString();

		sname = stringFilter(sname);
		saddr = stringFilter(saddr);
		aname = stringFilter(aname);
		aaddr = stringFilter(aaddr);
		remark = stringFilter(remark);

		var postData = "nodeid=" + nodeid + "&expressid=" + expressid
				+ "&barcode=" + barcode + "&smobile=" + smobile + "&sname="
				+ sname + "&scity=" + scity + "&sdistrict=" + sdistrict
				+ "&saddr=" + saddr + "&aname=" + aname + "&amobile=" + amobile
				+ "&acity=" + acity + "&adistrict=" + adistrict + "&aaddr="
				+ aaddr + "&weight=" + weight + "&isfad=" + isfad + "&freight="
				+ freight + "&cod=" + cod + "&premium=" + premium + "&remark="
				+ remark + "&operator=" + $.cookie("userid") + "&paytype="
				+ ptype;

		var ajax = new AjaxHelper();
		var mode = "updateorder";

		if (isEditMode) {
			mode = "updateorder";
			postData += "&orderid=" + orderid;
		}

		ajax.AsyncPost("/services/manage/" + mode, postData, function(args) {
			var result = eval('(' + args + ')');

			if (result.result && result.result.code == 200) {
				var msg = "创建新寄件单成功！";

				if (isEditMode) {
					msg = "更新寄件单成功";
				} else {
					msg += "编号为：" + result.result.orderid;

					var orderid = $.trim(result.result.orderid);
					// openProcessWin(orderid, nodeid, orderid, '', 'create',
					// 'accept', barcode);
					resetareabox();
					clearData();

				}

				dialog("text", "系统提示!", msg);
				getdata($("#dg").datagrid("options").pageIndex, $("#dg")
						.datagrid("options").pageSize, false);
			} else if (result.result && result.result.code != 200) {
				var msg = "错误码:[" + result.result.code + "]"
						+ result.result.message + "!";

				dialog("text", "系统提示!", msg);
			} else if (result.error && result.error.code) {
				var msg = "错误码:[" + result.error.code + "]"
						+ result.error.message + "!";

				dialog("text", "系统提示!", msg);
			} else {
				var msg = "错误码:[" + result.result.code + "]"
						+ result.result.message + "!";

				dialog("text", "系统提示!", msg);
			}

			$('#bt_submit').linkbutton('enable');

		});
	} else {

		if ($('#smobile').hasClass("validatebox-invalid")
				|| $('#amobile').hasClass("validatebox-invalid")) {
			dialog("text", "系统提示!", "请填写正确的信息！");
		} else {
			dialog("text", "系统提示!", "请填写所有必须的信息！");
		}
	}
}

/**
 * 寄件单补录的提交寄件单
 */
function submit_goods_Makeup() {
	var makeup_barcode = $("#barcode_create").val();
	if (isrepeatbarcode(makeup_barcode)) {
		$.messager.alert("操作提示", '包裹条码【' + makeup_barcode
				+ '】已经使用，不能重复使用该条码录寄件单!', "warning", function() {
			$("#barcode_create").val('');
			$("#barcode_create").focus();

		});
		$("#barcode_create").focus();
		return;
	}
	if ($("#form2").form('validate')) {
		var nodeid = $.cookie("ckstation");
		var expressid = $.trim($("#expressid_create").val());
		var barcode = $.trim($("#barcode_create").val());

		var smobile = $.trim($("#smobile_create").val());
		var amobile = $.trim($("#amobile_create").val());

		var weight = $.trim($("#weight_create").val());
		var freight = $.trim($("#freight_create").val());

		var sender = $.trim($("#sender_create").val());
		var remark = $.trim($("#remark_create").val());
		var ptype = $("input[name='ptype_create']:checked").val();

		smobile = smobile.replace("-", "", "g");
		amobile = amobile.replace("-", "", "g");

		weight = Math.round((parseFloat(weight) * 1000)).toString();
		freight = Math.round((parseFloat(freight) * 100)).toString();
		var postData = "nodeid=" + nodeid + "&expressid=" + expressid
				+ "&barcode=" + barcode + "&smobile=" + smobile + "&amobile="
				+ amobile + "&weight=" + weight + "&freight=" + freight
				+ "&operator=" + $.cookie("userid") + "&paytype=" + ptype + "&sname=" + sender + "&remark=" + remark;
		var ajax = new AjaxHelper();
		ajax
				.AsyncPost("/services/manage/acceptOrder_create", postData,
						function(args) {
							var result = eval('(' + args + ')');
							if (result.result && result.result.code == 200) {
								var msg = "创建新寄件单成功！";
								$("#message_text").html(
										'<span style="color: green;">' + msg
												+ '</span>');
								getdata($("#dg").datagrid("options").pageIndex,
										$("#dg").datagrid("options").pageSize,
										false);
								$("#barcode_create").val("");
								$("#smobile_create").val("");
								$("#smobile_create").val("");
								$("#weight_create").val("");
								$("#freight_create").val("");
							} else if (result.result
									&& result.result.code != 200) {
								var msg = "错误码:[" + result.code + "]"
										+ result.message + "!";
								$("#message_text").html(
										'<span style="color: red;">' + msg
												+ '</span>');
							} else if (result.error && result.error.code) {
								var msg = "错误码:[" + result.error.code + "]"
										+ result.error.message + "!";
								$("#message_text").html(
										'<span style="color: red;">' + msg
												+ '</span>');
							} else {
								var msg = "错误码:[" + result.code + "]"
										+ result.message + "!";
								$("#message_text").html(
										'<span style="color: red;">' + msg
												+ '</span>');
							}
							setTimeout(message_textNone, 5000);
							$('#bt_submit').linkbutton('enable');
						});
	} else {
		if ($('#smobile_create').hasClass("validatebox-invalid")
				|| $('#amobile_create').hasClass("validatebox-invalid")) {
			$("#message_text").html(
					'<span style="color: red;">请填写正确的信息！</span>');
		} else {
			$("#message_text").html(
					'<span style="color: red;">请填写所有必须的信息！</span>');
		}
		setTimeout(message_textNone, 5000);
	}
}

function message_textNone() {
	$("#message_text").html('');
}

$(document).ready(function() {

	// 获取N个相同的字符串
	String.prototype.repeat = function(num) {
		var tmpArr = [];
		for (var i = 0; i < num; i++)
			tmpArr.push(this);
		return tmpArr.join("");
	}

	init();
	
});

function Search_click(flag_index) {
	var begindate = $("#date_from").val();
	var enddate = $("#date_to").val();
	if (flag_index == 0) {
		if (DateDiff(begindate, enddate) == 1) {
			dialog("text", "系统提示!", "起始时间必须小于结束日期");
			return;
		}
		getdata($("#dg").datagrid("options").pageIndex, $("#dg").datagrid(
		"options").pageSize, true);
	} else {
		getdata($("#dg").datagrid("options").pageIndex, $("#dg").datagrid(
				"options").pageSize, false);
	}
	// 保存用户查询时间关闭浏览器失效
		$.cookie("mgrUserSearchStartDate", begindate);
		$.cookie("mgrUserSearchEndDate", enddate);
}

function getDate(day) {
	var zdate = new Date();
	var sdate = zdate.getTime() - (1 * 24 * 60 * 60 * 1000);
	var edate = new Date(sdate - (day * 24 * 60 * 60 * 1000));
	return edate;
}

function initTime() {
	// 默认查询时间向前推两天
	var lastweek = getMyDate(1);
	var today = getMyDate(-1);

        	//如果用户用查询过使用用户默认查询时间
        	var startDateHis = $.cookie("mgrUserSearchStartDate");
        	var endDateHis = $.cookie("mgrUserSearchEndDate");

        	if ((startDateHis && endDateHis)
        		&& (startDateHis != "" && endDateHis != ""))
        	{
        		lastweek = startDateHis;
        		today = endDateHis;
        	}

	$('#date_from').val(lastweek);
	$('#date_to').val(today);
}

function sendBatchPackage() {
	var rows = [];

	copyObject(rows, getCheckRows());

	if (rows.length == 0) {
		dialog("text", "系统提示!", "请勾选需要打印的寄件单谢谢！");
		return;
	}
	var length = rows.length;
	for (var i = 0; i < rows.length; i++) {
		// alert(rows[i].expid.toString());
		// alert(expresseSet[rows[i].expid.toString()].parentName);

		rows[i].expid = expresseSet[rows[i].expid.toString()].parentName;

		var weightVal = parseFloat(parseInt(rows[i].weight) / 1000).toFixed(2);
		var freightVal = parseFloat(parseInt(rows[i].freight) / 100).toFixed(2);

		if (parseInt(rows[i].weight) == 0) {
			weightVal = "";
		}

		if (parseInt(rows[i].freight) == 0) {
			freightVal = "";
		}

		rows[i].weight = weightVal;
		rows[i].freight = freightVal;

		setareaname(rows[i]);

	}

	var postData = JSON.stringify(rows);

	var title = '确实要批量打印选中的<b>' + rows.length + '</b>个寄件单吗?';
	autoSentData = rows;
	$.messager.confirm('批量打印寄件单', title, function(r) {
		if (r) {

			var expName = expresseSet[rows[0].expid]

			if (typeof (expresseSet[rows[0].expid]) == "undefined") {
				expName = "-1";
			} else {
				expName = expresseSet[rows[0].expid].parentName;
			}
			printBatchSender(postData, expName, length);
		}
	});
}

function getCheckRows() {
	var barcodeList = [];
	var rows = [];

	$(".datagrid-btable input[id^='ck']:checked").each(function() {
		barcodeList.push($(this).attr("id"));
	})

	var raws = $('#dg').datagrid('getData').rows;

	for (var i = 0; i < raws.length; i++) {

		var item = raws[i];
		var barcode = "ck" + item.id;

		for (var j = 0; j < barcodeList.length; j++) {
			if (barcode == barcodeList[j]) {
				rows.push(item);
				break;
			}
		}

	}

	return rows;
}

var has_init_tpl = false;
var autoupdatenum = 0;
var withdraw_deay = top.withdraw_deay;
var withdraw_auto = top.withdraw_auto;


function updatelist()
{

	if(withdraw_auto == "1")
{ 

	$("#autoupdatebtn").next().css("color","#202020");
	
	$("#autoupdatebtn").attr("checked","checked");
	
	if(withdraw_auto_local)
	{
		
		Search_click(0);

	}
	else
	{
		$("#autoupdatebtn").removeAttr("checked","checked");


	}

	$("#autoupdatebtn").removeAttr("disabled");
	

}
else
{
	$("#autoupdatebtn").next().css("color","#a0a0a0");
	$("#autoupdatebtn").removeAttr("checked");
	$("#autoupdatebtn").attr("disabled","disabled");

}
}


function startInterval()
{	

	

	setInterval(function(){

	updatelist();
			
			
		},withdraw_deay*1000);

}
var withdraw_auto_local = false; 
function init() {

$(document).keydown(function(e){
    if(!e){
         e=window.event;
        }
    
    if((e.keyCode||e.which)===13){
       
	if (!$(".window-mask").is(":visible"))

        billbatchdiscard();
    }
});

	$("#autoupdatebtn").click(function(){

		if ($(this).attr("checked") == "checked")
{
		withdraw_auto_local = true;
}
else
{
		withdraw_auto_local = false;
}

	});

	if($("#date_from_d").size()&&$("#date_to_d").size())
	{
		 addquickfilterd();
	}
	
	$('#maintabs').tabs('close',1);
	
	initExpressescs()
	$('#dg')
			.datagrid(
					{



  onLoadSuccess: onLoadSuccess,
						pageSize : 5,

						columns : [ [
								
								{
									field : 'barcode',
									title : '条码',
									sortable : true,
									width:100,
									formatter : function(value, rec, index) {										
										return value;
									}
								},


{
									field : 'expressname',
									title : '快递公司',
									sortable : true,width:100,
									formatter : function(value, rec, index) {
										
										return value;


									}},


								{
									field : 'mobile',
									title : '手机',
									sortable : true,width:120,
									formatter : function(value, rec, index) {

													
										return value;
									}
								},
								{
									field : 'boxid',
									title : '柜号',width:80,
									sortable : true,
									formatter : function(value, rec, index) {
										
										
									return value;


									}
								},
{
									field : 'seqno',
									title : '序号',width:80,
									sortable : true,
									formatter : function(value, rec, index) {
										return value;

;

									}
								},
{
									field : 'staffid',
									title : '取件员工',width:80,
									sortable : true,
									formatter : function(value, rec, index) {
										
										if (value == "") return value;

										if(staffset[value+""] && typeof(staffset[value+""] )!="undefined")
										{return staffset[value+""]
										}
										else
										{ return "" }

;

									}
								},

{
									field : 'event',
									title : '任务状态',
									sortable : true,
									formatter : function(value, rec, index) {

									var result = "已通知";
									if(rec.scannergettime && rec.scannergettime !="" && rec.scannergettime !="2013-01-01 00:00:00")

											{result = "取件中";}

										return result ;
;
									}
								},


{
									field : 'taskcreatetime',
									title : '任务创建时间',
									sortable : true,width:150,
									formatter : function(value, rec, index) {
									
										return value;
									}
								},




{
									field : 'scannergettime',
									title : '任务获取时间',
									sortable : true,width:150,
									formatter : function(value, rec, index) {
									if(rec.scannergettime !="2013-01-01 00:00:00")		

									{
										return value;

									}

									}
								}

] ]
					});

	var p = $('#dg').datagrid('getPager');

	$(p).pagination({

		pageList : [5,10, 20, 50, 100, 300 ],// 可以设置每页记录条数的列表
		beforePageText : '第',// 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示 {from} - {to} 条记录   共 {total} 条记录',
		onSelectPage : function(pPageIndex, pPageSize) {

			$("#dg").datagrid("options").pageSize = pPageSize;
			$("#dg").datagrid("options").pageIndex = pPageIndex;

			getdata(pPageIndex, pPageSize, false);
		}
	});
	initTime();

	$("#dg").datagrid("options").pageIndex = 1;


$('#userpkgs')
			.datagrid(
					{

						columns : [ [
								
								{
									field : 'barcode',
									title : '条码',
									sortable : true,
									width:100,
									formatter : function(value, rec, index) {										
										return value;
									}
								},


{
									field : 'express',
									title : '快递公司',
									sortable : true,width:100,
									formatter : function(value, rec, index) {
										
										return value.name;


									}},


								{
									field : 'mobile',
									title : '手机',
									sortable : true,width:120,
									formatter : function(value, rec, index) {

													
										return value;
									}
								},


								{
									field : 'checkcode',
									title : '取件密码',
									sortable : true,width:120,
									formatter : function(value, rec, index) {

													
										return value;
									}
								},

								{
									field : 'boxid',
									title : '柜号',width:80,
									sortable : true,
									formatter : function(value, rec, index) {
										
										
									return value;


									}
								},
{
									field : 'seqno',
									title : '序号',width:80,
									sortable : true,
									formatter : function(value, rec, index) {
										return value;

;

									}
								},
{
									field : 'event',
									title : '状态',
									sortable : true,
									formatter : function(value, rec, index) {
										return getPackageStatusEventDesc(rec);

;

									}
								}


] ]
					});

	

$('#usertasks')
			.datagrid(
					{

						columns : [ [
								
								{
									field : 'barcode',
									title : '条码',
									sortable : true,
									width:150,
									formatter : function(value, rec, index) {										
										return value;
									}
								},


{
									field : 'taskcreatetime',
									title : '任务创建时间',
									sortable : true,width:200,
									formatter : function(value, rec, index) {
										
										return value;


									}},


								{
									field : 'scannergettime',
									title : '任务获取时间',
									sortable : true,width:200,
									formatter : function(value, rec, index) {

													
										return value;
									}
								}


] ]
					});

	

	
	$("#date_from,#date_to").focus(function(){
		 clearInterval(findintervalid ); 
		findintervalid  = setInterval(function(){
			var count = 0;
			$(".date-picker-wp").each(function(){
				if ($(this).css("display") == "none") { count++};

			});
			if(count == $(".date-picker-wp").size())			
			{ clearInterval(findintervalid ); Search_click();  }
		},1500)
	});


	new DatePicker('d1', {
		inputId : 'date_from',
		className : 'date-picker-wp',		
		seprator : '-'
	});
	new DatePicker('d2', {
		inputId : 'date_to',
		className : 'date-picker-wp',		
		seprator : '-'
	});

	

	getdata($("#dg").datagrid("options").pageIndex, $("#dg")
			.datagrid("options").pageSize, false);

	$("#billdis_barcode").focus();



isopenscan();
			
if(isopenscanflag){ 

initgetnewsendnode();

if (withdraw_auto == "1")
{
	withdraw_auto_local = true;
}
else
{
	withdraw_auto_local = false;
}


updatelist();
initstaffnameset();
startInterval();

}
else
{
$("#errmsg").html("<span style='color:#ff0000;'>站点没有开通扫码取件服务！请开通后再使用此功能！</span>");


}



}

var findintervalid = 0;

function checkedStatusChange() {
	var raws = $('#dg').datagrid('getData').rows;
	var rows = getCheckRows();
	var img = $("img[id='allcheck']");
	var name = img.attr("name");

	if (rows.length < raws.length) {
		var curSrc = img.attr("src").replace("allcheck", "allcheckun");

		if (name != "allcheck0") {
			img.attr("name", "allcheck0");
			img.attr("src", curSrc);
		}
	} else {
		var curSrc = img.attr("src").replace("allcheckun", "allcheck");

		if (name != "allcheck1") {
			img.attr("name", "allcheck1");
			img.attr("src", curSrc);
		}

	}
}

var expresseSet = {};

function initExpressesDept() {

	var reqUrl = "/services/manage/getnodeexpress/" + $.cookie("ckstation")
			+ "?id=" + Math.random();
	var args = $.ajax({
		url : reqUrl,
		async : false
	});
	var rs = eval('(' + args.responseText + ')');

	var expressSet = rs.result.expresses;
	if (expressSet && typeof (expressSet) != "undefined") {
		for (var i = 0; i < rs.result.expresses.length; i++) {
			var expid = rs.result.expresses[i].id.toString();

			var item = {};

			item.name = rs.result.expresses[i].name;
			item.parentName = rs.result.expresses[i].expressid;
			item.id = rs.result.expresses[i].id;

			expresseSet[expid] = item;
		}
	}
}

var currentRow;

function clearDetails() {
	var resetSign = "--";

	$('#orderid_d').html(resetSign);
	$('#nodeid_d').html(resetSign);
	$('#barcode_d').html(resetSign);
	$('#sname_d').html(resetSign);
	$('#smobile_d').html(resetSign);
	$('#saddr_d').val(resetSign);
	$('#aname_d').html(resetSign);
	$('#amobile_d').html(resetSign);
	$('#aaddr_d').val(resetSign);
	$('#weight_d').html(resetSign);
	$('#premium_d').html(resetSign);
	$('#cod_d').html(resetSign);
	$('#freight_d').html(resetSign);
	$('#isfad_d').html(resetSign);
	$('#operator_d').html(resetSign);
	$('#remark_d').val(resetSign);
	$('#expressid_d').html(resetSign);

	$('#sarea_d').html("　　");
	$('#aarea_d').html("　　");
}

function showDetails(index,data_type) {
	if(data_type == 1)
		{
		    var rows = $('#dg').datagrid("getRows");
		}else{
			var rows = $('#dg_cancel').datagrid("getRows");
		}

	var selectedRow = rows[index];

	currentRow = selectedRow;

	clearDetails();

	$('#orderDetails').window('open');

	$('#aarea_d').addClass("label-loading");
	$('#sarea_d').addClass("label-loading");

	$('#orderid_d').html(selectedRow.orderid);
	$('#nodeid_d').html($.cookie("ckschoolname"));

	$('#barcode_d').html("--");

	if (selectedRow.barcode != "") {
		$('#barcode_d').html(selectedRow.barcode);
	}

	if (selectedRow.barcode == "") {
		$('#showmaildetail').linkbutton('disable');
	} else {
		$('#showmaildetail').linkbutton('enable');
	}

	$('#sname_d').html(selectedRow.sender);
	$('#smobile_d').html(selectedRow.smobile);

	$('#saddr_d').val(selectedRow.saddress);

	$('#aname_d').html(selectedRow.addressee);
	$('#amobile_d').html(selectedRow.amobile);

	$('#aaddr_d').val(selectedRow.aaddress);

	var weightVal = parseFloat(parseInt(selectedRow.weight) / 1000).toFixed(2)
			.toString();

	var premiumVal = parseFloat(parseInt(selectedRow.premium) / 100).toFixed(2)
			.toString();
	var codVal = parseFloat(parseInt(selectedRow.cod) / 100).toFixed(2)
			.toString();
	var freightVal = parseFloat(parseInt(selectedRow.freight) / 100).toFixed(2)
			.toString();

	$('#weight_d').html(weightVal + " 公斤");
	$('#premium_d').html(premiumVal + " 元");
	$('#cod_d').html(codVal + " 元");
	$('#freight_d').html(freightVal + " 元");

	(selectedRow.isfad == "0") ? $('#isfad_d').html("寄方付") : $('#isfad_d')
			.html("收方付");

	$('#operator_d').html(selectedRow.operator);
	$('#remark_d').val(selectedRow.remark);

	var expItem = expresseSet[selectedRow.express.id];

	if (typeof (expItem) == 'undefined') {
		$('#expressid_d').html('--');
	} else {
		$('#expressid_d').html(expresseSet[selectedRow.express.id].name);
	}

	var acode = selectedRow.aprovince.name + selectedRow.acity.name
			+ selectedRow.adistrict.name;
	var scode = selectedRow.sprovince.name + selectedRow.scity.name
			+ selectedRow.sdistrict.name;

	$('#aarea_d').html(acode.replace("", "--"));
	$('#sarea_d').html(scode.replace("", "--"));

	$('#sarea_d').removeClass("label-loading");
	$('#aarea_d').removeClass("label-loading");
}

function alertmaildetailfororder(num, expname, orderid) {
	var expname;

	if (typeof (expresseSet[expname]) == "undefined") {
		expname = "";
	} else {
		expname = expresseSet[expname].name;
	}

	if (expname == "") {
		expname = "--";
	}

	$("#detailsframe").attr(
			"src",
			"/manage/admin/maildetailssend/" + num + "/"
					+ $.cookie("ckstation") + "/" + orderid + "/" + expname);
	$(window.frames["detailsframe"].document).find("#mailnum").html();
	$(window.frames["detailsframe"].document).find("#freightfwd").html("");
	$(window.frames["detailsframe"].document).find("#express").html("");
	$(window.frames["detailsframe"].document).find("#torder").html("");
	$(window.frames["detailsframe"].document).find("#mobile").html("");
	$(window.frames["detailsframe"].document).find("#event").html("");
	$(window.frames["detailsframe"].document).find("#maillogs").html("");

	$(window.frames["detailsframe"].document).find("#loadimg").hide();
	$('#popupDetails').window('open');

	// setTimeout(function(){
	// $(window.frames["detailsframe"].contentWindow.document).find("#expnamejs").val(curexpname);
	// alert('jsid: ' +
	// $(window.frames["detailsframe"].contentWindow.document).find("#expnamejs").val());
	// $(window.frames["detailsframe"].contentWindow.document).find("#expnamejs").get(0).searchpostonly();
	// },800)

}

function export_click() {
	var status = $("#sel_status").val();
	var expid = $("#sel_express").val();
	var orderid = $("#orderid").val();
	var mobile = $("#mobile").val();
	var keyword = $("#sel_keyword").val();
	var isfad = $("#sel_isfad").val();
	var barcode = $.trim($("#sel_barcode").val());

	var dayfrom = $("#date_from").val().replace(/\-/g, "");
		dayto = $("#date_to").val().replace(/\-/g, "");
	var operator = $.trim($("#soperator").val());
	if (operator == "") {
		operator = "-999";
	}

	if (status == "") {
		status = "-999";
	}

	if (expid == "") {
		expid = "-999";
	}

	if (orderid == "") {
		orderid = "-999";
	}

	if (mobile == "") {
		mobile = "-999";
	}

	if (keyword == "") {
		keyword = "-999";
	}

	if (isfad == "") {
		isfad = "-999";
	}
	if (barcode == "") {
		barcode = "-999";
	}
	var url = "/services/manage/getcatchgoodsEPT/" + $.cookie("ckstation")
			+ "/" + status + "/" + orderid + "/" + expid + "/" + mobile + "/"
			+ keyword + "/" + dayfrom + "/" + dayto + "/5000/1" + "/" + isfad + "/" + barcode + "/" + operator;
	window.open(url, '_blank', '');
}

// \''+row.id+'\',\''+row.nodeid+'\',\''+row.orderid+'\',\''+row.operator+'\',\''+row.status+'\'
function printsender(id, nodeid, orderid, operator, status, event, barcode,
		selectedIndex) {
	// if (!(selectedRow.expid == '25' || selectedRow.expid == '26'))
	// {
	// dialog("text","系统提示!",'该快递公司单还不支持打印，谢谢！');
	//
	// // return;
	// }

	// if (selectedRow)
	// {
	// $('#printform input[name="print_expid"]').val(selectedRow.expid);
	// $('#printform input[name="print_sender"]').val(selectedRow.sender);
	// $('#printform input[name="print_smobile"]').val(selectedRow.smobile);
	// $('#printform input[name="print_saddress"]').val(selectedRow.saddress);
	//
	// $('#printform input[name="print_receiver"]').val(selectedRow.receiver);
	// $('#printform input[name="print_amobile"]').val(selectedRow.amobile);
	// $('#printform input[name="print_aaddress"]').val(selectedRow.aaddress);
	//
	// var weightVal = parseFloat(parseInt(selectedRow.weight) /
	// 1000).toFixed(2);
	// var premiumVal = parseFloat(parseInt(selectedRow.premium) /
	// 100).toFixed(2);
	// var codVal = parseFloat(parseInt(selectedRow.cod) / 100).toFixed(2);
	// var freightVal = parseFloat(parseInt(selectedRow.freight) /
	// 100).toFixed(2);
	//
	// $('#printform input[name="print_weight"]').val(weightVal);
	// $('#printform input[name="print_freight"]').val(freightVal);
	//
	// $('#printform').get(0).submit();
	//
	// }

	var pagerows = $('#dg').datagrid("getRows");

	var data = [];

	copyObject(data, pagerows);

	var rows = data[selectedIndex];

	if (rows.length == 0) {
		dialog("text", "系统提示!", "请点需要打印的寄件单谢谢！");
		return;
	}

	try {
		rows.expid = expresseSet[rows.expid.toString()].parentName;

		var weightVal = parseFloat(parseInt(rows.weight) / 1000).toFixed(2);
		var freightVal = parseFloat(parseInt(rows.freight) / 100).toFixed(2);

		if (parseInt(rows.weight) == 0) {
			weightVal = "";
		}

		if (parseInt(rows.freight) == 0) {
			freightVal = "";
		}

		rows.weight = weightVal;
		rows.freight = freightVal;

		setareaname(rows);

	} catch (e) {
		// 没有这个快递公司;
	}

	var postData = JSON.stringify(rows);

	postData = "[" + postData + "]";

	// alert(postData);

	var expName = rows.expid;

	printBatchSender(postData, expName, 1);

}

function printBatchSender(data, type, length) {
	
}

function unselectedAll() {
	var img = $("img[id='allcheck']");
	img.attr("src").replace("allcheck", "allcheckun");
}

function selectedAll() {

}
function openProcessWin(id, nodeid, orderid, operator, status, event, barcode,
		selectedIndex) {
	$('#orderid_p').val(orderid);
	$('#nodeid_p').val(nodeid);
	$('#event_p').val(status);
	$('#operator_p').val($.cookie("thisname"));

	var raws = $('#dg').datagrid('getData').rows;

	var selectrow = raws[selectedIndex];

	$('#paytype_p').val(selectrow.paytype);

	if (event == "accept") {
		submitHandleByType(event);
		return;
	}

	if (event == "cancel") {
		var title = '您确认取消吗？';
		top.$.messager.confirm('确认是否取消', title, function(r) {
			if (r) {
				submitHandleByType(event);
			}
			});
		return;
	}

	if (event == "reject") {
		$('#comment_p').val("");
		$('#popupWinProcess').window('open');
		return;
	}

	if (event == "done") {
		if ($.trim(barcode) == "") {
			dialog("text", "系统提示!", '寄出前您必须填写<b>[包裹条码]</b>！');

			showManageUserPanel('update', selectedIndex);

			$("#barcode").focus();

			return;
		}

		var title = "您确认该单状态可变为<b>[寄件交接（已寄出）]</b>状态？";
		$.messager.confirm('确认', title, function(r) {
			if (r) {
				submitHandleByType(event);
			}
		});
		return;
	}
}

var isEditMode = false;
function getFmtId(val) {
	var fmtVal;

	if (val.length < 7) {
		var perfix = "0";
		fmtVal = perfix.repeat(7 - val.length) + val;
	}

	return fmtVal
}
function showManageUserPanel(type, index) {
	// $('#catchgoodpanel').window('open');
	var panel = $('#catchgoodpanel');
	var winTitle = $('#catchgoodpanel').prev();


	$("#nodeidname").val($.cookie("ckschoolname"));
	resetareabox();

	if (type == "add") {
		$('.panel-title', winTitle).text("创建新寄件单");
		// $("#usertype").removeAttr("disabled");
		// $('#userjobnum').validatebox({required:true});
		// $("#userjobnum").removeAttr("disabled");
		isEditMode = false;

		clearData();

		if ($.trim($.cookie("ckstation")) == "N9D400002867") {
			$('#saddr').val("旺座国际")
		}
		if ($('#quick_ck').attr("checked") != "checked") {
			$("#quick_ck").click();
			$("#adv_1,#adv_2,#adv_3,#adv_4,#adv_5,#adv_6,#adv_7,#adv_8").hide();

			$("#saddr").val("--");
			$("#aname").val("--");

			$('#amobile').validatebox({
				required : false
			});

			$("#amobile").val("00000000000");

			$("#send_cb").attr("disabled", "disabled");
		}
		if ($('#enterp_cb').attr("checked") != "checked") {
			$("#enterp_cb").click();
			$('#add_user_btn').css('visibility', 'hidden');
		}

		$("#user_orderid").val("创建后自动生成");
		$('#catchgoodpanel').window('open');
		panel.show();
	} else if (type == "update") {
		Open_Dialog_sendManage();
		clearDataEdit();
		var rows = $('#dg').datagrid("getRows");
		var selectedRow = rows[index];

		isEditMode = true;
		$('.panel-title', winTitle).text("修改选中的寄件单");
		// 装填选中行数据到表单
		// $("#usertype").attr("disabled","disabled");
		if (selectedRow) {

			$("#user_orderid").val(selectedRow.orderid.toString());
			// {field:'id',title:'订单号',align:'center'},
			// {field:'nodeid',title:'站点ID'},
			// {field:'barcode',title:'条码',sortable:true},
			// {field:'expid',title:'物流公司',sortable:true},
			// {field:'status',title:'状态',sortable:true},
			// {field:'details',title:'详细说明',sortable:true},
			//
			// {field:'sender',title:'寄件人姓名',sortable:true},
			// {field:'smobile',title:'寄件人电话',sortable:true},
			// {field:'scity',title:'寄件人城市代码',sortable:true},
			// {field:'sdistrict',title:'寄件人区（县）代码',sortable:true},
			// {field:'saddress',title:'寄件人地址',sortable:true},
			// {field:'receiver',title:'收件人姓名',sortable:true},
			// {field:'amobile',title:'收件人联系电话',sortable:true},
			// {field:'acity',title:'收件人城市代码',sortable:true},
			// {field:'adistrict',title:'收件人区（县）代码',sortable:true},
			// {field:'aaddress',title:'收件人详细地址',sortable:true},
			// {field:'weight',title:'包裹重量',sortable:true},
			// {field:'premium',title:'包裹保价',sortable:true},
			// {field:'isfad',title:'是否是到付运费',sortable:true},
			// {field:'cod',title:'代收货款金额',sortable:true},
			// {field:'freight',title:'运费',sortable:true},
			// {field:'remark',title:'说明',sortable:true},
			// {field:'operator',title:'操作人员',sortable:true}
			//
			$('#order_id').val(selectedRow.orderid);
			$('#nodeid').val(selectedRow.nodeid);
			$('#sname').val(selectedRow.sender);
			$('#smobile').val(selectedRow.smobile);
			$('#saddr').val(selectedRow.saddress);

			$('#aname').val(selectedRow.addressee);
			$('#amobile').val(selectedRow.amobile);
			$('#aaddr').val(selectedRow.aaddress);

			$('#barcode').val(selectedRow.barcode);

			var weightVal = parseFloat(parseInt(selectedRow.weight) / 1000)
					.toFixed(2);

			var premiumVal = parseFloat(parseInt(selectedRow.premium) / 100)
					.toFixed(2);
			var codVal = parseFloat(parseInt(selectedRow.cod) / 100).toFixed(2);
			var freightVal = parseFloat(parseInt(selectedRow.freight) / 100)
					.toFixed(2);

			$('#weight').numberbox('setValue', weightVal);
			$('#premium').numberbox('setValue', premiumVal);
			$('#cod').numberbox('setValue', codVal);
			$('#freight').numberbox('setValue', freightVal);

			$('#isfad').val(selectedRow.isfad);
			$('#operator').val(selectedRow.operator);
			$('#remark').val(selectedRow.remark);
			$("input[name='ptype']:eq(" + selectedRow.paytype + ")").attr(
					"checked", "checked");
			$('#expressid').val(
					expresseSet[selectedRow.express.id.toString()].id);
		}
	}

}

function clearData() {
	$('#nodeid').val($.cookie("ckstation"));
	$('#barcode').val('');
	// $('#sname').val('');
	// $('#smobile').val('');
	// $('#saddr').val('');

	if ($.trim($("#sname").val()) == "--") {
		$("#sname").val("");
	}

	if ($.trim($("#aname").val()) == "--") {
		$("#aname").val("");
	}

	if ($.trim($("#aaddr").val()) == "--") {
		$("#aaddr").val("");
	}

	if (!$("#quick_ck").attr("checked")) {
		$('#aname').val('');
		$('#amobile').val('');
	}

	$('#aaddr').val('');

	$('#weight').numberbox('setValue', 1.00);
	$('#premium').numberbox('setValue', 0.00);
	$('#cod').numberbox('setValue', 0.00);

	$('#isfad').val('');
	$('#freight').numberbox('setValue', 10.00);
	$('#operator').val('');
	$('#remark').val('');
	// $('#expressid').val('');
}

function clearDataEdit() {
	$('#nodeid').val($.cookie("ckstation"));
	$('#barcode').val('');
	$('#sname').val('');
	$('#smobile').val('');
	$('#saddr').val('');

	$('#aname').val('');
	$('#amobile').val('');
	$('#aaddr').val('');

	$('#weight').numberbox('setValue', 1.00);
	$('#premium').numberbox('setValue', 0.00);
	$('#cod').numberbox('setValue', 0.00);

	$('#isfad').val('');
	$('#freight').numberbox('setValue', 10.00);
	$('#operator').val('');
	$('#remark').val('');
	$('#expressid').val('');
}

function clearDataTpl() {
	$('#nodeid_tpl').val($.cookie("ckstation"));
	$('#barcode_tpl').val('');
	$('#sname_tpl').val('');
	$('#smobile_tpl').val('');
	$('#saddr_tpl').val('');

	$('#aname_tpl').val('');
	$('#amobile_tpl').val('');
	$('#aaddr_tpl').val('');

	$('#weight_tpl').numberbox('setValue', 1.00);
	$('#premium_tpl').numberbox('setValue', 0.00);
	$('#cod_tpl').numberbox('setValue', 0.00);

	$('#isfad_tpl').val('');
	$('#freight_tpl').numberbox('setValue', 10.00);
	$('#remark_tpl').val('');
	$('#expressid_tpl').val('');

	$('#tplname_tpl').val('');
	$('#sunitname_tpl').val('');
	$('#aunitname_tpl').val('');
	$('#tradename_tpl').val('');
}

// test

var gStartPlaceTip = "选择发件地";
var gEndPlaceTip = "选择收件地";
var gQueryTipText = "街道/小区/大楼名等";
var gWeightSug = "未填时默认1公斤";

var n = 2;

/* 网点查询js */
var gQueryTipText = "街道/小区/大楼名等";
var gAjaxObject; // 查询ajax请求
var gAjaxTime;
var gLastKeyword = "";
var gSelectKeywordIndex = -1;

function resetareabox() {
	// $("#cityName_input").css("color", "#B2B2B2");
	// $("#cityName_input").val(gStartPlaceTip);
	// $("#cityId_input").val("");

	$("#cityName_input_2").css("color", "#B2B2B2");
	$("#cityName_input_2").val(gEndPlaceTip);
	$("#cityId_input_2").val("");

	$("#endPlaceDiv #common").click();

	// $("#startPlaceDiv #common").click();
}

$(function() {

	createArealist();
	// 删除地址
	$("#cityName_input").keydown(function(event) {
		var keyCode = event.keyCode;
		if (keyCode == 8 || keyCode == 46) {
			$("#cityName_input").css("color", "#B2B2B2");

			$("#cityName_input").val(gStartPlaceTip);
			$("#cityId_input").val("");
			event.preventDefault();
		}
	});
	$("#cityName_input_2").keydown(function(event) {
		var keyCode = event.keyCode;
		if (keyCode == 8 || keyCode == 46) {
			$("#cityName_input_2").css("color", "#B2B2B2");
			$("#cityName_input_2").val(gEndPlaceTip);
			$("#cityId_input_2").val("");
			event.preventDefault();
		}
	});

	$("#cityName_input_3").keydown(function(event) {
		var keyCode = event.keyCode;
		if (keyCode == 8 || keyCode == 46) {
			$("#cityName_input_3").css("color", "#B2B2B2");

			$("#cityName_input_3").val(gStartPlaceTip);
			$("#cityId_input_3").val("");
			event.preventDefault();
		}
	});
	$("#cityName_input_4").keydown(function(event) {
		var keyCode = event.keyCode;
		if (keyCode == 8 || _keyCode == 46) {
			$("#cityName_input_4").css("color", "#B2B2B2");
			$("#cityName_input_4").val(gEndPlaceTip);
			$("#cityId_input_4").val("");
			event.preventDefault();
		}
	});

	$("#second-right-4 a").hover(function() {
		n = parseInt($(this).text());
		pictureOn($(this).text());
	}, function() {

	});

	initPlaceInput();
	countyinit("startPlaceDiv", 0, function() {
		$("#cityName_input").css("color", "#333333");
	});
	countyinit("endPlaceDiv", 2, function() {
		$("#cityName_input_2").css("color", "#333333");
	});
	countyinit("startPlaceDivTpl", 3, function() {
		$("#cityName_input_3").css("color", "#333333");
	});
	countyinit("endPlaceDivTpl", 4, function() {
		$("#cityName_input_4").css("color", "#333333");
	});
	street();
	uldroplist();
	inputips();
});

/* 初始化选择地 */
function initPlaceInput() {
	var startPlaceInput = $("#cityName_input");
	var endPlaceInput = $("#cityName_input_2");

	startPlaceInput.val(gStartPlaceTip).css("color", "#B2B2B2").click(
			function(e) {
				$("#startPlaceDiv").show();
				$("#endPlaceDiv").hide();
				$("#input-tips").hide();
				e.stopPropagation();
			}).blur(function() {
		if ($(this).val() == "" || $(this).val() == gStartPlaceTip) {
			$(this).css("color", "#B2B2B2");
			$(this).val(gStartPlaceTip);
		} else {
			$(this).css("color", "#333333");
		}
	});

	endPlaceInput.val(gEndPlaceTip).css("color", "#B2B2B2").click(function(e) {
		$("#endPlaceDiv").show();
		$("#startPlaceDiv").hide();
		$("#input-tips").hide();
		e.stopPropagation();
	}).blur(function() {
		if ($(this).val() == "" || $(this).val() == gEndPlaceTip) {
			$(this).css("color", "#B2B2B2");
			$(this).val(gEndPlaceTip);
		} else {
			$(this).css("color", "#333333");
		}
	});

	var startPlaceInputTpl = $("#cityName_input_3");
	var endPlaceInputTpl = $("#cityName_input_4");

	startPlaceInputTpl.val(gStartPlaceTip).css("color", "#B2B2B2").click(
			function(e) {
				$("#startPlaceDivTpl").show();
				$("#endPlaceDivTpl").hide();
				$("#input-tips-Tpl").hide();
				e.stopPropagation();
			}).blur(function() {
		if ($(this).val() == "" || $(this).val() == gStartPlaceTip) {
			$(this).css("color", "#B2B2B2");
			$(this).val(gStartPlaceTip);
		} else {
			$(this).css("color", "#333333");
		}
	});

	endPlaceInputTpl.val(gEndPlaceTip).css("color", "#B2B2B2").click(
			function(e) {
				$("#endPlaceDivTpl").show();
				$("#startPlaceDivTpl").hide();
				$("#input-tips-Tpl").hide();
				e.stopPropagation();
			}).blur(function() {
		if ($(this).val() == "" || $(this).val() == gEndPlaceTip) {
			$(this).css("color", "#B2B2B2");
			$(this).val(gEndPlaceTip);
		} else {
			$(this).css("color", "#333333");
		}
	});

	// 读取出发地cookies
	var startPlace_inputVal = getcookie("startPlace_input");
	var streetVal = getcookie("street");
	var startPlaceVal = getcookie("startPlace");
	if (startPlace_inputVal != null && startPlace_inputVal != ""
			&& streetVal != null && streetVal != "" && startPlaceVal != null
			&& startPlaceVal != "") {
		var street = $("#street");
		street.val(streetVal).css("color", "#333333")
		startPlaceInput.val(startPlace_inputVal).css("color", "#333333");
		$("#cityId_input").val(startPlaceVal);
	}
}

/* 查价格 */
function queryPrice() {
	if ($("#cityName_input").val() == gStartPlaceTip
			|| $("#cityName_input").val() == "") {
		alert("请选择出发地");
		$("#cityName_input").select();
		return false;
	} else if ($("#cityId_input").val() == "") {
		alert("请选择出发地的城市、县区");
		$("#cityName_input").select();
		return false;
	}
	if ($("#street").val() == gQueryTipText) {
		$("#street").val("");
	}
	if ($("#cityName_input_2").val() == gEndPlaceTip
			|| $("#cityName_input_2").val() == "") {
		alert("请选择到达地");
		$("#cityName_input_2").select();
		return false;
	} else if ($("#cityId_input_2").val() == "") {
		alert("请选择到达地的城市、县区");
		$("#cityName_input_2").select();
		return false;
	}
	if ($.trim($("#weight").val()) == gWeightSug) {
		$("#weight").val("1");
	}
	if ($.trim($("#weight").val()).indexOf("。") > -1) {
		alert("重量需要输入正确的小数点");
		$("#weight").select();
		return false;
	}
	if ($.trim($("#weight").val()) != "" && !isNumber($("#weight").val())) {
		alert("重量需要输入正数");
		$("#weight").select();
		return false;
	}
	var orderSource = GetQueryString("orderSource");
	if (orderSource == "") {
		orderSource = "none";
	}
	$("#street").val(stringFilter($("#street").val())); // 点击 搜索快递 时清掉用户输入的特殊字符
	// 写入出发地cookies
	setcookie("startPlace_input", $("#cityName_input").val());
	setcookie("street", stringFilter($("#street").val())); // 存cookie前
	// 过滤掉可能的特殊字符
	setcookie("startPlace", $("#cityId_input").val());

	var queryHref = "delivery.shtml@source=kuaidi100&orderSource="
			+ orderSource + "&headerMenu=orderIndex&startPlace_input="
			+ encodeURIComponent($("#cityName_input").val()) + "&street="
			+ encodeURIComponent(stringFilter($("#street").val()))
			+ "&startPlace=" + $("#cityId_input").val() + "&endPlace_input="
			+ encodeURIComponent($("#cityName_input_2").val()) + "&endPlace="
			+ $("#cityId_input_2").val() + "&weight="
			+ $.trim($("#weight").val());
	$("#queryPriceHref").attr("href", queryHref);
	return true;
}

function street() {
	$("#street").val(gQueryTipText).css("color", "#B2B2B2");
	$("#street").focus(function() {
		if ($(this).val() == gQueryTipText) {
			$(this).val("").css("color", "#333");
		}
		$(this).select();
	});
	$("#street").blur(function() {
		if ($(this).val() == '') {
			$(this).val(gQueryTipText).css("color", "#B2B2B2");
		} else {
			$(this).css("color", "#333333");
		}
	});
}

function uldroplist() {
	var postid = $("#street");
	postid.keyup(function(e) {
		var keycode = e.keyCode ? e.keyCode : e.which;
		if (keycode != 13) {
			var keyword = $("#street").val();
			if (keyword != "") {
				if (keyword != gLastKeyword) {
					clearTimeout(gAjaxTime);
					gAjaxTime = setTimeout("getKeyword()", 200);
				}
			} else {
				clearTimeout(gAjaxTime);
				$("#input-tips").hide();
				gSelectKeywordIndex = -1;
			}
		}
	}).keydown(
			function(e) {
				var keycode = e.keyCode ? e.keyCode : e.which;
				if (keycode == 13) {
					clearTimeout(gAjaxTime);
					if (gSelectKeywordIndex >= 0) {
						$("#street").val(
								$(
										"#input-tips li:eq("
												+ gSelectKeywordIndex + ")")
										.attr("text")).css("color", "#333");
						gSelectKeywordIndex = -1;
						$("#input-tips").hide();
					}
				} else if (keycode == 40) {
					if ($("#input-tips").is(":hidden")) {
						$("#input-tips").show();
					} else {
						if (gSelectKeywordIndex == -1) {
							gSelectKeywordIndex = 0;
						} else if (gSelectKeywordIndex == $(
								"#input-tips li:last").attr("index")) {
							gSelectKeywordIndex = 0;
						} else {
							gSelectKeywordIndex++;
						}
						$("#input-tips li").removeClass("hover");
						$("#input-tips li:eq(" + gSelectKeywordIndex + ")")
								.addClass("hover");
					}
				} else if (keycode == 38) {
					if ($("#input-tips").is(":hidden")) {
						$("#input-tips").show();
					} else {
						if (gSelectKeywordIndex == "") {
							gSelectKeywordIndex = $("#input-tips li:last")
									.attr("index");
						} else if (gSelectKeywordIndex == 0) {
							gSelectKeywordIndex = $("#input-tips li:last")
									.attr("index");
						} else {
							gSelectKeywordIndex--;
						}
						$("#input-tips li").removeClass("hover");
						$("#input-tips li:eq(" + gSelectKeywordIndex + ")")
								.addClass("hover");
					}
				}
			});

	$("#input-tips").delegate("li", "mouseenter", function() {
		$("#input-tips li").removeClass("hover");
		$(this).addClass("hover");
		gSelectKeywordIndex = $(this).attr("index");
	}).delegate("li", "click", function() {
		$("#street").val($(this).attr("text"));
		gSelectKeywordIndex = -1;
	});
}

function getKeyword() {
	var keyword = $("#street").val();
	gLastKeyword = keyword;
	$("#input-tips").html("");
	if (gAjaxObject) {
		gAjaxObject.abort();
	}
	gAjaxObject = $.ajax({
		type : "post",
		url : "network/www/searchapi.do",
		data : "method=hintlist&text=" + encodeURIComponent(keyword) + "&area="
				+ $("#cityId_input").val(),
		dataType : "json",
		success : function(result) {
			if (result.status == 200) {
				if (result.total > 0) {
					gSelectKeywordIndex = -1;
					for ( var i in result.keywordList) {
						var fullName = result.keywordList[i].fullName;
						var text = result.keywordList[i].text;
						$("#input-tips").append(
								"<li index=\"" + i + "\" fullname=\""
										+ fullName + "\" text=\"" + text
										+ "\"><strong>" + text + "</strong>"
										+ fullName + "</li>");
					}
					$("#input-tips").show();
				} else {
					$("#input-tips").hide();
					gSelectKeywordIndex = -1;
				}
			}
		}
	});
}

/* 针对input-tips 的键盘操作 */
function inputips() {
	$("html").click(function() {
		if (!$("#input-tips").is(':hidden')) {
			$("#input-tips").hide();
		}
	});
}

/* 查找订单 */
function toOrderList(thiz) {
	var loginStatus = $("#loginStatus").val();
	if (loginStatus != "") { // 已登录
		$(thiz).attr("href", "user/orderList.shtml");
	} else {
		$(thiz).attr("href", "user/login.shtml");
	}
}

// 判断是否是数字
function isNumber(s) {
	var regu = "^[0-9\.]+$";
	var re = new RegExp(regu);
	if (re.test(s)) {
		return true;
	} else {
		return false;
	}
}

/* 获取cookies */
function getcookie(cookieName) {
	var cookieValue = "";
	if (document.cookie && document.cookie != '') {
		var cookies = document.cookie.split(';');
		for (var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].replace(/(^\s*)|(\s*$)/g, "");
			if (cookie.substring(0, cookieName.length + 1) == (cookieName + '=')) {
				cookieValue = unescape(cookie.substring(cookieName.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}

// 设置永久cookies
function setcookie(cookieName, cookieValue) {
	var expires = new Date();
	var now = parseInt(expires.getTime());
	var et = (86400 - expires.getHours() * 3600 - expires.getMinutes() * 60 - expires
			.getSeconds());
	expires.setTime(now + 1000000 * (et - expires.getTimezoneOffset() * 60));
	document.cookie = escape(cookieName) + "=" + escape(cookieValue)
			+ ";expires=" + expires.toGMTString() + "; path=/";
}

/* 正则过滤掉特殊字符 */
function stringFilter(s) {
	var pattern = new RegExp(
			"[`~·!@#$^&*=|{}':;'\\[\\].<>@~_25EF_25BC_2581_40 #　￥　　\"……&*|\\{}【】‘；：.”“'？+_%]");
	var patternNum = new RegExp("[0-9]");
	var rs = "";
	for (var i = 0; i < s.length; i++) {

		if (s.substr(i, 1).match(patternNum) != null) {
			rs = rs + s.substr(i, 1);
		} else {
			rs = rs + s.substr(i, 1).replace(pattern, '');
		}
	}
	return rs;
}

/* 正则过滤掉特殊字符 */
function filterBarcode(s) {
	var pattern = new RegExp("[a-zA-Z0-9]");
	var rs = "";
	for (var i = 0; i < s.length; i++) {

		if (s.substr(i, 1).match(pattern)) {
			rs = rs + s.substr(i, 1);
		}

	}
	return rs;
}
/* 正则过滤掉特殊字符 */
function stringFilterName(s) {
	var pattern = new RegExp(
			"[`~·!@#$^&*()=|{}':;',\\[\\].<>@~_25EF_25BC_2581_40 #　￥　　\"……&*（）——|{}【】‘；：”“'。，、？+-_%《》]");
	var patternNum = new RegExp("[0-9]");
	var rs = "";
	for (var i = 0; i < s.length; i++) {
		rs = rs + s.substr(i, 1).replace(pattern, '');
	}
	return rs;
}

function getcatchgoodsorderid() {
	var reqUrl = "/services/manage/getcatchgoodsorderid/?id=" + Math.random();
	var result = $.ajax({
		url : reqUrl,
		async : false
	});

	return result.responseText;
}

function createArealist() {
	/*
	 * var arealist = area["province"]; var areaId;
	 *
	 * for (var i=0; i < arealist.length; i++) { areaId = arealist[i].code; var
	 * reqUrl = "/services/manage/getsubarea/?id="+Math.random(); var args =
	 * $.ajax({url:reqUrl,async:false,type:'POST',data:{areaid:areaId}});
	 *
	 * var reqUrl = "/services/manage/creatersubarea/?id="+Math.random(); var
	 * args =
	 * $.ajax({url:reqUrl,async:false,type:'POST',data:{areaid:areaId,subarea:args.responseText}}); }
	 */
}

function initCatchGoodsExpresses() {
	var ajax = new AjaxHelper();
	ajax.OnWaitting = function() {
	};
	ajax.AsyncGet("/services/manage/getnodeexpress/" + $.cookie("ckstation")
			+ "?id=" + Math.random(), function(args) {

		var rs = eval('(' + args + ')');

		var expressSet = rs.result.expresses;

		if (expressSet && typeof (expressSet) != "undefined") {
			for (var i = 0; i < rs.result.expresses.length; i++) {
				$("#expressid_create").append(
						"<option value='" + rs.result.expresses[i].id + "'>"
								+ rs.result.expresses[i].name + "</option>");
				$("#expressid").append(
						"<option value='" + rs.result.expresses[i].id + "'>"
								+ rs.result.expresses[i].name + "</option>");
				$("#expressid_tpl").append(
						"<option value='" + rs.result.expresses[i].id + "'>"
								+ rs.result.expresses[i].name + "</option>");

			}
			$("#expressid").attr("disabled", false);
			$("#expressid_tpl").attr("disabled", false);
		} else {
			$("#expressid").append("<option value='-999'>空缺</option>");
			$("#expressid").attr("disabled", true);

			$("#expressid_tpl").append("<option value='-999'>空缺</option>");
			$("#expressid_tpl").attr("disabled", true);
		}
	});

}

function submit_handle() {
	if ($("#ff").form('validate')) {
		var nodeid = $.trim($("#nodeid_p").val());
		var orderid = $.trim($("#orderid_p").val());
		var event = $.trim($("#event_p").val());
		var operator = $.trim($("#operator_p").val());
		var comment = $.trim($("#comment_p").val());
		var paytype = $.trim($("#paytype_p").val());

		var postData = "nodeid=" + nodeid + "&orderid=" + orderid + "&event="
				+ event + "&operator=" + operator + "&paytype=" + paytype
				+ "&comment=" + stringFilter(comment);
		var ajax = new AjaxHelper();

		ajax.AsyncPost("/services/manage/cancelorder", postData,
				function(args) {
					var result = eval('(' + args + ')');

					if (result.result && result.result.code == 200) {
						var valueLabel = "";

						switch (event) {
						case "create": {
							valueLabel = "等待受理";
						}
							;
							break;
						case "accept": {
							valueLabel = "寄件录入（已受理）";
						}
							;
							break;
						case "done": {
							valueLabel = "寄件交接（已寄出）";
						}
							;
							break;
						case "cancel": {
							valueLabel = "已取消";
						}
							;
							break;
						case "reject": {
							valueLabel = "拒绝受理";
						}
							;
							break;
						case "close": {
							valueLabel = "已关闭";
						}
							;
							break;
						}

						var msg = "提交成功！该单状态现在已经变为[" + valueLabel + "]状态谢谢！";

						dialog("text", "系统提示!", msg);
						getdata($("#dg").datagrid("options").pageIndex,
								$("#dg").datagrid("options").pageSize, false);
					} else if (result.error && result.error.code) {
						var msg = "错误码:[" + result.error.code + "]"
								+ result.error.message + "!";

						dialog("text", "系统提示!", msg);
					} else {
						dialog("text", "系统提示!", '提交失败! 请稍后再试...');
					}

				});
	} else {
		dialog("text", "系统提示!", "请填写所有必须的信息！");
	}
}

function submitHandleByType(type) {

	if ($("#ff").form('validate')) {
		var nodeid = $.trim($("#nodeid_p").val());
		var orderid = $.trim($("#orderid_p").val());
		var event = $.trim($("#event_p").val());
		var operator = $.trim($("#operator_p").val());
		var comment = $.trim($("#comment_p").val());
		var paytype = $.trim($("#paytype_p").val());

		if (type && type != "") {
			event = type;
		}

		var postData = "nodeid=" + nodeid + "&orderid=" + orderid + "&event="
				+ event + "&operator=" + operator + "&comment=" + comment
				+ "&paytype=" + paytype;
		var ajax = new AjaxHelper();

		ajax.AsyncPost("/services/manage/cancelorder", postData,
				function(args) {
					var result = eval('(' + args + ')');

					if (result.result && result.result.code == 200) {
						if (type == "reject") {
							$('#popupWinProcess').window('close')
						}

						var valueLabel = "";

						switch (event) {
						case "create": {
							valueLabel = "等待受理";
						}
							;
							break;
						case "accept": {
							valueLabel = "寄件录入（已受理）";
						}
							;
							break;
						case "done": {
							valueLabel = "寄件交接（已寄出）";
						}
							;
							break;
						case "cancel": {
							valueLabel = "已取消";
						}
							;
							break;
						case "reject": {
							valueLabel = "拒绝受理";
						}
							;
							break;
						case "close": {
							valueLabel = "已关闭";
						}
							;
							break;
						}

						var msg = "提交成功!该单状态已变为<b>[" + valueLabel + "]</b>谢谢!";

						dialog("text", "系统提示!", msg);

						getdata($("#dg").datagrid("options").pageIndex,
								$("#dg").datagrid("options").pageSize, false);

					} else {
						dialog("text", "系统提示!", "提交失败！");
					}

				});
	} else {
		dialog("text", "系统提示!", "请填写所有必须的信息！");
	}
}

var barcodeIntervalId;

function filterBarcodeStart() {
	barcodeIntervalId = setInterval(function() {
		$("#barcode").val(filterBarcode($("#barcode").val()))
	}, 100);
}

function filterBarcodeEnd() {
	clearInterval(barcodeIntervalId);
}

var addressIntervalId;

function filterAddressStart(id) {
	addressIntervalId = setInterval(function() {
		$("#" + id).val(stringFilter($("#" + id).val()))
	}, 100);
}

function filterAddressEnd() {
	clearInterval(addressIntervalId);
}

function addressRegex(id) {
	$("#" + id).val(stringFilter($("#" + id).val()));
}

function showManageUserPaneltpl(type, index) {
	// $('#catchgoodpanel').window('open');
	var panel = $('#catchgoodpaneltpl');
	var winTitle = $('#catchgoodpaneltpl').prev();
	$('#catchgoodpaneltpl').window('open');

	$("#nodeidname").val($.cookie("ckschoolname"));
	// resetareabox();

	if (type == "add") {
		$('.panel-title', winTitle).text("创建新模板");
		// $("#usertype").removeAttr("disabled");
		// $('#userjobnum').validatebox({required:true});
		// $("#userjobnum").removeAttr("disabled");
		isEditModeTpl = false;

		clearDataTpl();

		if ($.trim($.cookie("ckstation")) == "N9D400002867") {
			$('#saddr_tpl').val("旺座国际")
		}

	} else if (type == "update") {
		clearDataTpl();
		var rows = $('#dg_tpl').datagrid("getRows");
		var selectedRow = rows[index];

		isEditModeTpl = true;
		$('.panel-title', winTitle).text("修改选中的模板");
		// 装填选中行数据到表单
		// $("#usertype").attr("disabled","disabled");
		if (selectedRow) {

			if (selectedRow.adistrict == "0") {
				selectedRow.adistrict = "000";
			}

			if (selectedRow.sdistrict == "0") {
				selectedRow.sdistrict = "000";
			}
			if (selectedRow.adistrict != "-1"
					&& selectedRow.adistrict.length == 2) {
				selectedRow.adistrict = "0" + selectedRow.adistrict;
			}
			if (selectedRow.sdistrict != "-1"
					&& selectedRow.sdistrict.length == 2) {
				selectedRow.sdistrict = "0" + selectedRow.sdistrict;
			}

			if (selectedRow.adistrict.length == 1) {
				selectedRow.adistrict = "00" + selectedRow.adistrict;
			}
			if (selectedRow.sdistrict.length == 1) {
				selectedRow.sdistrict = "00" + selectedRow.sdistrict;
			}

			var aarea = selectedRow.acity.toString()
					+ selectedRow.adistrict.toString();
			var sarea = selectedRow.scity.toString()
					+ selectedRow.sdistrict.toString();

			if (selectedRow.adistrict.length == 6) {
				aarea = selectedRow.adistrict.toString();
			}

			if (selectedRow.sdistrict.length == 6) {
				sarea = selectedRow.sdistrict.toString();
			}

			setCityCodeTpl(aarea, 'receive');
			setCityCodeTpl(sarea, 'send');

			$('#shipid_tpl').val(selectedRow.shipid);
			$('#nodeid_tpl').val(selectedRow.nodeid);
			$('#sname_tpl').val(selectedRow.sname);
			$('#smobile_tpl').val(selectedRow.smobile);
			$('#saddr_tpl').val(selectedRow.saddr);

			$('#aname_tpl').val(selectedRow.aname);
			$('#amobile_tpl').val(selectedRow.amobile);
			$('#aaddr_tpl').val(selectedRow.aaddr);

			$('#barcode_tpl').val(selectedRow.barcode);

			var weightVal = parseFloat(parseInt(selectedRow.weight) / 1000)
					.toFixed(2);

			var premiumVal = parseFloat(parseInt(selectedRow.premium) / 100)
					.toFixed(2);
			var codVal = parseFloat(parseInt(selectedRow.cod) / 100).toFixed(2);
			var freightVal = parseFloat(parseInt(selectedRow.freight) / 100)
					.toFixed(2);

			$('#weight_tpl').numberbox('setValue', weightVal);
			$('#premium_tpl').numberbox('setValue', premiumVal);
			$('#cod_tpl').numberbox('setValue', codVal);
			$('#freight_tpl').numberbox('setValue', freightVal);

			$('#isfad_tpl').val(selectedRow.isfad);
			$('#remark_tpl').val(selectedRow.remark);

			$('#tplname_tpl').val(selectedRow.tplname);
			$('#sunitname_tpl').val(selectedRow.sunitname);
			$('#aunitname_tpl').val(selectedRow.aunitname);
			$('#tradename_tpl').val(selectedRow.tradename);

			$('#expressid_tpl').val(selectedRow.expressid);
		}

	}

	panel.show();
}

var isEditModeTpl = false;

function deletetpl(id, index) {
	var ajax = new AjaxHelper();
	var postData = "shipid=" + id;

	var title = '确实要删除选中的模板吗?';

	$.messager.confirm('删除模板确认', title, function(r) {
		if (r) {

			ajax.AsyncPost("/services/manage/deleteshippingtpl", postData,
					function(args) {
						var result = args;

						if (result == 1) {
							var msg = "删除模板成功！";
							dialog("text", "系统提示!", msg);
							gettpldata();
						} else {
							dialog("text", "系统提示!", '删除失败! 请稍后再试...');
						}
					});

		}
	});
}

function submit_goods_tpl() {
	if ($("#formtpl").form('validate')) {
		var tplname = $.trim($("#tplname_tpl").val());
		var shipid = $.trim($("#shipid_tpl").val());
		var nodeid = $.cookie("ckstation");
		var expressid = $.trim($("#expressid_tpl").val());
		var barcode = $.trim($("#barcode_tpl").val());

		var smobile = $.trim($("#smobile_tpl").val());
		var sname = $.trim($("#sname_tpl").val());
		var scity = $.trim($("#cityId_input_3").val());
		var sdistrict = $.trim($("#cityId_input_3").val());
		var saddr = $.trim($("#saddr_tpl").val());

		var aname = $.trim($("#aname_tpl").val());
		var amobile = $.trim($("#amobile_tpl").val());
		var acity = $.trim($("#cityId_input_4").val());
		var adistrict = $.trim($("#cityId_input_4").val());
		var aaddr = $.trim($("#aaddr_tpl").val());

		var weight = $.trim($("#weight_tpl").val());
		var isfad = $.trim($("#isfad_tpl").val());
		var freight = $.trim($("#freight_tpl").val());
		var cod = $.trim($("#cod_tpl").val());
		var premium = $.trim($("#premium_tpl").val());
		var remark = $.trim($("#remark_tpl").val());

		var sunitname = $.trim($("#sunitname_tpl").val());
		var aunitname = $.trim($("#aunitname_tpl").val());

		var tradename = $.trim($("#tradename_tpl").val());

		var remark = $.trim($("#remark_tpl").val());

		weight = Math.round((parseFloat(weight) * 1000)).toString();
		freight = Math.round((parseFloat(freight) * 100)).toString();
		cod = Math.round((parseFloat(cod) * 100)).toString();
		premium = Math.round((parseFloat(premium) * 100)).toString();

		sname = stringFilter(sname);
		saddr = stringFilter(saddr);
		aname = stringFilter(aname);
		aaddr = stringFilter(aaddr);
		remark = stringFilter(remark);

		var postData = "tplname=" + tplname + "&nodeid=" + nodeid
				+ "&expressid=" + expressid + "&barcode=" + barcode
				+ "&smobile=" + smobile + "&sname=" + sname + "&scity=" + scity
				+ "&sdistrict=" + sdistrict + "&saddr=" + saddr + "&aname="
				+ aname + "&amobile=" + amobile + "&acity=" + acity
				+ "&adistrict=" + adistrict + "&aaddr=" + aaddr + "&sunitname="
				+ sunitname + "&aunitname=" + aunitname + "&tradename="
				+ tradename + "&weight=" + weight + "&isfad=" + isfad
				+ "&freight=" + freight + "&cod=" + cod + "&premium=" + premium
				+ "&remark=" + remark;

		var ajax = new AjaxHelper();
		var mode = "addshippingtpl";

		if (isEditModeTpl) {
			mode = "updateshippingtpl";
			postData += "&shipid=" + shipid;
		}

		ajax.AsyncPost("/services/manage/" + mode, postData, function(args) {
			var result = args;

			if (result == 1) {
				var msg = "创建模板成功！";

				if (isEditModeTpl) {
					msg = "更新模板成功";

					$('#catchgoodpaneltpl').window('close');
				}

				dialog("text", "系统提示!", msg);
				gettpldata();
			} else {
				dialog("text", "系统提示!", '提交失败! 请稍后再试...');
			}

			$('#catchgoodpaneltpl').window('close');
		});
	} else {
		dialog("text", "系统提示!", "请填写所有必须的信息！");
	}
}

function printsendertpl(selectedIndex) {
	// alert(selectedIndex);
	var pagerows = $('#dg_tpl').datagrid("getRows");
	var rows = {};

	copyObject(rows, pagerows[selectedIndex]);

	if (rows.length == 0) {
		dialog("text", "系统提示!", "请点需要打印的寄件单谢谢！");
		return;
	}

	rows.weight = parseFloat(parseInt(rows.weight) / 1000).toFixed(2) + "";
	rows.premium = parseFloat(parseInt(rows.premium) / 100).toFixed(2) + "";
	rows.cod = parseFloat(parseInt(rows.cod) / 100).toFixed(2) + "";
	rows.freight = parseFloat(parseInt(rows.freight) / 100).toFixed(2) + "";
	rows.istpl = "true";
	var postData = JSON.stringify(rows);

	postData = postData.replace("expressid", "expid");
	postData = postData.replace("sname", "sender");
	postData = postData.replace("aname", "receiver");
	postData = postData.replace("saddr", "saddress");
	postData = postData.replace("aaddr", "aaddress");

	postData = "[" + postData + "]";

	// alert(postData);

	var expName = rows.expressid;

	printBatchSender(postData, expName, 1);

}

var tpldata = [];

function loadtpldata() {
	var sltid = $("#sel_tpl").val();
	var selectedRow;

	for (var i = 0; i < tpldata.length; i++) {
		if (tpldata[i].shipid == sltid) {
			selectedRow = tpldata[i];

			break;
		}
	}

	if (selectedRow) {
		if (selectedRow.adistrict == "0") {
			selectedRow.adistrict = "000";
		}

		if (selectedRow.sdistrict == "0") {
			selectedRow.sdistrict = "000";
		}
		if (selectedRow.adistrict != "-1" && selectedRow.adistrict.length == 2) {
			selectedRow.adistrict = "0" + selectedRow.adistrict;
		}
		if (selectedRow.sdistrict != "-1" && selectedRow.sdistrict.length == 2) {
			selectedRow.sdistrict = "0" + selectedRow.sdistrict;
		}

		if (selectedRow.adistrict.length == 1) {
			selectedRow.adistrict = "00" + selectedRow.adistrict;
		}
		if (selectedRow.sdistrict.length == 1) {
			selectedRow.sdistrict = "00" + selectedRow.sdistrict;
		}

		var aarea = selectedRow.acity.toString()
				+ selectedRow.adistrict.toString();
		var sarea = selectedRow.scity.toString()
				+ selectedRow.sdistrict.toString();

		if (selectedRow.adistrict.length == 6) {
			aarea = selectedRow.adistrict.toString();
		}

		if (selectedRow.sdistrict.length == 6) {
			sarea = selectedRow.sdistrict.toString();
		}

		setCityCode(aarea, 'receive');
		setCityCode(sarea, 'send');

		$('#nodeid').val(selectedRow.nodeid);
		$('#sname').val(selectedRow.sname);
		$('#smobile').val(selectedRow.smobile);
		$('#saddr').val(selectedRow.saddr);

		$('#aname').val(selectedRow.aname);
		$('#amobile').val(selectedRow.amobile);
		$('#aaddr').val(selectedRow.aaddr);

		$('#barcode').val(selectedRow.barcode);

		var weightVal = parseFloat(parseInt(selectedRow.weight) / 1000)
				.toFixed(2);

		var premiumVal = parseFloat(parseInt(selectedRow.premium) / 100)
				.toFixed(2);
		var codVal = parseFloat(parseInt(selectedRow.cod) / 100).toFixed(2);
		var freightVal = parseFloat(parseInt(selectedRow.freight) / 100)
				.toFixed(2);

		$('#weight').numberbox('setValue', weightVal);
		$('#premium').numberbox('setValue', premiumVal);
		$('#cod').numberbox('setValue', codVal);
		$('#freight').numberbox('setValue', freightVal);

		$('#isfad').val(selectedRow.isfad);
		$('#remark').val(selectedRow.remark);

		$('#expressid').val(selectedRow.expressid);

	}

}

function initTplData() {
return;
	$("#sel_tpl").html("");

	var ajax = new AjaxHelper();
	ajax.AsyncGet("/services/manage/getshippingtpl/" + $.cookie("ckstation")
			+ "/-999?id=" + Math.random(), function(args) {

		var result = eval('(' + args + ')');

		tpldata = result;

		if (tpldata && tpldata.length > 0) {
			for (var i = 0; i < tpldata.length; i++) {
				$("#sel_tpl").append(
						"<option value='" + tpldata[i].shipid + "'>"
								+ tpldata[i].tplname + "</option>");
			}

			$("#sel_tpl").attr("disabled", false);
		} else {
			$("#sel_tpl").append(
					"<option value='-999' selected> 无模板可用 </option>");
			$("#sel_tpl").attr("disabled", true);
		}
	});
}

function getType(o) {
	var _t;
	return ((_t = typeof (o)) == "object" ? o == null && "null"
			|| Object.prototype.toString.call(o).slice(8, -1) : _t)
			.toLowerCase();
}

function copyObject(destination, source) {
	for ( var p in source) {
		if (getType(source[p]) == "array" || getType(source[p]) == "object") {
			destination[p] = getType(source[p]) == "array" ? [] : {};
			arguments.callee(destination[p], source[p]);
		} else {
			destination[p] = source[p];
		}
	}
}

function showOptionalItem(flag) {
	if (flag) {
		$("#s_area_panel").show();
		$("#a_area_panel").show();
		$("#a_option_panel").show();
	} else {
		$("#s_area_panel").hide();
		$("#a_area_panel").hide();
		$("#a_option_panel").hide();
	}

}

function showOptionalItemTpl(flag) {
	if (flag) {
		$("#s_area_panel_tpl").show();
		$("#a_area_panel_tpl").show();
		$("#a_option_panel_tpl").show();
	} else {
		$("#s_area_panel_tpl").hide();
		$("#a_area_panel_tpl").hide();
		$("#a_option_panel_tpl").hide();
	}

}

function setareaname(row) {
	if (row.adistrict == "0") {
		row.adistrict = "000";
	}

	if (row.adistrict != "-1" && row.adistrict.length == 2) {
		row.adistrict = "0" + row.adistrict;
	}
	if (row.sdistrict != "-1" && row.sdistrict.length == 2) {
		row.sdistrict = "0" + row.sdistrict;
	}

	if (row.adistrict.length == 1) {
		row.adistrict = "00" + row.adistrict;
	}
	if (row.sdistrict.length == 1) {
		row.sdistrict = "00" + row.sdistrict;
	}

	if (row.sdistrict == "0") {
		row.sdistrict = "000";
	}

	var aarea = row.acity.toString() + row.adistrict.toString();
	var sarea = row.scity.toString() + row.sdistrict.toString();

	if (row.adistrict.length == 6) {
		aarea = row.adistrict.toString();
	}

	if (row.sdistrict.length == 6) {
		sarea = row.sdistrict.toString();
	}

	if (sarea != "" && sarea != "-1-1") {
		var scitycode = getCityCode(sarea);

		if (scitycode && scitycode != "") {
			row.saddress = scitycode + row.saddress;
			// alert(row.saddress);
		}

	}

	if (aarea != "" && aarea != "-1-1") {
		var acitycode = getCityCode(aarea);

		if (acitycode && acitycode != "") {
			row.aaddress = acitycode + row.aaddress;
			// alert(row.aaddress);
		}

	}
}

function find_order_status() {
	var pagenumber = 1;
	var pagerows = 1000;

	var orderid = $.trim($("#order_status").val());

	if (orderid == "") {
		dialog("text", "系统提示!", '您好请输入订单号！');

		return;
	}

	var dayfrom = '19770101';
	var dayto = '20990101';

	if (orderid == "") {
		orderid = "-999";
	}

	var ajax = new AjaxHelper();

	// getnodepickups($nodeid,$status,$orderid,$expid,$mobile,$keyword,$dayfrom,$dayto,$pagerows,$pagenumber)

	ajax.AsyncGet("/services/manage/getnodepickupsforone/"
			+ $.cookie("ckstation") + "/-999/" + orderid + "/-999/-999/-999/"
			+ dayfrom + "/" + dayto + "/" + pagerows + "/" + pagenumber
			+ "?id=" + Math.random(), function(args) {

		// args = '{"jsonrpc": "2.0", "id": "dxxt883e", "result": {"pickups":
		// [{"sdistrict": "-1", "expid": "9", "weight": "1000", "smobile":
		// "13324570117", "amobile": "13324570117", "acity": "-1", "freight":
		// "1000", "operator": "", "statustime": "2014-06-25 18:53:09", "id":
		// "31", "details": "", "adistrict": "-1", "status": "wait", "premium":
		// "0", "saddress": "测试地址111", "barcode": "", "nodeid": "N9D400001544",
		// "scity": "-1", "remark": "", "sender": "小吴八", "isfad": "0",
		// "aaddress": "测试地址222", "cod": "0", "receiver": "小吴八", "createtime":
		// "2014-06-25 18:53:09"}, {"sdistrict": "-1", "expid": "9", "weight":
		// "1000", "smobile": "13324570117", "amobile": "13324570117", "acity":
		// "-1", "freight": "1000", "operator": "kimi", "statustime":
		// "2014-06-26 11:56:46", "id": "32", "details": "地址不准", "adistrict":
		// "-1", "status": "rejected", "premium": "0", "saddress": "测试地址111",
		// "barcode": "", "nodeid": "N9D400001544", "scity": "-1", "remark": "",
		// "sender": "小吴九", "isfad": "0", "aaddress": "测试地址222", "cod": "0",
		// "receiver": "小吴九", "createtime": "2014-06-25 18:54:04"},
		// {"sdistrict": "-1", "expid": "9", "weight": "1000", "smobile":
		// "13324570117", "amobile": "13324570117", "acity": "-1", "freight":
		// "1000", "operator": "kimi", "statustime": "2014-06-25 18:55:47",
		// "id": "33", "details": "信息不全", "adistrict": "-1", "status": "sent",
		// "premium": "0", "saddress": "测试地址111", "barcode": "", "nodeid":
		// "N9D400001544", "scity": "-1", "remark": "", "sender": "小吴十",
		// "isfad": "0", "aaddress": "测试地址111", "cod": "0", "receiver": "小吴十",
		// "createtime": "2014-06-25 18:54:57"}, {"sdistrict": "1001", "expid":
		// "0", "weight": "0", "smobile": "15286646332", "amobile":
		// "13738188664", "acity": "1", "freight": "0", "operator": "",
		// "statustime": "2014-06-26 11:18:09", "id": "34", "details": "",
		// "adistrict": "1001", "status": "wait", "premium": "0", "saddress":
		// "你抽测试", "barcode": "", "nodeid": "N9D400001544", "scity": "1",
		// "remark": "", "sender": "4噢耶", "isfad": "0", "aaddress": "文苏路969",
		// "cod": "0", "receiver": "姚其林", "createtime": "2014-06-26 11:18:09"},
		// {"sdistrict": "1001", "expid": "0", "weight": "0", "smobile":
		// "15286646332", "amobile": "13738188664", "acity": "1", "freight":
		// "0", "operator": "", "statustime": "2014-06-26 11:18:20", "id": "35",
		// "details": "", "adistrict": "1001", "status": "wait", "premium": "0",
		// "saddress": "你抽测试", "barcode": "", "nodeid": "N9D400001544", "scity":
		// "1", "remark": "", "sender": "4噢耶", "isfad": "0", "aaddress":
		// "文苏路969", "cod": "0", "receiver": "姚其林", "createtime": "2014-06-26
		// 11:18:20"}, {"sdistrict": "1001", "expid": "0", "weight": "0",
		// "smobile": "13652632632", "amobile": "13335522236", "acity": "1",
		// "freight": "0", "operator": "", "statustime": "2014-06-26 11:22:02",
		// "id": "36", "details": "", "adistrict": "1001", "status": "wait",
		// "premium": "0", "saddress": "你电话了吧我", "barcode": "", "nodeid":
		// "N9D400001544", "scity": "1", "remark": "", "sender": "我的手机",
		// "isfad": "0", "aaddress": "面包机", "cod": "0", "receiver": "1332",
		// "createtime": "2014-06-26 11:22:02"}, {"sdistrict": "1001", "expid":
		// "0", "weight": "0", "smobile": "13652632632", "amobile":
		// "13335522236", "acity": "1", "freight": "0", "operator": "",
		// "statustime": "2014-06-26 11:22:10", "id": "37", "details": "",
		// "adistrict": "1001", "status": "wait", "premium": "0", "saddress":
		// "你电话了吧我", "barcode": "", "nodeid": "N9D400001544", "scity": "1",
		// "remark": "", "sender": "我的手机", "isfad": "0", "aaddress": "面包机",
		// "cod": "0", "receiver": "1332", "createtime": "2014-06-26 11:22:10"},
		// {"sdistrict": "1001", "expid": "0", "weight": "0", "smobile":
		// "13652632632", "amobile": "13335522236", "acity": "1", "freight":
		// "0", "operator": "", "statustime": "2014-06-26 11:22:20", "id": "38",
		// "details": "", "adistrict": "1001", "status": "wait", "premium": "0",
		// "saddress": "你电话了吧我", "barcode": "", "nodeid": "N9D400001544",
		// "scity": "1", "remark": "", "sender": "我的手机", "isfad": "0",
		// "aaddress": "面包机", "cod": "0", "receiver": "1332", "createtime":
		// "2014-06-26 11:22:20"}, {"sdistrict": "1001", "expid": "0", "weight":
		// "0", "smobile": "活着", "amobile": "哈哈", "acity": "1", "freight": "0",
		// "operator": "", "statustime": "2014-06-26 11:43:40", "id": "39",
		// "details": "", "adistrict": "1001", "status": "wait", "premium": "0",
		// "saddress": "哈哈", "barcode": "", "nodeid": "N9D400001544", "scity":
		// "1", "remark": "", "sender": "阿辉", "isfad": "0", "aaddress": "哈哈",
		// "cod": "0", "receiver": "哈哈", "createtime": "2014-06-26 11:43:40"}],
		// "total": 39, "code": 200}}';

		var result = eval('(' + args + ')');

		if (result.result.total == 0) {
			$('#order_status_lbl').html("查无此订单")//
		} else {
			$('#order_status_lbl').html("显示订单状态");//

			var valueLabel = "";

			switch (result.result.orders[0].event) {
			case "create": {
				valueLabel = "等待受理";
			}
				;
				break;
			case "accept": {
				valueLabel = "寄件录入（已受理）";
			}
				;
				break;
			case "done": {
				valueLabel = "寄件交接（已寄出）";
			}
				;
				break;
			case "cancel": {
				valueLabel = "已取消";
			}
				;
				break;
			case "reject": {
				valueLabel = "拒绝受理";
			}
				;
				break;
			case "close": {
				valueLabel = "已关闭";
			}
				;
				break;
			}

			$('#order_status_lbl').html(valueLabel);
		}

	});
}

function showPopupWinEP() {

	if ($('#enterp_cb').attr("checked") == "checked") {
		return;
	}

	name = $.trim($('#sname').val());
	phone = $.trim($('#smobile').val());

	if (name != "" && phone != "") {
		if (!getsenderEP(name, phone)) {
			hasShowPopupWinEP = true;

			var title = '您好该用户还不是企业用户需要添加此用户为企业用户吗？';
			$.messager.confirm('添加此用户为企业用户', title, function(r) {
				if (r) {

					EPFormClear();
					$('#popupWinEP').window('open');

					$('#username_ep').val(name);
					$('#phone_ep').val(phone);
					$("#addEPBtn").hide();

					createEPList();

				} else {
					hasShowPopupWinEP = false;
				}
			});
		}
	}
}

var hasShowPopupWinEP = false;

function showPopupWinEPCS() {
	name = $.trim($('#sname').val());
	phone = $.trim($('#smobile').val());

	if (name != "" && phone != "") {
		if (!getsenderEP(name, phone)) {
			if (!hasShowPopupWinEP) {
				EPFormClear();
				$('#popupWinEP').window('open');

				$('#username_ep').val(name);
				$('#phone_ep').val(phone);
				$("#addEPBtn").hide();

				createEPList();
			}

		} else {
			dialog("text", "系统提示!", '该用户已经是企业用户！');
		}
	} else {

		dialog("text", "系统提示!", '您好请输入【寄件人姓名】 和【 寄件人手机号/固话】,然后才能添加到企业用户！');

	}
}

function getsenderEP(name, phone) {
	var userphone1 = $.trim($('#smobile').val());
	var reqUrl = "/services/manage/EnterpriseUserGet/" + userphone1 + "?id="
			+ Math.random();
	var args = $.ajax({
		url : reqUrl,
		async : false
	});
	var rs = eval('(' + args.responseText + ')');

	if (rs && rs.result && rs.result.total != "0") {
		return true;
	}

	return false;
}

function enterPriseUserAdd() {
	if ($("#ffep").form('validate')) {
		var username = $.trim($('#sname').val());
		var userphone1 = $.trim($('#smobile').val());
		;
		var companyname = $.trim($("#companyname_ep").val());
		var companyid = $.trim($("#companyid_ep").val());
		var phone1 = $.trim($("#phone1_ep").val());
		var building = $.trim($("#building_ep").val());
		var floor = $.trim($("#floor_ep").val());

		var room = $.trim($("#room_ep").val());

		var postDataUser = "username=" + username + "&phone1=" + userphone1
				+ "&companyid=" + companyid + "&building=" + building
				+ "&floor=" + floor + "&room=" + room;

		// if (!isvalidEP(companyname)) {
		// dialog("text", "系统提示!", '该企业【' + companyname
		// + '】还没有添加到企业,请点击加号添加该企业，谢谢！');
		//
		// return;
		// }

		var ajax = new AjaxHelper();

		ajax.AsyncPost("/services/manage/EnterpriseUserAdd", postDataUser,
				function(args) {
					var result = eval('(' + args + ')');

					if (result.result && result.result.code == 200) {

						dialog("text", "系统提示!", '企业添加成功！谢谢！');

						$('#popupWinEP').window('close');
						hasShowPopupWinEP = false;

					} else if (result.error && result.error.code) {
						var msg = "错误码:[" + result.error.code + "]"
								+ result.error.message + "!";

						dialog("text", "系统提示!", msg);
					} else {
						dialog("text", "系统提示!", '提交失败! 请稍后再试...');
					}

				});
	}
}

function mSift_SeekTp(oObj, nDire) {
	if (oObj.getBoundingClientRect && !document.all) {
		var oDc = document.documentElement;
		switch (nDire) {
		case 0:
			return oObj.getBoundingClientRect().top + oDc.scrollTop;
		case 1:
			return oObj.getBoundingClientRect().right + oDc.scrollLeft;
		case 2:
			return oObj.getBoundingClientRect().bottom + oDc.scrollTop;
		case 3:
			return oObj.getBoundingClientRect().left + oDc.scrollLeft;
		}
	} else {
		if (nDire == 1 || nDire == 3) {
			var nPosition = oObj.offsetLeft;
		} else {
			var nPosition = oObj.offsetTop;
		}
		if (arguments[arguments.length - 1] != 0) {
			if (nDire == 1) {
				nPosition += oObj.offsetWidth;
			} else if (nDire == 2) {
				nPosition += oObj.offsetHeight;
			}
		}
		if (oObj.offsetParent != null) {
			nPosition += mSift_SeekTp(oObj.offsetParent, nDire, 0);
		}
		return nPosition;
	}
}
function mSift(cVarName, nMax) {
	this.oo = cVarName;
	this.Max = nMax;
}
mSift.prototype = {
	Varsion : 'v2010.10.29 by AngusYoung | mrxcool.com',
	Target : Object,
	TgList : Object,
	Listeners : null,
	SelIndex : 0,
	Data : [],
	ReData : [],
	Create : function(oObj) {
		var _this = this;
		var oUL = document.createElement('ul');
		// oUL.style.display='none';
		oObj.parentNode;
		var epnameList = document.getElementById("epnameList");
		epnameList.appendChild(oUL);
		// epnameList.insertBefore(,oObj);
		_this.TgList = oUL;
		oObj.onkeydown = oObj.onclick = function(e) {
			_this.Listen(this, e);
		};
		oObj.onblur = function() {
			setTimeout(function() {
				_this.Clear();
			}, 100);
		};
	},
	Complete : function() {
	},
	Select : function() {
		var _this = this;
		if (_this.ReData.length > 0) {
			_this.Target.value = _this.ReData[_this.SelIndex].replace(/\*/g,
					'*').replace(/\|/g, '|');
			_this.Clear();
			loadEPInfo(_this.Target.value);
			var curname = $.trim($("#companyname_ep").val());

			if (typeof (ep_set_list_all[curname]) == 'undefined'
					&& curname != "") {
				$("#addEPBtn").show();
				EPFormBuildingClear();
			} else {
				$("#addEPBtn").hide();
			}
		}
		setTimeout(function() {
			_this.Target.focus();
		}, 10);
		_this.Complete();
	},
	Listen : function(oObj) {

		var _this = this;
		_this.Target = oObj;
		var e = arguments[arguments.length - 1];
		var ev = window.event || e;
		switch (ev.keyCode) {
		case 9:// TAB
			return;
		case 13:// ENTER
			_this.Target.blur();
			_this.Select();
			return;
		case 38:// UP
			_this.SelIndex = _this.SelIndex > 0 ? _this.SelIndex - 1
					: _this.ReData.length - 1;
			break;
		case 40:// DOWN
			_this.SelIndex = _this.SelIndex < _this.ReData.length - 1 ? _this.SelIndex + 1
					: 0;
			break;
		default:
			_this.SelIndex = 0;
		}
		if (_this.Listeners) {
			clearInterval(_this.Listeners);
		}
		_this.Listeners = setInterval(function() {
			_this.Get();
		}, 10);
	},
	Get : function() {
		var _this = this;
		if (_this.Target.value == '') {
			_this.Clear();
			return;
		}
		if (_this.Listeners) {
			clearInterval(_this.Listeners);
		}
		;
		_this.ReData = [];
		var cResult = '';
		for (var i = 0; i < _this.Data.length; i++) {
			if (_this.Data[i].toLowerCase().indexOf(
					_this.Target.value.toLowerCase()) >= 0) {
				_this.ReData.push(_this.Data[i]);
				if (_this.ReData.length == _this.Max) {
					break;
				}
			}
		}
		var cRegPattern = _this.Target.value.replace(/\*/g, '*');
		cRegPattern = cRegPattern.replace(/\|/g, '|');
		cRegPattern = cRegPattern.replace(/\+/g, '\\+');
		cRegPattern = cRegPattern.replace(/\./g, '\\.');
		cRegPattern = cRegPattern.replace(/\?/g, '\\?');
		cRegPattern = cRegPattern.replace(/\^/g, '\\^');
		cRegPattern = cRegPattern.replace(/\$/g, '\\$');
		cRegPattern = cRegPattern.replace(/\(/g, '\\(');
		cRegPattern = cRegPattern.replace(/\)/g, '\\)');
		cRegPattern = cRegPattern.replace(/\[/g, '\\[');
		cRegPattern = cRegPattern.replace(/\]/g, '\\]');
		cRegPattern = cRegPattern.replace(/\\/g, '\\\\');
		var cRegEx = new RegExp(cRegPattern, 'i');
		for (var i = 0; i < _this.ReData.length; i++) {
			if (_this.Target.value.indexOf('*') >= 0) {
				_this.ReData[i] = _this.ReData[i].replace(/\*/g, '*');
			}
			if (_this.Target.value.indexOf('|') >= 0) {
				_this.ReData[i] = _this.ReData[i].replace(/\|/g, '|');
			}
			cResult += '<li style="padding:0 5px;line-height:20px;cursor:default;" onmouseover="'
					+ _this.oo
					+ '.ChangeOn(this);'
					+ _this.oo
					+ '.SelIndex='
					+ i
					+ ';" onmousedown="'
					+ _this.oo
					+ '.Select();">'
					+ _this.ReData[i]
							.replace(
									cRegEx,
									function(s) {
										return '<span style="background:#ff9;font-weight:bold;font-style:normal;color:#e60;">'
												+ s + '</span>';
									});
			+'</li>';
		}
		if (cResult == '') {
			_this.Clear();
		} else {
			_this.TgList.innerHTML = cResult;
			_this.TgList.style.cssText = 'display:block;position:absolute;background:#fff;border:#090 solid 1px;margin:-1px 0 0;padding: 5px;list-style:none;font-size:12px;';

			_this.TgList.style.width = _this.Target.offsetWidth - 12 + 'px';
		}
		var oLi = _this.TgList.getElementsByTagName('li');
		if (oLi.length > 0) {
			oLi[_this.SelIndex].style.cssText = 'background:#36c;padding:0 5px;line-height:20px;cursor:default;color:#fff;';
		}

		var curname = $.trim($("#companyname_ep").val());

		if (typeof (ep_set_list_all[curname]) == 'undefined' && curname != "") {
			$("#addEPBtn").show();
			EPFormBuildingClear();
		} else {
			$("#addEPBtn").hide();
		}
	},
	ChangeOn : function(oObj) {
		var oLi = this.TgList.getElementsByTagName('li');
		for (var i = 0; i < oLi.length; i++) {
			oLi[i].style.cssText = 'padding:0 5px;line-height:20px;cursor:default;';
		}
		oObj.style.cssText = 'background:#36c;padding:0 5px;line-height:20px;cursor:default;color:#fff;';
	},
	Clear : function() {
		var _this = this;
		if (_this.TgList) {
			_this.TgList.style.display = 'none';
			_this.ReData = [];
			_this.SelIndex = 0;
		}
	}
}

function createEPList() {
	// 建立实例，第一个参数是实例对象的名称，第二个是最多显示的数量
	var oo = new mSift('oo', 20);
	// 数据
	oo.Data = ep_name_list_all;
	// 指定文本框对象建立特效
	// var companyname_ep =
	// $("#icontainer").get(0).contentWindow.document.getElementById('companyname_ep')
	oo.Create(document.getElementById('companyname_ep'))
}

var ep_name_list_all = [];
var ep_set_list_all = {};

function initEPList() {

	ep_name_list_all = [];
	ep_set_list_all = {};

	var reqUrl = "/services/manage/EnterpriseGet/" + $.cookie("ckstation")
			+ "?id=" + Math.random();
	var args = $.ajax({
		url : reqUrl,
		async : false
	});
	var rs = eval('(' + args.responseText + ')');

	var enterprisesSet = rs.result.enterprises;
	if (enterprisesSet && typeof (enterprisesSet) != "undefined") {
		for (var i = 0; i < rs.result.enterprises.length; i++) {
			var name = rs.result.enterprises[i].companyname.toString();
			var companyid = rs.result.enterprises[i].companyid.toString();
			var building = rs.result.enterprises[i].building.toString();
			var floor = rs.result.enterprises[i].floor.toString();
			var room = rs.result.enterprises[i].room.toString();

			ep_name_list_all.push(name);

			var item = {};

			ep_set_list_all[name] = rs.result.enterprises[i];
		}
	}
}

function loadEPInfo(name) {

	var companyid = ep_set_list_all[name].companyid;
	var floor = ep_set_list_all[name].floor;
	var building = ep_set_list_all[name].building;
	var room = ep_set_list_all[name].room;

	$("#companyid_ep").val(companyid);
	$("#building_ep").val(building);
	$("#floor_ep").numberbox('setValue', floor);
	$("#room_ep").numberbox('setValue', room);
}

function EPFormClear() {

	var signVal = "";

	$("#companyid_ep").val(signVal);
	$("#floor_ep").numberbox('setValue', signVal);
	$("#room_ep").numberbox('setValue', signVal);
	$("#building_ep").val(signVal);
	$("#companyname_ep").val(signVal);
}

function EPAddFormClear() {

	var signVal = "";

	$("#floor_epadd").numberbox('setValue', signVal);
	$("#room_epadd").numberbox('setValue', signVal);
	$("#building_epadd").val(signVal);
	$("#comment_epadd").val(signVal);
	$("#phone1_epadd").val(signVal);
}

function EPFormBuildingClear() {

	var signVal = "";

	$("#floor_ep").numberbox('setValue', signVal);
	$("#room_ep").numberbox('setValue', signVal);
	$("#building_ep").val(signVal);
}

function showAddEPWin() {
	name = $.trim($('#sname').val());
	$('#popupWinEPAdd').window('open');
	var companynameadd = $('#companyname_ep').val();
	$('#companyname_epadd').val(companynameadd);
	$('#companyid_epadd').val(codefans_net_CC2PY(companynameadd));
}

function enterPriseAdd() {
	if ($("#ffepadd").form('validate')) {
		var companyname = $.trim($("#companyname_epadd").val());
		var companyid = $.trim($("#companyid_epadd").val());
		var phone1 = $.trim($("#phone1_epadd").val());
		var building = $.trim($("#building_epadd").val());
		var floor = $.trim($("#floor_epadd").val());
		var room = $.trim($("#room_epadd").val());
		var comment = $.trim($("#comment_epadd").val());

		var postData = "companyname=" + companyname + "&companyid=" + companyid
				+ "&phone1=" + phone1 + "&building=" + building + "&floor="
				+ floor + "&room=" + room + "&comment=" + comment;

		var ajax = new AjaxHelper();

		ajax.AsyncPost("/services/manage/EnterpriseAdd", postData, function(
				args) {
			var result = eval('(' + args + ')');

			if (result.result && result.result.code == 200) {
				dialog("text", "系统提示!", '添加企业信息成功！谢谢！');

				$("#addEPBtn").hide();
				var building = $.trim($("#building_epadd").val());
				var floor = $.trim($("#floor_epadd").val());
				var room = $.trim($("#room_epadd").val());
				var companyid = $.trim($("#companyid_epadd").val());

				$("#floor_ep").numberbox('setValue', floor);
				$("#room_ep").numberbox('setValue', room);
				$("#building_ep").val(building);
				$("#companyid_ep").val(companyid);

				EPAddFormClear();

				$('#popupWinEPAdd').window('close');

				initEPList();
				createEPList();

			} else if (result.error && result.error.code) {
				var msg = "错误码:[" + result.error.code + "]"
						+ result.error.message + "!";

				dialog("text", "系统提示!", msg);
			} else {
				dialog("text", "系统提示!", '提交失败! 请稍后再试...');
			}

		});
	} else {
		dialog("text", "系统提示!", "请填写所有必须的信息！");
	}
}

function showExpBg() {
	// var doc = $("#printframe").get(0).contentWindow.document;
	// alert($('.textLayer',doc).css('height'));
}

var pdfIntervalId;

function checkPDFDownloaded() {

	pdfIntervalId = setInterval(
			function() {

				var doccat = $("#popupPrintWin iframe").get(0).contentWindow.document;
				// alert(doccat);

				// $("#popupPrintWin iframe",doccat).size()

				var doc = $("#popupPrintWin iframe", doccat).get(0).contentWindow.document;

				// alert(doc);
				if (doc && $('.textLayer', doc)) {
					// alert('add bg');

					clearInterval(pdfIntervalId);
				}

			}, 3000)

}

function isvalidEP(epname) {
	if (typeof (ep_set_list_all[epname]) == 'undefined') {
		return false;
	}

	return true;
}

function barcodeRegex() {
	var barcode = $.trim($("#barcode").val());
	$("#barcode").val(filterBarcode($("#barcode").val()));

	if (!isEditMode) {

		if (isrepeatbarcode(barcode)) {

			barcoderepeat = barcode;
			$.messager.alert("操作提示", '包裹条码【' + barcoderepeat
					+ '】已经使用，不能重复使用该条码录寄件单!', "warning", function() {
				$("#barcode").val('');
				$("#barcode").focus();

			});

		}
	}
}

function barcodeRegex_create() {
	var barcode = $.trim($("#barcode_create").val());
	$("#barcode_create").val(filterBarcode($("#barcode_create").val()));
	if (isrepeatbarcode(barcode)) {
		$.messager.alert("操作提示", '包裹条码【' + barcode + '】已经使用，不能重复使用该条码录寄件单!',
				"warning", function() {
					$("#barcode_create").val('');
					$("#barcode_create").focus();
				});
	}
}

function isrepeatbarcode(barcode) {
	var pagenumber = 1;
	var pagerows = 1000;

	if (barcode == "") {
		return;
	}

	var dayfrom = '19770101';
	var dayto = '20990101';

	if (barcode == "") {
		barcode = "-999";
	}

	var reqUrl = "/services/manage/getnodepickupscheckrepeat/"
			+ $.cookie("ckstation") + "/" + barcode + "?id=" + Math.random();
	var args = $.ajax({
		url : reqUrl,
		async : false
	});
	var result = eval('(' + args.responseText + ')');
	if (result.result.total > 0) {
		return true;
	}
	return false;
}

function quick_add(obj) {
	if (obj.checked) {
		$(
				"#adv_1,#adv_2,#adv_3,#adv_4,#adv_5,#adv_6,#adv_7,#adv_8,.adv_address")
				.hide();

		$('#amobile').validatebox({
			required : false
		});

		$("#send_cb").attr("disabled", "disabled");
	} else {
		$(
				"#adv_1,#adv_2,#adv_3,#adv_4,#adv_5,#adv_6,#adv_7,#adv_8,.adv_address")
				.show();

		$('#amobile').validatebox({
			required : true
		});

		$("#send_cb").removeAttr("disabled");
	}

}
/**
 * 显示更多查询
 */
function showComplexQueryDiv(flag) {
	if (flag) {
		document.getElementById('complex_query_button').innerHTML = '<a href="#" onclick="showComplexQueryDiv(false)">关闭更多查询</a>';
	} else {
		document.getElementById('complex_query_button').innerHTML = '<a href="#" onclick="showComplexQueryDiv(true)">显示更多查询及导出</a>';
		$('#orderid').val("");
		$("#sel_status").val("accept");
		$("#sel_isfad").val("-999");
		$('#keyword').val("");
	}
	$("#complexquery_div").slideToggle("slow");
}









/**
 * 取消寄件查询
 * @param pageindex
 * @param pagesize
 * @param flag
 */




function getdata_cancel(pageindex, pagesize) {
	// unselectedAll();
	var pagenumber = pageindex;
	var pagerows = pagesize;

	var status = "cancel";
	var expid = $("#sel_express_cancel").val();
	var orderid = $("#orderid_cancel").val();
	var mobile = $("#mobile_cancel").val();
	var keyword = $("#sel_keyword_cancel").val();
	var isfad = $("#sel_isfad_cancel").val();
	var barcode = $.trim($("#sel_barcode_cancel").val());
	var dayfrom = $("#date_from_cancel").val().replace(/\-/g, "");
	var dayto = $("#date_to_cancel").val().replace(/\-/g, "");
	var operator = $.trim($("#soperator_cancel").val());
	if (operator == "") {
		operator = "-999";
	}

	if (status == "") {
		status = "-999";
	}

	if (expid == "") {
		expid = "-999";
	}

	if (orderid == "") {
		orderid = "-999";
	}

	if (mobile == "") {
		mobile = "-999";
	}

	if (keyword == "") {
		keyword = "-999";
	}

	if (isfad == "") {
		isfad = "-999";
	}

	if (barcode == "") {
		barcode = "-999";
	}

	var ajax = new AjaxHelper();
	ajax.OnWaitting = function() {
		$('#dg_cancel').datagrid("loading");
	};

	// getnodepickups($nodeid,$status,$orderid,$expid,$mobile,$keyword,$dayfrom,$dayto,$pagerows,$pagenumber)

	ajax.AsyncGet("/services/manage/getNodeOrders_cancel/" + $.cookie("ckstation")
			+ "/" + status + "/" + orderid + "/" + expid + "/" + mobile + "/"
			+ keyword + "/" + dayfrom + "/" + dayto + "/" + pagerows + "/"
			+ pagenumber + "/" + isfad + "/" + barcode + "/" + operator
			+ "?id=" + Math.random(), function(args) {
		var result = eval('(' + args + ')');
		if (result.result.total == 0) {
			var gdata = {};
			gdata.total = 0;
			gdata.rows = [];
			$('#dg_cancel').datagrid('loadData', gdata);
		} else {
			var resultdata = {};
			resultdata.total = result.result.total;
			resultdata.rows = result.result.orders;
			var fee = Math.round(result.result.amount / 100).toFixed(2);
			$('#dg_cancel').datagrid('loadData', resultdata);
		}
		$('#dg_cancel').datagrid("loaded");
	});
}
function initTime_cancel() {
	// 默认查询时间向前推两天
	var lastweek = getMyDate(1);
	var today = getMyDate(-1);

	// 如果用户用查询过使用用户默认查询时间
	var startDateHis = $.cookie("mgrUserSearchStartDate");
	var endDateHis = $.cookie("mgrUserSearchEndDate");

	if ((startDateHis && endDateHis)
			&& (startDateHis != "" && endDateHis != "")) {
		lastweek = startDateHis;
		today = endDateHis;
	}

	$('#date_from_cancel').val(lastweek);
	$('#date_to_cancel').val(today);
}
function init_cancel() {
	$('#dg_cancel')
			.datagrid(
					{
						pageSize : 5,
						columns : [ [
								{
									field : 'print',
									title : '<img  style="position:relative;top:0px" src="/public/images/manage/allcheckun.jpg" onclick="selectedAll()" id="allcheck" name="allcheck0" /> <span>全选</span>',
									align : 'center',
									formatter : function(value, row, index) {
										var ckHtml;
										if ($.trim(row.orderid) != "") {
											ckHtml = '<input type="checkbox" name="ckresendmsg" id="ck'
													+ row.orderid
													+ '" onclick="checkedStatusChange()"/>';
										} else {
											ckHtml = '寄件总费用：';
										}
										return ckHtml
									}
								},
								{
									field : 'orderid',
									title : '订单号',
									sortable : true,
									formatter : function(value, rec, index) {

										if ($.trim(value) == "") {
											return '';
										}

										return '<a href="javascript:void(0)" title="查看订单详情" style="text-decoration:underline" onclick="showDetails(\''
												+ index
												+ '\',2)">'
												+ value
												+ '</a>';
									}
								},
								// {field:'nodeid',title:'站点ID'},
								{
									field : 'barcode',
									title : '条码',
									hidden : true,
									sortable : false,
									formatter : function(value, rec, index) {

										if ($.trim(value) == "") {
											return '';
										}

										return '<a href="javascript:void(0)" title="查看此单号物流状态" style="text-decoration:underline" onclick="alertmaildetailfororder(\''
												+ value
												+ '\',\''
												+ rec.express.id
												+ '\',\''
												+ rec.orderid
												+ '\')">'
												+ value
												+ '</a>';
									}
								},
								{
									field : 'express',
									title : '物流公司',
									sortable : true,
									formatter : function(value, row, index) {

										if (typeof (value) != 'undefined') {
											return value.name;
										}
										return "";
									}
								},
								// {field:'details',title:'详细说明',sortable:true},
								{
									field : 'sender',
									title : '寄件人姓名',
									sortable : true
								},
								{
									field : 'smobile',
									title : '寄件人电话',
									sortable : true
								},
								{
									field : 'addressee',
									title : '收件人姓名',
									sortable : true
								},
								{
									field : 'amobile',
									title : '收件人联系电话',
									sortable : true
								},
								// {field:'scity',title:'寄件人城市代码',sortable:true},
								// {field:'sdistrict',title:'寄件人区（县）代码',sortable:true},
								{
									field : 'saddress',
									title : '寄件人地址',
									sortable : true,
									formatter : function(value, row, index) {

										if ($.trim(value) == "") {
											return '';
										}

										var fmtVal = (value.length > 10) ? value
												.substr(0, 10)
												+ "..."
												: value;

										var fmtLabel = '<span title="' + value
												+ '">' + fmtVal + '</span>';

										return fmtLabel;

									}
								},
								// {field:'acity',title:'收件人城市代码',sortable:true},
								// {field:'adistrict',title:'收件人区（县）代码',sortable:true},
								{
									field : 'aaddress',
									title : '收件人详细地址',
									sortable : true,
									formatter : function(value, row, index) {

										if ($.trim(value) == "") {
											return '';
										}

										var fmtVal = (value.length > 10) ? value
												.substr(0, 10)
												+ "..."
												: value;

										var fmtLabel = '<span title="' + value
												+ '">' + fmtVal + '</span>';

										return fmtLabel;

									}
								},
								{
									field : 'weight',
									title : '包裹重量',sorter:numberFeeSort,
									sortable : true,
									formatter : function(value, row, index) {

										if ($.trim(value) == "") {
											return '';
										}

										var weightVal = parseFloat(
												parseInt(value) / 1000)
												.toFixed(2).toString();

										return weightVal + " 公斤"

									}
								},
								// {field:'premium',title:'包裹保价',sortable:true},
								// {field:'isfad',title:'是否是到付运费',sortable:true},
								// {field:'cod',title:'代收货款金额',sortable:true},
								{
									field : 'freight',
									title : '运费',
									sortable : true,
									formatter : function(value, row, index) {

										if ($.trim(value) == "") {
											return '';
										}

										var freightVal = parseFloat(
												parseInt(value) / 100).toFixed(
												2).toString();

										return freightVal + " 元"

									}
								},
								{
									field : 'remark',
									title : '说明',
									sortable : true,
									formatter : function(value, row, index) {

										if ($.trim(value) == "") {
											return '';
										}

										var fmtVal = (value.length > 10) ? value
												.substr(0, 10)
												+ "..."
												: value;

										var fmtLabel = '<span title="' + value
												+ '">' + fmtVal + '</span>';

										return fmtLabel;
									}
								},
								{
									field : 'eventtime',
									title : '最后状态更新时间',
									sortable : true
								},
								{
									field : 'createtime',
									title : '寄件单创建时间',
									sortable : true
								},
								{
									field : 'operator',
									title : '操作人员',
									sortable : true,
									formatter : function(value, rec) {
										if (typeof (value) == "undefined")
											return "";
										if (value.name == "system")
										{
											return "系统自动处理";
										}else if(value.name == "user.self")
										{
										    value.name = "用户";
											value.id = "用户";
										}
										return value.name + "(" + value.id
												+ ")";
									}
								} ] ]
					});
	// initEPList();
	var p2 = $('#dg_cancel').datagrid('getPager');

	$(p2).pagination({
		pageList : [ 5,10,20, 50, 100, 300 ],// 可以设置每页记录条数的列表
		beforePageText : '第',// 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示 {from} - {to} 条记录   共 {total} 条记录',
		onSelectPage : function(pPageIndex, pPageSize) {
			$("#dg_cancel").datagrid("options").pageSize = pPageSize;
			$("#dg_cancel").datagrid("options").pageIndex = pPageIndex;
			getdata_cancel(pPageIndex, pPageSize);
		}
	});
	initTime_cancel();
	initExpresses_cancel();
	getstationoperators_cancel();
	$("#dg_cancel").datagrid("options").pageIndex = 1;
	new DatePicker('d3', {
		inputId : 'date_from_cancel',
		className : 'date-picker-wp',
		customclick : function() {
			$("#dg_cancel").datagrid("options").pageIndex = 1;
			$(".pagination-num").val("1");
			var gdata = {};
			gdata.total = 0;
			gdata.rows = [];
			$('#dg_cancel').datagrid('loadData', gdata);
			Search_click_cancel();
		},
		seprator : '-'
	});
	new DatePicker('d4', {
		inputId : 'date_to_cancel',
		className : 'date-picker-wp',
		customclick : function() {
			$("#dg_cancel").datagrid("options").pageIndex = 1;
			$(".pagination-num").val("1");
			var gdata = {};
			gdata.total = 0;
			gdata.rows = [];
			$('#dg_cancel').datagrid('loadData', gdata);
			Search_click_cancel();
		},
		seprator : '-'
	});
	if (self.name == "popupCounts") {
		var today = getMyDate(-1);

		$("#date_from_cancel").val(today);
		$("#date_to_cancel").val(today);
	}

	getdata_cancel($("#dg_cancel").datagrid("options").pageIndex, $("#dg_cancel")
			.datagrid("options").pageSize);
}
function initExpresses_cancel() {
	var ajax = new AjaxHelper();
	ajax.OnWaitting = function() {
	};
	ajax.AsyncGet("/services/manage/getnodeexpress/" + $.cookie("ckstation")
			+ "?id=" + Math.random(), function(args) {

		var rs = eval('(' + args + ')');

		var expressSet = rs.result.expresses;

		if (expressSet && typeof (expressSet) != "undefined") {
			for (var i = 0; i < rs.result.expresses.length; i++) {
				$("#sel_express_cancel").append(
						"<option value='" + rs.result.expresses[i].id + "'>"
								+ rs.result.expresses[i].name + "</option>");
			}
			$("#sel_express_cancel").attr("disabled", false);
		} else {
			$("#sel_express_cancel").append("<option value='-999'>全部</option>");
			$("#sel_express_cancel").attr("disabled", true);
		}
	});
}
function getstationoperators_cancel()
{
   	var ckstation = $.cookie("ckstation");
	var password = "-999";
	var userid = "-999";
	var username = "-999";
	var type = "-999";
	var phone = "-999";
	var ajax = new AjaxHelper();
	ajax.AsyncGet("/services/manage/getnodestaff/"+ckstation+"/"+userid+"/"+password+"/"+username+"/"+type+"/"+phone+"?id="+Math.random(),function (args) {
		var result =  eval('('+args+')');
		var data = result.result.staff;
			for(var i=0;i<data.length;i++)
		{
			$("#soperator_cancel").append("<option value='"+data[i].userid+"'>"+data[i].username+"(" + data[i].userid + ")</option>");
		}
	 });
}
function Search_click_cancel()
{
	getdata_cancel($("#dg_cancel").datagrid("options").pageIndex, $("#dg_cancel")
			.datagrid("options").pageSize);
	}
function export_click_cancel()
{
	var status = $("#sel_status_cancel").val();
	// var status = $("#sel_status_expt").val();
	var expid = $("#sel_express_cancel").val();
	var orderid = $("#orderid_cancel").val();
	var mobile = $("#mobile_cancel").val();
	;
	var keyword = $("#sel_keyword_cancel").val();
	;

	var dayfrom = $("#date_from_cancel").val().replace(/\-/g, "");
	var dayto = $("#date_to_cancel").val().replace(/\-/g, "");

	if (status == "") {
		status = "-999";
	}

	if (expid == "") {
		expid = "-999";
	}

	if (orderid == "") {
		orderid = "-999";
	}

	if (mobile == "") {
		mobile = "-999";
	}

	if (keyword == "") {
		keyword = "-999";
	}

	var url = "/services/manage/getcatchgoodsEPT/" + $.cookie("ckstation")
			+ "/" + status + "/" + orderid + "/" + expid + "/" + mobile + "/"
			+ keyword + "/" + dayfrom + "/" + dayto + "/5000/1";
	window.open(url, '_blank', '');
	}
/**
 * 弹出提示框，输入站长密码，修改寄件信息
 */
function Open_Dialog_sendManage() {
	var ckstation = $.cookie("ckstation");
	var password = "-999";
	var userid = "-999";
	var username = "-999";
	var type = "-999";
	var phone = "-999";
	var ajax = new AjaxHelper();
	ajax
			.AsyncGet(
					"/services/manage/getnodestaff/" + ckstation + "/" + userid
							+ "/" + password + "/" + username + "/" + type
							+ "/" + phone + "?id=" + Math.random(),
					function(args) {
						var result = eval('(' + args + ')');
						var data = result.result.staff;
						var username = "--";
						for (var i = 0; i < data.length; i++) {
							if (data[i].type == "0") {
								username = data[i].userid;
							}
						}
						$('#webmaster_username').html(
								'当前站长' + username + '登录密码：');
						$('#txtPass').val('');
						$('#dialog_userPass').show();
						$('#dialog_userPass')
								.dialog(
										{
											collapsible : true,
											toolbar : [ {
												text : '<span STYLE="color: red">修改数据需要验证当前站点站长登录密码,同时将操作员记录在案以便追责</span>'
											} ],
											buttons : [
													{
														text : '提交',
														iconCls : 'icon-ok',
														handler : function() {
															ajax
																	.AsyncGet(
																			"/services/manage/updateGoods_rol/"
																					+ encodeURIComponent(username)
																					+ "/"
																					+ $(
																							'#txtPass')
																							.val()
																					+ "/?id="
																					+ Math
																							.random(),
																			function(
																					args) {
																				var result = eval('('
																						+ args
																						+ ')');
																				if (result.code == "200") {
																					var panel = $('#catchgoodpanel');
																					$('#catchgoodpanel').window('open');
																					panel.show();
																					$('#dialog_userPass')
																					.window(
																							'close');
																				} else if (result.code == "201") {
																					dialog(
																							"text",
																							"系统提示!",
																							'密码错误！');
																				} else {
																					dialog(
																							"text",
																							"系统提示!",
																							'系统异常');
																				}
																			});
														}
													},
													{
														text : '取消',
														handler : function() {
															$('#dialog_userPass')
																	.window(
																			'close');
															$('#txtPass').val('');
														}
													} ]
										});

					});

}

var _detail_index = 0;
var _detail_status = 0;

function opendetails(index,status)
{
	_detail_index = index;
	_detail_status = status;

	$("#satifilter2").val("快捷时间");
	$('.selectItemhidden2 input[type="checkbox"]').removeAttr("checked");

	init_details();	
	$('#popupBillsDetails').window('open');
	$('#date_from_d').val("2015-08-01");

	getdetailsdata(1, $("#dgpkgs").datagrid("options").pageSize);

}

function getdetailsdata(pageindex, pagesize) {
	
	var pagenumber = pageindex;
	var pagerows = pagesize;

	var raws = $('#dg').datagrid('getData').rows;

	var selectrow = raws[_detail_index];
	var   expid  = selectrow.id;
	var   dayfrom = $("#date_from_d").val().replace("-","","g").replace("-","","g");
	var   dayto = $("#date_to_d").val().replace("-","","g").replace("-","","g");

	var ajax = new AjaxHelper();
	//($nodeid, $status, $expid, $dayfrom, $dayto, $pagerows, $pagenumber)

	ajax.AsyncGet("/services/manage/getexpbills/" + $.cookie("ckstation") + "/" + _detail_status+ "/" + expid +  "/" + dayfrom + "/" + dayto + "/" + pagerows+ "/" + pagenumber+ "/" + "?id=" + Math.random(), function(args) {
		
	
		var result = eval('(' + args + ')');
		//return alert(args );
		if (result.result.expbills.length == 0) {

			var gdata = {};
			gdata.total = 0;
			gdata.rows = [];

			$('#dgpkgs').datagrid('loadData', gdata);
		} else {
			var resultdata = {};
			resultdata.rows = result.result.expbills;
			resultdata.total = result.result.total;
		

			$('#dgpkgs').datagrid('loadData', resultdata);
		}

		$('#dgpkgs').datagrid("loaded");

	});
}	

function Search_click_d()
{
	var gdata = {};
	gdata.total = 0;
	gdata.rows = [];

	$('#dgpkgs').datagrid('loadData', gdata);

	getdetailsdata(1, $("#dgpkgs").datagrid("options").pageSize);
}

function init_details()
{
	switch(_detail_status)
	{
		case "0":{ lbl_time="生成时间"} break;
		case "1":{ lbl_time="使用时间"} break;
		case "2":{ lbl_time="作废时间"} break;
	}
	$('#dgpkgs')
			.datagrid(
					{



 
						pageSize : 5,

						columns : [ [
								
								{
									field : 'name',
									title : '快递公司',
									sortable : true,
									width:180,
									formatter : function(value, rec, index) {

										
										return "<span style='font-size:13px'>" +rec.express.name+"</span>";
									}
								},
								{
									field : 'barcode',
									title : '面单号',
									sortable : true,width:150,
									formatter : function(value, rec, index) {

										return value;									}
								},
								{
									field : 'updatetime',
									title : lbl_time,
									width:150,
									sortable : true,
									formatter : function(value, rec, index) {
										return value;
									}
								},
{
									field : 'status',
									title : '使用状态',
									width:150,
									sortable : true,
									formatter : function(value, rec, index) {

		switch(value)
		{ 
			case "0":value = "未使用" ;break;
			case "1":value = "已使用" ;break;
			case "2":value = "已作废" ;break;
		}				
										return value;
									}
								}
] ]
					});

	var p = $('#dgpkgs').datagrid('getPager');

	$(p).pagination({

		pageList : [ 5,10,20, 50, 100, 300 ],// 可以设置每页记录条数的列表
		beforePageText : '第',// 页数文本框前显示的汉字
		afterPageText : '页    共 {pages} 页',
		displayMsg : '当前显示 {from} - {to} 条记录   共 {total} 条记录',
		onSelectPage : function(pPageIndex, pPageSize) {

			$("#dgpkgs").datagrid("options").pageSize = pPageSize;
			$("#dgpkgs").datagrid("options").pageIndex = pPageIndex;

			getdetailsdata(pPageIndex, pPageSize);
		}
	});
	initTime_details();

	$("#dgpkgs").datagrid("options").pageIndex = 1;

	new DatePicker('d1d', {
		inputId : 'date_from_d',
		className : 'date-picker-wp',
		customclick : function() {
			$("#dgpkgs").datagrid("options").pageIndex = 1;			
			var gdata = {};			
			gdata.total = 0;
			gdata.rows = [];
			$('#dgpkgs').datagrid('loadData', gdata);
			Search_click_d();
		},
		seprator : '-'
	});
	new DatePicker('d2d', {
		inputId : 'date_to_d',
		className : 'date-picker-wp',
		customclick : function() {
			$("#dgpkgs").datagrid("options").pageIndex = 1;
			var gdata = {};

			gdata.total = 0;
			gdata.rows = [];
			$('#dgpkgs').datagrid('loadData', gdata);
			Search_click_d();
		},
		seprator : '-'
	});

	

}

function initTime_details() {
	// 默认查询时间向前推两天
	var lastweek = getMyDate(1);
	var today = getMyDate(-1);

        	//如果用户用查询过使用用户默认查询时间
        	var startDateHis = $.cookie("mgrUserSearchStartDate");
        	var endDateHis = $.cookie("mgrUserSearchEndDate");

        	if ((startDateHis && endDateHis)
        		&& (startDateHis != "" && endDateHis != ""))
        	{
        		lastweek = startDateHis;
        		today = endDateHis;
        	}

	$('#date_from_d').val("2015-08-01");
	$('#date_to_d').val(today);
}





function addquickfilterd()
{
	var filterstring =  '<span class="filter-custom" style="display: inline-block;">' +
		'<input value="快捷时间"  name="satifilter" id="satifilter2" style="margin-left:3px;" type="button">' +
	'<div style="display: none;" id="selectItem" class="selectItemhidden2">' + 
		'<div id="selectItemAd" class="selectItemtit bgc_ccc">' + 
			'<h2 id="selectItemTitle" class="selectItemleft">快捷时间</h2>' + 
			'<div id="selectItemClose" class="selectItemright"><<</div>' +
		'</div> ' +
		'<div id="selectItemCount" class="selectItemcont"> ' +
			'<div id="selectSub"> ' +
				'<input name="cr01" id="cr01" value="1" title="当天"  type="checkbox"><label>当天</label>' +
				'<input name="cr02" id="cr02" value="3" title="最近三天"  type="checkbox"><label>最近三天</label>' +
				'<input name="cr09" id="cr09" value="30" title="当月至今"  type="checkbox"><label>当月至今</label>' +
			'</div> ' +
		'</div> ' +
	'</div> ' +
'</span>';
	
	var filterstring_s =  '<span class="filter-custom" style="display: inline-block;">' +
	'<input value="快捷时间"  name="satifilter_s" id="satifilter_s" type="button">' +
'<div style="display: none;" id="selectItem_s" class="selectItemhidden">' + 
	'<div id="selectItemAd" class="selectItemtit bgc_ccc">' + 
		'<h2 id="selectItemTitle" class="selectItemleft">快捷时间</h2>' + 
		'<div id="selectItemClose" class="selectItemright"><<</div>' +
	'</div> ' +
	'<div id="selectItemCount" class="selectItemcont"> ' +
		'<div id="selectSub"> ' +
			'<input name="cr01" id="cr01" value="1" title="当天"  type="checkbox"><label>当天</label>' +
			'<input name="cr02" id="cr02" value="3" title="最近三天"  type="checkbox"><label>最近三天</label>' +
			'<input name="cr09" id="cr09" value="30" title="当月至今"  type="checkbox"><label>当月至今</label>' +
		'</div> ' +
	'</div> ' +
'</div> ' +
'</span>';
	
	
	$("#date_to_d").after($(filterstring));
	
	if ($("#date_to_s").size() > 0)
	{
		$("#date_to_s").after($(filterstring_s));
		
		$("#satifilter_s").selectFilters_s("#selectItem_s",function(s){
			 
			cus_day_clickd(s,'#date_from_s','#date_to_s');
			
	    });
	}
	
	$("#selectSub label").click(function(){$(this).prev().click()})
	$("#satifilter2").selectFilters("#selectItem",function(s){
	 
		cus_day_clickd(s,'#date_from_d','#date_to_d');		
    });

	$("#satifilter2").bind("click",function(){
		$(this).next().css("top","30px").css("left","300px");
	});
	
	
	
}

function cus_day_clickd(date,datef,datet)
{
	
	var today = getMyDate(-1);
	var end = getMyDate(-1);
	var d= new Date();
	var maxdays = new Date(d.getFullYear(), d.getMonth()+1,0).getDate();
		switch(date)
	    {
			case '1' :{
							
						};break;
			case '3' :{
				today = getMyDate(-1+2);
						};break;
			case '30' :{
				
			  		 var dayFromDate = new Date(today);
			  		 var selectionDate = new DateUltiStd(dayFromDate);
			  	 
			  	 end = today;
			  	 today = selectionDate.getMonthStartDate();
				
						};break;
	    }
		
		if (datef&&datet)
		{
			$(datef).val(today);
			$(datet).val(end);
		}
		else
		{
			$("#date_from").val(today);
			$("#date_to").val(end);
		}
		
	   	Search_click_d();
}

  var staffset = {};
	   function initstaffnameset()
	   {	   
	 
			var reqUrl = "/services/manage/getnodestaff/"  + $.cookie("ckstation") + "/-999/-999/-999/-999/-999?id="+Math.random();
			var args = $.ajax({url:reqUrl,async:false});
			var result =  eval('('+args.responseText+')');    	
			var data = result.result.staff;
				
			for(var i= 0 ; i < data.length;i++)
			{
				 staffset[data[i].userid] = data[i].username;
			}
		}
		
function showpkgdetails()
{

	var height = 530;	

	if ($("#usertaskspan").is(':visible') )
	{
		$("#lnk_pan").html("查看详细");
		$("#usertaskspan").hide();
	
		$("#c_out_pan").hide();

		$("#c_house_pan").hide();

		$("#c_ow_pan").hide();

		$("#c_ts_pan").hide();

		$("#c_wait_pan").hide();

		height = 343;

	}
	else
	{

		$("#lnk_pan").html("关闭详细");
		$("#usertaskspan").show();
	
		if(parseInt($("#c_out_pan span").html()) != 0)
		{$("#c_out_pan").show();}

		if(parseInt($("#c_house_pan span").html()) != 0)
		{$("#c_house_pan").show();}

		if(parseInt($("#c_ow_pan span").html()) != 0)
		{$("#c_ow_pan").show();}

		if(parseInt($("#c_ts_pan span").html()) != 0)
		{$("#c_ts_pan").show();}
	
		if(parseInt($("#c_wait_pan span").html()) != 0)
		{$("#c_wait_pan").show();}
	}

	$("#comfirmDetails").window({height:height });
	$("#comfirmDetails").window("open");
}

  		 var isopenscanflag;
  	  	 function isopenscan()
	   	{	
			var reqUrl = "/services/manage/getnodetaskpoolconfig/"+$.cookie("ckstation")+"?id="+Math.random();
			var args = $.ajax({url:reqUrl,async:false});
			var result =  eval('('+args.responseText+')');    	
			var data = result.result;

	    	if (data.code == 200 && data.config.enablepasswordelivery == 0 && data.config.enablescandelivery == 0)
	        {		
			isopenscanflag = false;			
	        }
	        else if(data.code == 200 && data.config.enablepasswordelivery == 1 && data.config.enablescandelivery == 1)
	        {
			isopenscanflag = true;	
	        }
 		else
		{
			isopenscanflag = -1;
		}
				
		}

		var withdraw_deay_num = 0;
		var withdraw_deay = 0;
		var withdraw_auto = 0;

		function initgetnewsendnode()
		{			

			setInterval(function(){

	
			var reqUrl = "/services/manage/getwithdrawmsgdelay/?id="+Math.random();
			var args = $.ajax({url:reqUrl,async:false});
			withdraw_deay_cfg =  args.responseText;    

			},30000)

			setdelaycfg();

			getnewsenddata();

			setInterval(function(){
	      		            	 			
	      		          getnewsenddata()
	      		            	 			
	      		            	 		
	      		},parseInt(withdraw_deay_num) * 1000);




		}

		function setdelaycfg()
		{
			try{
			withdraw_deay  = withdraw_deay_cfg.split("_")[0];
			withdraw_auto = withdraw_deay_cfg.split("_")[1];		
			withdraw_deay_num = withdraw_deay_cfg.split("_")[2];

			}
			catch(e)
			{
				withdraw_deay  = "30";
				withdraw_auto ="0";		
				withdraw_deay_num =  "30";

			}

if (withdraw_auto == "1")
{
	withdraw_auto_local = true;
}
else
{
	withdraw_auto_local = false;
}
		
		}

		function getnewsenddata()
		{				
			setdelaycfg();

			if(withdraw_auto == "1") {

			var reqUrl = "/services/manage/getnewdeliverytasknum/"+$.cookie("ckstation");
			var args = $.ajax({url:reqUrl,async:false});
			var rs=  eval('('+args.responseText+')'); 

   			if(rs.result.tasknumber > 0)
    			{
    				top.mp3('/public/asset/mp3/qujian.mp3','1');    	
			}			
			
			}
		}

