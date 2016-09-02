<?php
include("http://app.jnzx.gov.cn/app/wall/weixin/wechat.php");

$host="localhost";
$db_user="admin";
$db_pass="admin";
$db_name="baodao_test";
$timezone="Asia/Shanghai";
$link=mysql_connect($host,$db_user,$db_pass);
if (!$link) {
    die('Could not connect: ' . mysql_error());
}
mysql_select_db($db_name,$link);
mysql_query("SET names UTF8");



function JSON_TZGG()
{
	$d = date("Y年m月d日");
	$json = preg_replace('/((\s)*(\n)+(\s)*)/i','',file_get_contents("http://www.jnzx.gov.cn/weixin_cjson_tzgg.aspx"));
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);
	
  $content[] = array("Title" =>" 近期通知公告", "Description" =>"", "PicUrl" =>"http://app.jnzx.gov.cn/app/indexlogo.jpg", "Url" =>$json[$i]['url']);
	$count_json = count($json);
	for ($i = 0; $i <= $count_json-1; $i++)
	{
		if (strlen($json[$i]['img'])<=23){
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>"", "Url" =>$json[$i]['url']);
		}
		else{
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>$json[$i]['img'], "Url" =>$json[$i]['url']);
		}
		
	}	
	//$content[] = array("Title" =>"【查看更多】", "Description" =>"", "PicUrl" =>"", "Url" =>"http://app.jnzx.gov.cn/app/list.php?classid=56");
  return $content;
}
function JSON_GZDT()
{
	$d = date("Y年m月d日");

	$json = preg_replace('/((\s)*(\n)+(\s)*)/i','',file_get_contents("http://www.jnzx.gov.cn/weixin_cjson_gzdt.aspx"));
	$json = preg_replace('/<\/?[^>]+>/i','',$json);
	$json = preg_replace('/\s+/','',$json);
	$json = str_replace("　","",$json);
	$json = str_replace("&nbsp;","",$json);
	$json = str_replace(array("/r/n", "/r", "/n"), "", $json);
	$json = preg_replace('/\n/','',$json);
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);	
	
	
  $content[] = array("Title" =>" 近期工作动态", "Description" =>"", "PicUrl" =>"http://app.jnzx.gov.cn/app/indexlogo.jpg", "Url" =>$json[$i]['url']);
	$count_json = count($json);
	for ($i = 0; $i <= $count_json-1; $i++)
	{
		if (strlen($json[$i]['img'])<=23){
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>"", "Url" =>$json[$i]['url']);
		}
		else{
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>$json[$i]['img'], "Url" =>$json[$i]['url']);
		}
	}	
	$content[] = array("Title" =>"【查看更多】", "Description" =>"", "PicUrl" =>"", "Url" =>"http://app.jnzx.gov.cn/app/list.php?classid=31");
  return $content;
}
function JSON_JGJS()
{
	$d = date("Y年m月d日");
	$json = preg_replace('/((\s)*(\n)+(\s)*)/i','',file_get_contents("http://www.jnzx.gov.cn/weixin_cjson_jgjs.aspx"));
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);
	
  //$content[] = array("Title" =>"　　　     　图片新闻", "Description" =>"", "PicUrl" =>"http://www.6xiu.com/d/file/vector/uploadphotos/vector/tubiao/j09/big/0858_illusticon204672.jpg", "Url" =>$json[$i]['url']);
  
	for ($i = 0; $i <= 0; $i++)
	{
		if (strlen($json[$i]['img'])<=23){
			$content[] = array("Title" =>$json[$i]['title'], "Description" =>"", "PicUrl" =>"", "Url" =>$json[$i]['url']);
		}
		else{
			$content[] = array("Title" =>$json[$i]['title'], "Description" =>"", "PicUrl" =>$json[$i]['img'], "Url" =>$json[$i]['url']);
		}
	}	  
  
	$count_json = count($json);
	for ($i = 1; $i <= $count_json-1; $i++)
	{
		if (strlen($json[$i]['img'])<=23){
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>"", "Url" =>$json[$i]['url']);
		}
		else{
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>$json[$i]['img'], "Url" =>$json[$i]['url']);
		}
	}	
	//$content[] = array("Title" =>"【查看更多】", "Description" =>"", "PicUrl" =>"", "Url" =>"http://www.jnzx.gov.cn/list_f.aspx?classid=16");
  return $content;
}
function JSON_GZTX()
{
	$json = preg_replace('/((\s)*(\n)+(\s)*)/i','',file_get_contents("http://www.jnzx.gov.cn/weixin_cjson_gztx.aspx"));
	$json = preg_replace('/<\/?[^>]+>/i','',$json);
	$json = preg_replace('/\s+/','',$json);
	$json = str_replace("　","",$json);
	$json = str_replace("&nbsp;","",$json);
	$json = str_replace(array("/r/n", "/r", "/n"), "", $json);
	$json = preg_replace('/\n/','',$json);
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);
	
  $content[] = array("Title" =>"　图片新闻", "Description" =>"", "PicUrl" =>"http://www.6xiu.com/d/file/vector/uploadphotos/vector/tubiao/j09/big/0858_illusticon204672.jpg", "Url" =>$json[$i]['url']);
  
	for ($i = 0; $i <= 0; $i++)
	{
		if (strlen($json[$i]['img'])<=23){
			$content[] = array("Title" =>$json[$i]['title'], "Description" =>"", "PicUrl" =>"", "Url" =>$json[$i]['url']);
		}
		else{
			$content[] = array("Title" =>$json[$i]['title'], "Description" =>"", "PicUrl" =>$json[$i]['img'], "Url" =>$json[$i]['url']);
		}
	}	  
  
	$count_json = count($json);
	for ($i = 1; $i <= $count_json-1; $i++)
	{
		if (strlen($json[$i]['img'])<=23){
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>"", "Url" =>$json[$i]['url']);
		}
		else{
			$content[] = array("Title" =>"【 ".date('Y-m-d', strtotime($json[$i]['date']))." 】".$json[$i]['title'], "Description" =>"", "PicUrl" =>$json[$i]['img'], "Url" =>$json[$i]['url']);
		}
	}	
	//$content[] = array("Title" =>"　【查看更多】", "Description" =>"", "PicUrl" =>"", "Url" =>"http://www.jnzx.gov.cn/list_f.aspx?classid=16");
  return $content;
}

function JSON_ZCCX($zc)
{

	$json = preg_replace('/((\s)*(\n)+(\s)*)/i','',file_get_contents("http://app.jnzx.gov.cn/app/zccx/connect.php?kw=".$zc));	
	$json = preg_replace('/<\/?[^>]+>/i','',$json);
	$json = preg_replace('/\s+/','',$json);
	$json = str_replace("　","",$json);
	$json = str_replace("&nbsp;","",$json);
	$json = str_replace(array("/r/n", "/r", "/n"), "", $json);
	$json = preg_replace('/\n/','',$json);
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);	
	switch ($json[0]['zq'])
	{
		/*政协 舜耕会堂*/
		case "中前区":$x = 1;	break;
		case "左前区":$x = 2;	break;  
		case "右前区":$x = 3;	break;  
		case "中一区":$x = 4;	break;  
		case "中二区":$x = 5;	break;  
		case "中三区":$x = 6;	break;  
		case "中四区":$x = 7;	break;  
		case "中五区":$x = 8;	break;  
		case "左后区":$x = 9;	break;  
		case "右后区":$x = 10;break;
		/* 人大 山东会堂*/
		case "后中区左侧":$x = 11;break;
		case "后中区右侧":$x = 12;break;
		case "后左区":$x = 13;break;  
		case "后右区":$x = 14;break;  
		
		default:
	}
	/*数据表 zcfind_info*/
	/*正式座次调用代码 start*/
	
	$t = $json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'];

	if($zc == "周夏青"){
		$out = "第4组、第17组周夏青委员：您好！请点击下面图片详细查看各自的座次。";
		$zc_img = "http://app.jnzx.gov.cn/app/images/dcode/100.png";
	}elseif($zc == "刘军"){
		$out = "第5组、第18组刘军委员：您好！请点击下面图片详细查看各自的座次。";
		$zc_img = "http://app.jnzx.gov.cn/app/images/dcode/100.png";
	}else{
		$out = $t;
		$zc_img = "http://app.jnzx.gov.cn/app/images/dcode/".$x.".png";
	} 	
	
	if($json[0]['zq'] != "主席台"){
		$content[] = array("Title" =>$out, "Description" =>"注：点击上面图片，可精准定位座次。座次若有临时变动，以现场发放的座区图为准。", "PicUrl" =>$zc_img, "Url" =>"http://app.jnzx.gov.cn/app/content_zc.php?kw=".$zc);
		//人大$content[] = array("Title" =>$json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'], "Description" =>"注：请按图示顺序入场，谢谢您的配合与支持！", "PicUrl" =>"http://app.jnzx.gov.cn/app/images/lxzc.png", "Url" =>"http://app.jnzx.gov.cn/app/content_zc.php?kw=".$zc);
	}elseif($json[0]['zq'] == "主席台"){
		$content[] = array("Title" =>$json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'], "Description" =>"注：座次若有临时变动，以现场发放的座区图为准。", "PicUrl" =>"http://app.jnzx.gov.cn/app/zxtzc5.png", "Url" =>"http://app.jnzx.gov.cn/app/content_zc.php?kw=".$zc);	
	
	/*
	}elseif($json[0]['ph'] == ""){
		$content[] = array("Title" =>$json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'], "Description" =>"欢迎您继续使用微信查座次功能！", "PicUrl" =>"http://app.jnzx.gov.cn/app/zxtzc.png", "Url" =>"http://app.jnzx.gov.cn/app/content_zc.php?kw=".$zc);	
	*/
	}
	/*正式座次调用代码 end*/
	
	//临时测试代码
	//$content[] = array("Title" =>"今后市政协常委会、全体会议期间将开放座次查询功能，欢迎使用！", "Description" =>"注：台下座次若有临时变动，以现场发放的座区图为准。", "PicUrl" =>"", "Url" =>"");
	//$content = $json[0]['smscontent'];
	
	/*座次查询关闭期间提示*/
	//$content = "市政协常委会、全体会议期间将开放座次查询功能，欢迎关注使用！（市政协办公厅）";
	
  return $content;
}
function JSON_ZCCX_SCAN($zc)
{

	$json = preg_replace('/((\s)*(\n)+(\s)*)/i','',file_get_contents("http://app.jnzx.gov.cn/app/zccx/connect_scan.php?kw=".$zc));	
	$json = preg_replace('/<\/?[^>]+>/i','',$json);
	$json = preg_replace('/\s+/','',$json);
	$json = str_replace("　","",$json);
	$json = str_replace("&nbsp;","",$json);
	$json = str_replace(array("/r/n", "/r", "/n"), "", $json);
	$json = preg_replace('/\n/','',$json);
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);	
	switch ($json[0]['zq'])
	{
		/*政协 舜耕会堂*/
		case "中前区":$x = 1;	break;
		case "左前区":$x = 2;	break;  
		case "右前区":$x = 3;	break;  
		case "中一区":$x = 4;	break;  
		case "中二区":$x = 5;	break;  
		case "中三区":$x = 6;	break;  
		case "中四区":$x = 7;	break;  
		case "中五区":$x = 8;	break;  
		case "左后区":$x = 9;	break;  
		case "右后区":$x = 10;break;
		/* 人大 山东会堂*/
		case "后中区左侧":$x = 11;break;
		case "后中区右侧":$x = 12;break;
		case "后左区":$x = 13;break;  
		case "后右区":$x = 14;break;  
		default:
	}
	/*数据表 zcfind_info*/
	/*正式座次调用代码 start*/
	if($json[0]['zq'] != "主席台"){
		$content[] = array("Title" =>$json[0]['name'].$json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'], "Description" =>"注：点击上面图片，可精准定位座次。座次若有临时变动，以现场发放的座区图为准。", "PicUrl" =>"http://app.jnzx.gov.cn/app/images/dcode/".$x.".png", "Url" =>"http://app.jnzx.gov.cn/app/content_zc_scan.php?kw=".$zc);
		//人大$content[] = array("Title" =>$json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'], "Description" =>"注：请按图示顺序入场，谢谢您的支持与配合！", "PicUrl" =>"http://app.jnzx.gov.cn/app/images/lxzc.png", "Url" =>"http://app.jnzx.gov.cn/app/content_zc_scan.php?kw=".$zc);
	}elseif($json[0]['zq'] == "主席台"){
		$content[] = array("Title" =>$json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'], "Description" =>"注：座次若有临时变动，以现场发放的座区图为准。", "PicUrl" =>"http://app.jnzx.gov.cn/app/zxtzc5.png", "Url" =>"http://app.jnzx.gov.cn/app/content_zc_scan.php?kw=".$zc);	
	
	/*
	}elseif($json[0]['zq'] == "（大会秘书处）"){
		$content[] = array("Title" =>$json[0]['name'].$json[0]['smscontent'].$json[0]['zq'].$json[0]['ph'].$json[0]['zw'].$json[0]['tqsj'], "Description" =>"欢迎您继续使用微信查座次功能！", "PicUrl" =>"http://app.jnzx.gov.cn/app/zxtzc.png", "Url" =>"http://app.jnzx.gov.cn/app/content_zc_scan.php?kw=".$zc);	
	*/
	}
	/*正式座次调用代码 end*/
	
	//临时测试代码
	//$content[] = array("Title" =>"今后市政协常委会、全体会议期间将开放座次查询功能，欢迎使用！", "Description" =>"注：台下座次若有临时变动，以现场发放的座区图为准。", "PicUrl" =>"", "Url" =>"");
	//$content = $json[0]['smscontent'];
	
	/*座次查询关闭期间提示*/
	//$content = "市政协常委会、全体会议期间将开放座次查询功能，欢迎关注使用！（市政协办公厅）";
	
  return $content;
}

function JSON_WXSQ($sq,$openid)
{
	$query=mysql_query("select access_token from weixin_access_token where id = 1");
	$row=mysql_fetch_array($query);
	$access_token = $row['access_token'];
	$json = file_get_contents("http://app.jnzx.gov.cn/app/weixin_openid.php?access_token=".$access_token."&openid=".$openid);
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);		
	$picurl = $json[0]['headimgurl'];
	$nickname = $json[0]['nickname'];
	$content = $sq;
	date_default_timezone_set('PRC');	//时区设定
	$query=mysql_query("INSERT INTO weixin_wxsq (picurl, nickname,content,status,date,openid) VALUES ('$picurl','$nickname','$content','1','".date('Y-m-d H:i:s')."','$openid')");
	mysql_close($host);
  return "微信互动墙信息提交成功\n".date('Y-m-d H:i:s')."\n查看<a href='http://app.jnzx.gov.cn/app/wall/wall'>【微信互动墙】</a>"; //$json[0]['subscribe_time']注册时间
}

function JSON_SJBD($name,$phone,$openid)
{
	//-----------------------
	$query=mysql_query("select access_token from weixin_access_token where id = 1");
	$row=mysql_fetch_array($query);
	$access_token = $row['access_token'];
	$json = file_get_contents("http://app.jnzx.gov.cn/app/weixin_openid.php?access_token=".$access_token."&openid=".$openid);
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);		
	$picurl = $json[0]['headimgurl'];
	$nickname = $json[0]['nickname'];
	//-----------------------
	date_default_timezone_set('PRC');	//时区设定
	$query1=mysql_query("select COUNT(*) from weixin_sjbd where name like '%$name%' and openid like '%$openid%'");
	$row1=mysql_fetch_array($query1);

	$query3=mysql_query("select COUNT(*) from weixin_sjbd where openid like '%$openid%'");
	$row3=mysql_fetch_array($query3);

	$query4=mysql_query("select COUNT(*) from weixin_sjbd where phone like '%$phone%'");
	$row4=mysql_fetch_array($query4);

	$query2=mysql_query("select * from weixin_sjbd where name like '%$name%' and openid like '%$openid%'");
	$row2=mysql_fetch_array($query2);	
	
	if ($row1[0]==0 and $row4[0]==0){
		$query1=mysql_query("INSERT INTO weixin_sjbd (name,phone,openid,nickname,picurl,date) VALUES ('$name','$phone','$openid','$nickname','$picurl','".date('Y-m-d H:i:s')."')");
		mysql_close($host);
		return '绑定成功！';
	}
	else if($row1[0]>0 and $row2['openid']==$openid and $row4[0]!=0 and $row2['phone']==$phone){
		return $row2['name'].'：您好！您已经绑定过该号码。';
	}	
	else if($row1[0]>0 and $row2['openid']==$openid and $row4[0]==0){
		return $row2['name'].'：您好！您已经绑定过有关信息。若需更新修改，请发送“绑定+姓名+#+手机+#+更新”指令，如：“绑定张三#1360531000#更新”。';
	}
	else if($row1[0]>0 and $row2['openid']!=$openid and $row3[0]==0){
		$query1=mysql_query("INSERT INTO weixin_sjbd (name,phone,openid,nickname,picurl,date) VALUES ('$name','$phone','$openid','$nickname','$picurl','".date('Y-m-d H:i:s')."')");
		mysql_close($host);
		return '绑定成功！';
	}
	else{
		return '您的微信帐号已绑定过其它用户信息，不可多重绑定。';
	}
}

function JSON_SJBDGX($name,$phone,$openid)
{
	//-----------------------
	$query=mysql_query("select access_token from weixin_access_token where id = 1");
	$row=mysql_fetch_array($query);
	$access_token = $row['access_token'];
	$json = file_get_contents("http://app.jnzx.gov.cn/app/weixin_openid.php?access_token=".$access_token."&openid=".$openid);
	$json = json_decode(trim($json, chr(239) . chr(187) . chr(191)), true);		
	$picurl = $json[0]['headimgurl'];
	$nickname = $json[0]['nickname'];
	//-----------------------
	date_default_timezone_set('PRC');	//时区设定
	$query1=mysql_query("select COUNT(*) from weixin_sjbd where name like '%$name%' and openid like '%$openid%'");
	$row1=mysql_fetch_array($query1);

	$query3=mysql_query("select COUNT(*) from weixin_sjbd where openid like '%$openid%'");
	$row3=mysql_fetch_array($query3);

	$query4=mysql_query("select COUNT(*) from weixin_sjbd where phone like '%$phone%'");
	$row4=mysql_fetch_array($query4);

	$query2=mysql_query("select * from weixin_sjbd where openid like '%$openid%'");
	$row2=mysql_fetch_array($query2);	
	
	if($row2['openid']==$openid and $row4[0]==0){
		$query1=mysql_query("UPDATE weixin_sjbd SET name = '$name',phone = '$phone',date = '".date('Y-m-d H:i:s')."' WHERE openid = '$openid'");
		mysql_close($host);
		return '更新成功！';
	}else{
		return '更新失败！';
	}
	
}

?>
