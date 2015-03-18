//General functions



////////predefined 
var gravity = -9.81;

var knotvec_circ = [0,0,0,0.25,0.25,0.5,0.5,0.75,0.75,1,1,1]; //knotvec_circ and ptsweights_circ hold true for ellipses
var ptsweights_circ = [1, 0.70710678118, 1, 0.70710678118, 1, 0.70710678118,1,0.70710678118,1];
////////end predefined

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

var Phys_obj = function(pos,mass,speed,acc,shapedata){
	this.pos = pos;  //pos.x1 =x position, pos.x2 =y position, pos.x3 =orientation_angle,
	this.mass = mass;
	this.speed = speed; //speed.x1= speed x-direction... speed.x3 = rotation x3 axis
	this.acc = acc; // acc = [0,0] no rotation acceleration
	this.shapedata = {
		degree: 0,
		knotvec: 0,
		controlpoints: 0,
		weights: 0
	}; //every shape is generated with NURBS basic functions //shapedata: [knotvec, controlpoints,weights]
	
	this.generateNurbsData = function() { //convert nurbsData to verb nurbsData
		this.nurbsData = new verb.core.NurbsCurveData(this.shapedata.degree,this.shapedata.knotvec.slice(),verb.core.Eval.homogenize1d(this.shapedata.controlpoints,this.shapedata.weights));
	}
	this.generateShape= function() { //generate shape from verb
		this.shape = new verb.geom.NurbsCurve(this.nurbsData);
	}
	this.rotate = function() { 
        this.pos.x3=this.pos.x3+this.speed.x3*tick;
	  //generate new this.pos.x1 and this.pos.x2 and give new shapedata back ----- depends on objects angle = this.pos.x3}
	}
}


Circle = function(radius,pos){
	this.radius = radius;
	this.pos 	= pos;
	this.shapedata.degree = 2;
	this.shapedata.knotvec = knotvec_circ;
	this.shapedata.weights = ptsweights_circ;
	this.generate_circle_cpts = function(){
		var p1b= [this.pos.x1,                this.pos.x2+this.radius,     0];
        var p2b= [this.pos.x1,                this.pos.x2,                 0]; 
        var p3b= [this.pos.x1+this.radius,    this.pos.x2,                 0]; 
        var p4b= [this.pos.x1+2*this.radius,  this.pos.x2,                 0]; 
        var p5b= [this.pos.x1+2*this.radius,  this.pos.x2+this.radius,     0]; 
        var p6b= [this.pos.x1+2*this.radius,  this.pos.x2+2*this.radius,   0]; 
       	var p7b= [this.pos.x1+this.radius,    this.pos.x2+2*this.radius,   0];
        var p8b= [this.pos.x1,                this.pos.x2+2*this.radius,   0];

        var ptsb= [p1b,p2b, p3b,p4b, p5b,p6b,p7b,p8b,p1b];

        return ptsb;
	}
	this.shapedata.controlpoints = this.generate_circle_cpts();
}



Circle.prototype = new Phys_obj;
Circle.prototype.constructor = Circle;


