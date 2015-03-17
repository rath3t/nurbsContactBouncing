//General
var gravity = -9.81;

//all body shapes are represented with NURBS -> http://en.wikipedia.org/wiki/Non-uniform_rational_B-spline



var gravity =function(){ //gravity only chances values in global y-direction
	//process gravity on all phys_objs
	//update positons/speed/acc
}

var collisionHandler = function(){
	//process all distances between phys_objs
	//collision yes,no -> consequences
	//update positons/speed/acc
}

var phys_obj = function(pos,mass,speed,acc){
	return{
		pos: pos, //pos.x1 =x position, pos.x2 =y position, pos.x3 =orientation_angle,
		//shapeargs: shapeargs, //circle = radius, ellipse = both semi axis
		mass: mass,
		speed: speed, //speed.x1= speed x-direction... speed.x3 = rotation x3 axis
		acc: acc, // acc = [0,0] no rotation acceleration
		generate_shape: function(){
			//pos, shapeargs....
			//return i.e. verb.geom.NurbsCurve.byKnotsControlPointsWeights
		},
		rotate: function() {
                this.orient_angle=this.orient_angle+this.speed[2]*tick;
            },
	}


}

var defineProp = function ( obj, key, value ){
  var config = {
    value: value,
    writable: true,
    enumerable: true,
    configurable: true
  };
  Object.defineProperty( obj, key, config );
};