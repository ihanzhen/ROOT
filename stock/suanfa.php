<title>算法测试</title>
<body style="background: #ccc">
<?php
//phpinfo();
$appk = "be761993-6c6f-4541-913c-b85be8835658";
$apps = "a3e33980-6da9-49ab-80e0-559ead8bc429";
$code = "2D336A8C66234020BDDED0AE9A859D3F2016031517091755228760";
$union = $appk.":".$apps;
$b64e = base64_encode($union);


//获取code
//https://open.hs.net/oauth2/oauth2/authorize?response_type=code&client_id=be761993-6c6f-4541-913c-b85be8835658&state=xyz&redirect_uri=http%3A%2F%2F127.0.0.1%2F
/*
echo $appk."<br/>";
echo $apps."<br/>";
echo $union."<br/>";
echo $code."<br/>";
echo $b64e."<br/>";
*/

/*原始公式
SHORT=12
LONG=26
MID=9
DIF:EMA(CLOSE,SHORT)-EMA(CLOSE,LONG);
DEA:EMA(DIF,MID);
MACD:(DIF-DEA)*2,COLORSTICK;
*/
/*20150116-20150717*/
$C = array();

$C[0] = "10.12";
$C[1] = "9.64";
$C[2] = "9.42";
$C[3] = "9.00";
$C[4] = "9.31";
$C[5] = "9.38";
$C[6] = "9.58";
$C[7] = "9.68";
$C[8] = "9.79";
$C[9] = "10.24";
$C[10] = "10.35";
$C[11] = "10.73";
$C[12] = "11.18";
$C[13] = "11.31";
$C[14] = "11.78";
$C[15] = "11.49";
$C[16] = "10.58";
$C[17] = "10.56";
$C[18] = "11.42";
$C[19] = "11.83";
$C[20] = "14.40";
$C[21] = "14.43";
$C[22] = "12.30";
$C[23] = "11.39";
$C[24] = "8.89";
$C[25] = "8.37";


$C1 = array();
$C1[0] = "11.78";
$C1[1] = "11.49";
$C1[2] = "10.58";
$C1[3] = "10.56";
$C1[4] = "11.42";
$C1[5] = "11.83";
$C1[6] = "14.40";
$C1[7] = "14.43";
$C1[8] = "12.30";
$C1[9] = "11.39";
$C1[10] = "8.89";
$C1[11] = "8.37";

$C2 = array();
$C2[0] = "10.12";
$C2[1] = "9.64";
$C2[2] = "9.42";
$C2[3] = "9.00";
$C2[4] = "9.31";
$C2[5] = "9.38";
$C2[6] = "9.58";
$C2[7] = "9.68";
$C2[8] = "9.79";
$C2[9] = "10.24";
$C2[10] = "10.35";
$C2[11] = "10.73";


$D=array();
$D1=array();
$D2=array();
$j=0;
for($i=count($C)-1;$i>=0;$i--){
	$D[$j] = $C[$i];
	$j++;
}

$j=0;
for($i=count($C1)-1;$i>=0;$i--){
	$D1[$j] = $C1[$i];
	$D2[$j] = $C2[$i];
	$j++;
}

//print_r($X)."<br/>";
//print_r($C)."<br/>";

echo "C:".$C[25]."<br/>";

function EXPMA($X,$N) {
	$k = 2.0/($N + 1.0);
	$ema = $X[0];
	for($i=0;$i<count($X);$i++){
		$ema = $X[$i]*$k+$ema*(1-$k);
	}
	return $ema;
}

function EXPMA1($X,$N) {
	$vec=array();
	$nLen=count($X);
	if($nLen>=1){
		if($N>$nLen) $N=$nLen;
		$vec[0]=$X[0];
		for($i = 1; $i < $nLen; $i++){
			$vec[$i] = (2*$X[$i]+($N-1)*$vec[$i-1])/($N+1);
		}	
	}
	return $vec;
}



function MACDX($CLOSE,$shortPeriod,$longPeriod,$mid){
	$shortEMA=EXPMA($CLOSE,$shortPeriod);
	$longEMA=EXPMA($CLOSE,$longPeriod);
	$dif=EXPMA($CLOSE,12)-EXPMA($CLOSE,26);
	$dea=0.0; 
	echo "shortEMA:<span style=color:red>".round($shortEMA,4)."</span><br/>";
	echo "longEMA:<span style=color:red>".round($longEMA,4)."</span><br/>";
	echo "DIF:<span style=color:red>".round($dif,4)."</span><br/>";
	echo "DEA:<span style=color:red>".round($dea,4)."</span><br/>";
}

function MACD($CLOSE,$shortPeriod,$longPeriod,$mid){ 
	$macdData=0.0;
	$diffList=array();
	$shortEMA=0.0;
	$longEMA=0.0;
	$dif=0.0; 
	$dea=0.0; 
	
	for($i=count($CLOSE)-1;$i>=0;$i--){  
		$sublist=array(0=>$CLOSE[0],1=>$CLOSE[count($CLOSE)-$i]);
		$shortEMA=EXPMA($sublist,$shortPeriod);
		$longEMA=EXPMA($sublist,$longPeriod);
		$dif=$shortEMA-$longEMA;
		$diffList[$i]=$dif;
	}
	$dea=EXPMA($diffList,$mid);
	$macd=($dif-$dea)*2;
	//echo "sublist[0]:<span style=color:red>".round($sublist[0],2)."</span><br/>";
	echo "shortEMA:<span style=color:red>".round($shortEMA,2)."</span><br/>";
	echo "longEMA:<span style=color:red>".round($longEMA,2)."</span><br/>";
	echo "DIF:<span style=color:red>".round($dif,2)."</span><br/>";
	echo "DEA:<span style=color:red>".round($dea,2)."</span><br/>";
	echo "MACD:<span style=color:red>".round($macd,2)."</span><br/>";
}
echo MACD($C,12,26,9);
print_r($C);
echo "<br/>";
echo MACDX($C,12,26,9);
print_r($C);
echo "<br/>";
echo MACD($C,12,26,9);
echo "<br/>";

echo "shortEMA:<span style=color:red>".round(EXPMA($X,12),4)."</span><br/>";
echo "longEMA:<span style=color:red>".round(EXPMA($X,26),4)."</span><br/>";
print_r($X2);
echo "<br/><br/>";

echo "shortEMA:<span style=color:red>".round(EXPMA1($X,12),4)."</span><br/>";
echo "longEMA:<span style=color:red>".round(EXPMA1($X,26),4)."</span><br/>";

print_r(EXPMA1($C,12));
echo "<br/>";
print_r(EXPMA1($C,26));
echo "<br/>";
echo "20150710标准值<br/>";
echo "shortEMA:<span style=color:red>10.94</span><br/>";
echo "longEMA:<span style=color:red>10.70</span><br/>";
echo "dif:<span style=color:red>0.24</span><br/>";
echo "dea:<span style=color:red>0.6</span><br/>";
echo "macd:<span style=color:red>-0.71</span><br/>";

//$ema12 = 11.41*11/13+8.37*2/13;
//$ema26 = 10.89*25/27+8.37*2/27;

$ema12 = 99.98*11/13+2857.19*2/13;
$ema26 = 99.98*25/27+104.39*2/27;
echo "ema12:".$ema12."<br/>";
echo "ema26:".$ema26."<br/>";
echo "<br/>";
/*
$C[14] = "11.78"; 
$C[15] = "11.49";
$C[16] = "10.58";
$C[17] = "10.56";
$C[18] = "11.42";
$C[19] = "11.83"; 
$C[20] = "14.40";
$C[21] = "14.43";
$C[22] = "12.30";
$C[23] = "11.39";
$C[24] = "8.89";
$C[25] = "8.37";
*/

//137.44
//11.4533
//分母N*(N+1)/2   12*13/2=78
$xyz12=(12*$C[25]+11*$C[24]+10*$C[23]+9*$C[22]+8*$C[21]+7*$C[20]+6*$C[19]+5*$C[18]+4*$C[17]+3*$C[16]+2*$C[15]+1*$C[14])/78;
$xyz12_1=(1*$C[25]+2*$C[24]+3*$C[23]+4*$C[22]+5*$C[21]+6*$C[20]+7*$C[19]+8*$C[18]+9*$C[17]+10*$C[16]+11*$C[15]+12*$C[14])/78;

$av=3+4+5+6+7;
echo "xyz12:".$xyz12;
echo "<br/>";
echo "xyz12_1:".$xyz12_1;
echo "<br/>";
echo $av;

echo "<br/>";
print_r($C1);
echo "<br/>";

$Y=array(3,4,5,6,7);

echo EXPMA($Y,5);
echo "<br/>";
print_r(EXPMA1($C2,5));
?>

<body>

