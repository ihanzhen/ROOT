<?php
//EMA(C,N)=( 2*C + (N-1) * EMA(REF(C,1) ,  N ) ))/(N + 1)
echo "20150710标准值<br/>";
echo "shortEMA:<span style=color:red>7.564</span><br/>";
echo "longEMA:<span style=color:red>7.890</span><br/>";
echo "dif:<span style=color:red>-0.327</span><br/>";
echo "dea:<span style=color:red>-0.332</span><br/>";
echo "macd:<span style=color:red>0.011</span><br/>";
/*
7.92,7.89,8.03,10.13,7.84,7.92,7.06,6.73,7.20,7.14,7.78,7.26
$C = array(7.41,7.92,7.89,8.03,10.13,7.84,7.92,7.06,6.73,7.20,7.14,7.78,7.26);			
*/
$C = array(7.92,7.89,8.03,10.13,7.84,7.92,7.06,6.73,7.20,7.14,7.78,7.26);
$D = array();
$j=0;
for($i=count($C)-1;$i>=0;$i--){
	$D[$j] = $C[$i];
	$j++;
}

function EMA($X,$N) {
	$k = 2.0/($N + 1.0);
	$ema = $X[0];
	for($i=0;$i<count($X);$i++){
		$ema = $X[$i]*$k+$ema*(1-$k);
		//$ema = ( 2*$X[$i]+($N-1)*EMA($X[$i-1],$N) )/($N-1);
	}
	return $ema;
}
$EMA12=7.564;
$EMA26=7.890;
echo EMA($C,12)."<br/>";
echo "偏差".(EMA($C,12)-$EMA12)."<br/>";
echo EMA($C,26)."<br/>";
echo "偏差".(EMA($C,26)-$EMA26)."<br/>";
?>