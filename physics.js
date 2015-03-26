
////////predefined 
var knotvec_circ = [0,0,0,0.25,0.25,0.5,0.5,0.75,0.75,1,1,1]; //knotvec_circ and ptsweights_circ hold true for ellipses
var ptsweights_circ = [1, 0.70710678118, 1, 0.70710678118, 1, 0.70710678118,1,0.70710678118,1];
////////end predefined

//all body shapes are represented with NURBS -> http://en.wikipedia.org/wiki/Non-uniform_rational_B-spline

//memory variables
var isGravityOn = false;

var Material = function(e,mue){
	this.e = e;
	this.mue = mue;
}


var Gravity =function(){
	this.acc = 0;
	this.acc_def = "space";
	this.isGravityOn = false;
	this.on = function(phys_obj_array,planet){
		if(planet=="earth"){
			this.acc = -9.81;
			this.acc_def = "earth";
			isGravityOn
		}else if(planet=="moon"){
			this.acc = -1.622;
			this.acc_def = "moon";
		}else if(!isNaN(planet)){
			this.acc = planet;
			this.acc_def = "custom";
		}

		if(!isGravityOn || isGravityOn === undefined){
			for (var i = 0; i < phys_obj_array.length; i++) {
				//console.log(phys_obj_array[i].acc.x2, " + ", this.acc);
				(phys_obj_array[i]).acc.x2 =(phys_obj_array[i]).acc.x2 +this.acc;
				this.isGravityOn = true;
			}
		}
	}
	this.off = function(phys_obj_array){
		if(isGravityOn){
			for (var i = 0; i < phys_obj_array.length; i++) {
				(phys_obj_array[i]).acc.x2 =(phys_obj_array[i]).acc.x2 -this.acc;
				this.isGravityOn = false;
				this.acc_def = "space";

			}
		}
	}
	this.modify_gravity = function(obj,val){
		obj.acc.x2 =obj.acc.x2 + val;
	}
}

var move_phys_objs =function(phys_obj_array){
	for (var i = 0; i < phys_obj_array.length; i++) {
		phys_obj_array[i].move();
	};
}

var collisionHandler = function(){
	this.ignore_memory = [];
	for (var i = 0; i < phys_obj_array.length; i++) {
		inner: for (var j = i+1; j < phys_obj_array.length; j++) {
			if(this.ignore_memory[i][j]=true){
				break inner;
			}
			var intersect = verb.geom.Intersect.curves( phys_obj_array[i].nurbsData, phys_obj_array[j].nurbsData, 1e-10 );

			if(intersect==0) {
                break inner;
       	 	}else if(intersect.length>=2){
           		//pass objs to this.preProcessorCollision
           		//pass objs and intersect to this.calcConsequences
           	}else{
          		//pass objs to this.preProcessorCollision
          		//pass objs and intersect to this.calcConsequences
       	 	}
		}
	}
	this.preProcessorCollision = function(obj_0,obj_1,i,j){
		this.coll_flags = []; //collision flags
		this.coll_flags["Environment"] = [false,false]; //flags for collision behavior of the objects
		this.coll_flags["Circle"] = [false,false];
		this.coll_flags["Ellipse"] = [false,false];

		if (obj_0 instanceof Environment){
			this.coll_flags["Environment"][0] = true;
			if(obj_1 instanceof Environment){
				this.coll_flags["Environment"][1] = true;
				this.ignore_memory[i][j]=true;
			}

		}else if(obj_0 instanceof Circle){
				this.coll_flags["Circle"][0] = true;
				this.ignore_memory[i][j]=false;

		}else if(obj_0 instanceof Ellipse){
				this.coll_flags["Ellipse"][0] = true;
				this.ignore_memory[i][j]=false;
		}

		if (obj_1 instanceof Environment){
			this.coll_flags["Environment"][1] = true;

		}else if(obj_1 instanceof Circle){
				this.coll_flags["Circle"][1] = true;
				this.ignore_memory[i][j]=false;

		}else if(obj_1 instanceof Ellipse){
				this.coll_flags["Ellipse"][1] = true;
				this.ignore_memory[i][j]=false;
		}
	}
	this.calcConsequences = function(obj_0,obj_1,intersect){
		var obj0 = obj_0.shape;
		var obj1 = obj_1.shape;
		var param0 = obj0.closestParam(intersect);
		var param1 = obj1.closestParam(intersect);
        var coll_tangent0 = obj0.tangent(param0);
        var coll_tangent1 = obj1.tangent(param1);
        //calc arithmetically averaged collision normal
        //convert array to vector
        var collt0 = convertArray2Vector(coll_tangent0);
        var collt1 = convertArray2Vector(coll_tangent1);

        var colltFinal = biSectorVector(collt0,collt1);
        //normal vecto of colltFinal :
        var normal_vec = colltFinal.normal_vec();
        var angle_coll = Math.atan(colltFinal[1]/colltFinal[0]);


		if(this.coll_flags["Environment"][0]){
			if(this.coll_flags["Circle"][1]){
				//calc environment vs. circle
				var origin = new Vector2d(0,0,0);
        		var trans_speed1 = obj_1.speed.rotate(angle_coll,origin);

        		var trans_speed_new= new Vector2d(0,0,0);

                trans_speed_new.x1 = -trans_speed1.x1*obj_1.material.e;
                trans_speed_new.x2 = trans_speed1.x2; //stays without friction
                //trans_speed_new[2] = 0; //stays zero, rotation doesnt matter without friction
                
                //convert speeds back to global directions
               	obj_1.speed = trans_speed_new.inv_rotate(angle_coll,origin);
               	//correction of penetration of the physical objects due to the finite small time tick
               	//
               	var correction = 0.01; //maybe calculate correction value from relative speeds of objects
                obj_1.pos = obj_1.pos.add(normal_vec.multi_scalar(correction))

			}else if(this.coll_flags["Ellipse"][1]){
				//calc environment vs. ellipse
			}

		}else if(this.coll_flags["Circle"][0]){
			if(this.coll_flags["Environment"][1]){
				//calc circle vs. enviroment
			}else if(this.coll_flags["Ellipse"][1]){
				//calc circle vs. ellipse
			}else if(this.coll_flags["Circle"][1]){
				//calc circle vs. circle
			}

		}else if(this.coll_flags["Ellipse"][0]){
			if(this.coll_flags["Environment"][1]){
				//calc ellipse vs. enviroment
			}else if(this.coll_flags["Circle"][1]){
				//calc ellipse vs. circle
			}else if(this.coll_flags["Ellipse"][1]){
				//calc ellipse vs. ellipse
			}
		}

	}
	this.ignoreCollision = function(i,j){
		this.ignore_memory[i][j]=true;
	}

}

var Phys_obj = function(pos,mass,speed,acc,center){
	this.pos = pos;  //pos.x1 =x position, pos.x2 =y position, pos.x3 =orientation_angle,
	this.mass = mass;
	this.speed = speed; //speed.x1= speed x-direction... speed.x3 = rotation x3 axis
	this.acc = acc; // acc = [0,0,0]
	this.center = center;
	this.shapeData = {
		degree: 0,
		knotvec: 0,
		controlpoints: 0,
		weights: 0
	}; //every shape is generated with NURBS basic functions //shapeData: [knotvec, controlpoints,weights]
	this.material = new Material(0,0);
	
	this.generateNurbsData = function() { //convert shapeData to verb nurbsData
		this.nurbsData = new verb.core.NurbsCurveData(this.shapeData.degree,this.shapeData.knotvec.slice(),verb.core.Eval.homogenize1d(this.shapeData.controlpoints,this.shapeData.weights));
	}
	this.generateShape= function() { //generate shape from verbData
		this.shape = new verb.geom.NurbsCurve(this.nurbsData);
	}
	this.move = function() { //update pos, speed //x3 values are rotationvalues
		this.pos = this.pos.add((this.speed.multi_scalar(tick)).add(this.acc.multi_scalar(0.5*Math.pow(tick,2))));//this.shape = new verb.geom.NurbsCurve(this.nurbsData);
		this.speed = this.speed.add(this.acc.multi_scalar(tick));
	}
}


var Circle = function(radius,pos,mass,material){
	this.radius = checkandYield(radius,"radius");
	this.__proto__.pos 	= pos;
	this.center = new Vector2d(this.pos.x1+this.radius,this.pos.x2+this.radius,0);
	this.mass   = checkandYield(mass,"mass");
	this.shapeData.degree = 2;
	this.shapeData.knotvec = knotvec_circ;
	this.shapeData.weights = ptsweights_circ;
	this.material = checkandYield(material,"Material");
	
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
	this.shapeData.controlpoints = this.generate_circle_cpts();
	this.generateNurbsData();
	this.generateShape();
}



Circle.prototype = new Phys_obj;
Circle.prototype.constructor = Circle;

var Ellipse = function(x1axis,x2axis,pos,mass,material){
	this.x1axis = checkandYield(x1axis,"x1axis");
	this.x2axis = checkandYield(x2axis,"x2axis");
	this.__proto__.pos 	= checkandYield(pos,"pos");
	this.mass   = checkandYield(mass,"mass");
	this.center = new Vector2d(this.pos.x1+this.x1axis,this.pos.x2+this.x2axis,0);
	this.massIntertia = 2;//this.mass*()
	this.shapeData.degree = 2;
	this.shapeData.knotvec = knotvec_circ;
	this.shapeData.weights = ptsweights_circ;
	this.material = checkandYield(material,"Material");

	this.generate_circle_cpts = function(){
		var p1b= new Vector2d(this.pos.x1,                this.pos.x2+this.x2axis,     0);
        var p2b= new Vector2d(this.pos.x1,                this.pos.x2,                 0); 
        var p3b= new Vector2d(this.pos.x1+this.x1axis,    this.pos.x2,                 0); 
        var p4b= new Vector2d(this.pos.x1+2*this.x1axis,  this.pos.x2,                 0); 
        var p5b= new Vector2d(this.pos.x1+2*this.x1axis,  this.pos.x2+this.x2axis,     0); 
        var p6b= new Vector2d(this.pos.x1+2*this.x1axis,  this.pos.x2+2*this.x2axis,   0); 
       	var p7b= new Vector2d(this.pos.x1+this.x1axis,    this.pos.x2+2*this.x2axis,   0);
        var p8b= new Vector2d(this.pos.x1,                this.pos.x2+2*this.x2axis,   0);

        var ptsb= [p1b,p2b, p3b,p4b, p5b,p6b,p7b,p8b,p1b];

        for (var i = 0; i < ptsb.length; i++) {
        	ptsb[i] = (ptsb[i]).rotate(this.pos.x3,this.center);

        };
        // convert ptsb[i] from Vector2d to Array
        return ptsb;
	}
	this.shapeData.controlpoints = this.generate_circle_cpts();

	this.generateNurbsData();
	this.generateShape();
}



Ellipse.prototype = new Phys_obj;
Ellipse.prototype.constructor = Ellipse;

//Ellipse = function... proto = phys_obj

//obstacle = function no proto, no speed, mass = inifity, i.e. wall
