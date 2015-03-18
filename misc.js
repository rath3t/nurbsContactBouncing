
var checkandYield = function(param,name){
	if(param || param === 0){
		return param;
	}else{
		throw new Error('Parameter not defined: '+ name);
	}
}