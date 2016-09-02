<meta http-equiv='Content-Type' content='text/html; charset=utf-8' />
<?php
header("Content-Type: text/html;charset=utf-8");
define("TOKEN", "ihanzhencom");
$wechatObj = new wechatCallbackapiTest();
//$wechatObj->valid();

if (!isset($_GET['echostr'])) {
    $wechatObj->responseMsg();
}else{
    $wechatObj->valid();
}
class wechatCallbackapiTest
{
    //验证消息
    public function valid()
    {
        $echoStr = $_GET["echostr"];
        if($this->checkSignature()){
            echo $echoStr;
            exit;
        }
    }
    //检查签名
    private function checkSignature()
    {
        $signature = $_GET["signature"];
        $timestamp = $_GET["timestamp"];
        $nonce = $_GET["nonce"];
        $token = TOKEN;
        $tmpArr = array($token, $timestamp, $nonce);
        sort($tmpArr, SORT_STRING);
        $tmpStr = implode($tmpArr);
        $tmpStr = sha1($tmpStr);

        if($tmpStr == $signature){
            return true;
        }else{
            return false;
        }
    }
    //响应消息
    public function responseMsg()
    {
        $postStr = $GLOBALS["HTTP_RAW_POST_DATA"];
        if (!empty($postStr)){
            $this->logger("R ".$postStr);
            $postObj = simplexml_load_string($postStr, 'SimpleXMLElement', LIBXML_NOCDATA);
            $RX_TYPE = trim($postObj->MsgType);
             
            //消息类型分离
            switch ($RX_TYPE)
            {
                case "event":
                    $result = $this->receiveEvent($postObj);
                    break;
                case "text":
                    $result = $this->receiveText($postObj);
                    break;
                case "image":
                    $result = $this->receiveImage($postObj);
                    break;
                case "location":
                    $result = $this->receiveLocation($postObj);
                    break;
                case "voice":
                    $result = $this->receiveVoice($postObj);
                    break;
                case "video":
                    $result = $this->receiveVideo($postObj);
                    break;
                case "link":
                    $result = $this->receiveLink($postObj);
                    break;
                default:
                    $result = "unknown msg type: ".$RX_TYPE;
                    break;
            }
            $this->logger("T ".$result);
            echo $result;
        }else {
            echo "";
            exit;
        }
    }
    //接收事件消息
    private function receiveEvent($object)
    {
        $content = "";
        switch ($object->Event)
        {
            case "subscribe":
				$content = "😃 您好，欢迎关注函真数据！我们是一家跨市场全时自动量化交易的平台，我们为客户提供优化投资效率的解决方案。希望我们的服务可以为您带来愉快的体验！";
                break;
            case "unsubscribe":
                $content = "取消关注";
                break;
            case "scancode_waitmsg":
                //$content = "扫描场景 ".$object->EventKey;
                if($object->EventKey="rselfmenu_0_0")
                {
					$keyword = $object->ScanCodeInfo->ScanResult;
					//查询座次
					if (strstr($keyword, "zc")){
						$zc = str_replace('zc','',$keyword);
						include("weixin_cjson.php");
						$content = JSON_ZCCX_SCAN($zc);
					}
					else if (strstr($keyword, "座次")){
						$zc = str_replace('座次','',$keyword);
						include("weixin_cjson.php");
						$content = JSON_ZCCX_SCAN($zc);
					}					
                }
               break;
            case "CLICK":
                switch ($object->EventKey)
                {
                    case "KEY_ABOUTUS":
											$content = "北京函真数据 DataTech\n技术有限公司 HANZHEN\n京外 400-888-6666\n本地 010-60608336\ninfo@hanzhendata.com\n海淀区中关村东路18号1号楼16层B-1908-029号(邮编 100091)";
                    break;                                                                    	
                    case "KEY_JIONUS":
											$content = "简历作品请投：\nhr@hanzhendata.com\n1.JAVA后端工程师\n2.JS前端工程师\n3.美工设计\n";				
                    break;
                    case "KEY_DPZS":
											$content = array();
											$content[] = array("Title"=>"📈 大盘属性 | 仓位建议 | 趋势魔方", "Description"=>"", "PicUrl"=>"", "Url" =>"#"); 
											$content[] = array("Title"=>"⚠ 上证指数\n牛市多头 | 上涨 | 六成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D4.jpg", "Url" =>"#");
											$content[] = array("Title"=>"中证500 \n牛市多头 | 上涨 | 满仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D5.jpg", "Url" =>"#");
											$content[] = array("Title"=>"沪深300\n牛市多头 | 上涨 | 六成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D3.jpg", "Url" =>"#");
											$content[] = array("Title"=>"中小板指\n牛市多头 | 上涨 | 六成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D6.jpg", "Url" =>"#");
											$content[] = array("Title"=>"文华指数\n牛市空头 | 盘整 | 三成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D7.jpg", "Url" =>"#");
											$content[] = array("Title"=>"美元指数\n熊市空头 | 下跌 | 空仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D8.jpg", "Url" =>"#");
											$content[] = array("Title"=>"⚠ 伦敦金\n熊市多头 | 盘整 | 三成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/Z7.jpg", "Url" =>"#");
											$content[] = array("Title"=>"法律声明：未经函真授权©禁止转载", "Description"=>"", "PicUrl"=>"", "Url" =>"#");
                    break; 
                    case "KEY_CWKZ":
                                            $content = array();
                                            $content[] = array("Title"=>"📈 函真50 | Top5", "Description"=>"", "PicUrl"=>"", "Url" =>"#"); 
                                            $content[] = array("Title"=>"螺纹1701\n牛市多头 | 上涨 | 六成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D4.jpg", "Url" =>"#");
                                            $content[] = array("Title"=>"玻璃1701\n牛市多头 | 上涨 | 满仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D5.jpg", "Url" =>"#");
                                            $content[] = array("Title"=>"豆油1701\n牛市多头 | 上涨 | 六成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D3.jpg", "Url" =>"#");
                                            $content[] = array("Title"=>"沪锌1701\n牛市多头 | 上涨 | 六成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D6.jpg", "Url" =>"#");
                                            $content[] = array("Title"=>"热卷1701\n牛市空头 | 盘整 | 三成仓", "Description"=>"", "PicUrl"=>"http://123.57.218.171/tmp/images/D7.jpg", "Url" =>"#");
                                            $content[] = array("Title"=>"法律声明：未经函真授权©禁止转载", "Description"=>"", "PicUrl"=>"", "Url" =>"#");
                    break;   
                    case "KEY_MMXH":
                                            $content = array();
                                            $content[] = array("Title"=>"法律声明：未经函真授权©禁止转载", "Description"=>"螺纹1701\n牛市多头 | 上涨 | 六成仓", "PicUrl"=>"http://123.57.218.171/tmp/images/bg2.jpg", "Url" =>"#");
                    break;                 					
					default:
        	        		$content = "点击菜单：".$object->EventKey;
                    break;
                }
                break;
            case "LOCATION":
                //$content = "上传位置：纬度 ".$object->Latitude.";经度 ".$object->Longitude;
                break;
            case "VIEW":
                $content = "跳转链接 ".$object->EventKey;
                break;
            case "MASSSENDJOBFINISH":
                $content = "消息ID：".$object->MsgID."，结果：".$object->Status."，粉丝数：".$object->TotalCount."，过滤：".$object->FilterCount."，发送成功：".$object->SentCount."，发送失败：".$object->ErrorCount;
                break;
            default:
                $content = "receive a new event: ".$object->Event;
                break;
        }
        if(is_array($content)){
            if (isset($content[0]['PicUrl'])){
                $result = $this->transmitNews($object, $content);
            }else if (isset($content['MusicUrl'])){
                $result = $this->transmitMusic($object, $content);
            }
        }else{
            $result = $this->transmitText($object, $content);
        }
        return $result;
    }

    //接收文本消息
    private function receiveText($object)
		{
				$xmlTpl = "
				<xml>
				<ToUserName><![CDATA[%s]]></ToUserName>
				<FromUserName><![CDATA[%s]]></FromUserName>
				<CreateTime>%s</CreateTime>
				<MsgType><![CDATA[text]]></MsgType>
				<Content><![CDATA[%s]]></Content>
				</xml>";
				$result = sprintf($xmlTpl, $object->FromUserName, $object->FromUserName, time(), $content);	
        $keyword = trim($object->Content);

        //多客服人工回复模式
        if (strstr($keyword, "您好") || strstr($keyword, "你好") || strstr($keyword, "在吗")){
            $result = $this->transmitService($object);
        }
        //自动回复模式
        else{
					//查询座次
					if (strstr($keyword, "zc")){
						$zc = str_replace('zc','',$keyword);
						include("weixin_cjson.php");
						$content = JSON_ZCCX($zc);
					}
					else if (strstr($keyword, "座次")){
						$zc = str_replace('座次','',$keyword);
						include("weixin_cjson.php");
						$content = JSON_ZCCX($zc);
					}					
					//微信上墙
					else if (strstr($keyword, "@")){
						$sq = str_replace('@','',$keyword);
						include("weixin_cjson.php");
						$content = JSON_WXSQ($sq,$object->FromUserName); 
					}
					//绑定手机
					else if (strstr($keyword, "bd")){
						$bd = str_replace('bd','',$keyword);
						$arr = explode("#",$bd);
						$name=$arr[0];
						$phone=$arr[1];
						include("weixin_cjson.php");
						$content = JSON_SJBD($name,$phone,$object->FromUserName); 
					}
					else if (strstr($keyword, "绑定")){
						$bd = str_replace('绑定','',$keyword);
						$arr = explode("#",$bd);
						if (count($arr)==2){
							$name=$arr[0];
							$phone=$arr[1];
							include("weixin_cjson.php");
							$content = JSON_SJBD($name,$phone,$object->FromUserName); 
						}
						if (count($arr)==3 and $arr[2]=='更新'){
							$name=$arr[0];
							$phone=$arr[1];
							include("weixin_cjson.php");
							$content = JSON_SJBDGX($name,$phone,$object->FromUserName); 
						}
					}										
					else{
            			$content = "😃 您好，欢迎关注函真数据！我们是一家跨市场全时自动量化交易的平台，我们为客户提供优化投资效率的解决方案。希望我们的服务可以为您带来愉快的体验！";          
          }
          if(is_array($content)){
              if (isset($content[0]['PicUrl'])){
                  $result = $this->transmitNews($object, $content);
              }else if (isset($content['MusicUrl'])){
                  $result = $this->transmitMusic($object, $content);
              }
          }else{
              $result = $this->transmitText($object, $content);
          }
        }
        return $result;
    }
    //接收图片消息
    private function receiveImage($object)
    {
        $content = array("MediaId"=>$object->MediaId);
        $result = $this->transmitImage($object, $content);
        return $result;
    } 

    //接收位置消息
    private function receiveLocation($object)
    {
        $content = "你发送的是位置，纬度为：".$object->Location_X."；经度为：".$object->Location_Y."；缩放级别为：".$object->Scale."；位置为：".$object->Label;
        $result = $this->transmitText($object, $content);
        return $result;
    }

    //接收语音消息
    private function receiveVoice($object)
    {
        if (isset($object->Recognition) && !empty($object->Recognition)){
            //$content = "你刚才说的是：".$object->Recognition;
            //$result = $this->transmitText($object, $content);
						switch ($object->Recognition)
						{
							case "菜单":
								$content = "😃 您好，欢迎关注函真数据！我们是一家跨市场全时自动量化交易的平台，我们为客户提供优化投资效率的解决方案。希望我们的服务可以为您带来愉快的体验！";							
                				$result = $this->transmitNews($object, $content);					
								break;
							default:
								$content = "你说的是：“".$object->Recognition."”，非语音功能指令。";
								$result = $this->transmitText($object, $content);
								break;
						}			

						//查询座次
						if (strstr($object->Recognition, "zc")){
							$zc = str_replace('zc','',$object->Recognition);
							include("weixin_cjson.php");
							$content = JSON_ZCCX($zc);
							$result = $this->transmitNews($object, $content);	
						}
						else if (strstr($object->Recognition, "座次")){
							$zc = str_replace('座次','',$object->Recognition);
							include("weixin_cjson.php");
							$content = JSON_ZCCX($zc);
							$result = $this->transmitNews($object, $content);	
						}		

        }else{
            $content = array("MediaId"=>$object->MediaId);
            $result = $this->transmitVoice($object, $content);
        }

        return $result;
    }

    //接收视频消息
    private function receiveVideo($object)
    {
        $content = array("MediaId"=>$object->MediaId, "ThumbMediaId"=>$object->ThumbMediaId, "Title"=>"", "Description"=>"");
        $result = $this->transmitVideo($object, $content);
        return $result;
    }

    //接收链接消息
    private function receiveLink($object)
    {
        $content = "你发送的是链接，标题为：".$object->Title."；内容为：".$object->Description."；链接地址为：".$object->Url;
        $result = $this->transmitText($object, $content);
        return $result;
    }

    //回复文本消息
    private function transmitText($object, $content)
    {
        $xmlTpl = "
        <xml>
				<ToUserName><![CDATA[%s]]></ToUserName>
				<FromUserName><![CDATA[%s]]></FromUserName>
				<CreateTime>%s</CreateTime>
				<MsgType><![CDATA[text]]></MsgType>
				<Content><![CDATA[%s]]></Content>
				</xml>";
        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time(), $content);
        return $result;
    }

    //回复图片消息
    private function transmitImage($object, $imageArray)
    {
        $itemTpl = "
        <Image>
				    <MediaId><![CDATA[%s]]></MediaId>
				</Image>";

        $item_str = sprintf($itemTpl, $imageArray['MediaId']);

        $xmlTpl = "<xml>
				<ToUserName><![CDATA[%s]]></ToUserName>
				<FromUserName><![CDATA[%s]]></FromUserName>
				<CreateTime>%s</CreateTime>
				<MsgType><![CDATA[image]]></MsgType>
				$item_str
				</xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time());
        return $result;
    }

    //回复语音消息
    private function transmitVoice($object, $voiceArray)
    {
        $itemTpl = "
        <Voice>
				    <MediaId><![CDATA[%s]]></MediaId>
				</Voice>";

        $item_str = sprintf($itemTpl, $voiceArray['MediaId']);

        $xmlTpl = "
        <xml>
				<ToUserName><![CDATA[%s]]></ToUserName>
				<FromUserName><![CDATA[%s]]></FromUserName>
				<CreateTime>%s</CreateTime>
				<MsgType><![CDATA[voice]]></MsgType>
				$item_str
				</xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time());
        return $result;
    }

    //回复视频消息
    private function transmitVideo($object, $videoArray)
    {
        $itemTpl = "
        <Video>
				    <MediaId><![CDATA[%s]]></MediaId>
				    <ThumbMediaId><![CDATA[%s]]></ThumbMediaId>
				    <Title><![CDATA[%s]]></Title>
				    <Description><![CDATA[%s]]></Description>
				</Video>";

        $item_str = sprintf($itemTpl, $videoArray['MediaId'], $videoArray['ThumbMediaId'], $videoArray['Title'], $videoArray['Description']);

        $xmlTpl = "
        <xml>
				<ToUserName><![CDATA[%s]]></ToUserName>
				<FromUserName><![CDATA[%s]]></FromUserName>
				<CreateTime>%s</CreateTime>
				<MsgType><![CDATA[video]]></MsgType>
				$item_str
				</xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time());
        return $result;
    }

    //回复图文消息
    private function transmitNews($object, $newsArray)
    {
        if(!is_array($newsArray)){
            return;
        }
        $itemTpl = "
        <item>
	        <Title><![CDATA[%s]]></Title>
	        <Description><![CDATA[%s]]></Description>
	        <PicUrl><![CDATA[%s]]></PicUrl>
	        <Url><![CDATA[%s]]></Url>
        </item>
				";
        $item_str = "";
        foreach ($newsArray as $item){
            $item_str .= sprintf($itemTpl, $item['Title'], $item['Description'], $item['PicUrl'], $item['Url']);
        }
        $xmlTpl = "
        <xml>
					<ToUserName><![CDATA[%s]]></ToUserName>
					<FromUserName><![CDATA[%s]]></FromUserName>
					<CreateTime>%s</CreateTime>
					<MsgType><![CDATA[news]]></MsgType>
					<ArticleCount>%s</ArticleCount>
					<Articles>
					$item_str</Articles>
				</xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time(), count($newsArray));
        return $result;
    }

    //回复音乐消息
    private function transmitMusic($object, $musicArray)
    {
        $itemTpl = "
        <Music>
				    <Title><![CDATA[%s]]></Title>
				    <Description><![CDATA[%s]]></Description>
				    <MusicUrl><![CDATA[%s]]></MusicUrl>
				    <HQMusicUrl><![CDATA[%s]]></HQMusicUrl>
				</Music>";

        $item_str = sprintf($itemTpl, $musicArray['Title'], $musicArray['Description'], $musicArray['MusicUrl'], $musicArray['HQMusicUrl']);

        $xmlTpl = "
        <xml>
				<ToUserName><![CDATA[%s]]></ToUserName>
				<FromUserName><![CDATA[%s]]></FromUserName>
				<CreateTime>%s</CreateTime>
				<MsgType><![CDATA[music]]></MsgType>
				$item_str
				</xml>";

        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time());
        return $result;
    }

    //回复多客服消息
    private function transmitService($object)
    {
        $xmlTpl = "
        <xml>
				<ToUserName><![CDATA[%s]]></ToUserName>
				<FromUserName><![CDATA[%s]]></FromUserName>
				<CreateTime>%s</CreateTime>
				<MsgType><![CDATA[transfer_customer_service]]></MsgType>
				</xml>";
        $result = sprintf($xmlTpl, $object->FromUserName, $object->ToUserName, time());
        return $result;
    }

    //日志记录
    private function logger($log_content)
    {
        if(isset($_SERVER['HTTP_APPNAME'])){   //SAE
            sae_set_display_errors(false);
            sae_debug($log_content);
            sae_set_display_errors(true);
        }else if($_SERVER['REMOTE_ADDR'] != "127.0.0.1"){ //LOCAL
            $max_size = 10000;
            $log_filename = "log.xml";
            if(file_exists($log_filename) and (abs(filesize($log_filename)) > $max_size)){unlink($log_filename);}
            file_put_contents($log_filename, date('H:i:s')." ".$log_content."\r\n", FILE_APPEND);
        }
    }
}
?>