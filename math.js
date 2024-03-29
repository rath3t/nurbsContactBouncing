
//General
var rotationmatrix =function(angle){ 
	return new Matrix2x2(Math.cos(angle), -Math.sin(angle), Math.sin(angle),Math.cos(angle));
}

var inv_rotationmatrix =function(angle){ 
	return new Matrix2x2(Math.cos(angle), Math.sin(angle), -Math.sin(angle),Math.cos(angle));
}

var compare_tol = 1e-10;
//Matrix function arguments are ordered row-wise
//arguments are always
//t      = Scalar
//Vector2d(x1,x2) ->
//  (x1)
//  (x2)
//matrix = matrix
//Matrix2x2(x1,y1,x2,y2) ->
//  (x1 y1)
//  (x2 y2)

//linear Algebra:
var convertArray2Vector = function(array){
	//test if array.length == 3
	return new Vector2d(array[0],array[1],array[2]); 
}

//angle bisector vector of 2 vectors

var biSectorVector = function(vec0,vec1){
	//test if array.length == 3
	return (vec0.normalise()).add(vec1.normalise()); 
}

var Vector2d = function(x1,x2,x3){
	this.x1 = x1;
	this.x2 = x2;
	this.x3 = x3;
	this.add = function(vector){
		return new Vector2d(this.x1+vector.x1,this.x2+vector.x2,this.x3+vector.x3);
	}
	this.sub = function(vector){
		return new Vector2d(this.x1-vector.x1,this.x2-vector.x2,this.x3);
	}
	this.norm = function(){
		return Math.sqrt(Math.pow(this.x1,2)+Math.pow(this.x2,2));
	}
	this.normalise = function(){
		return new Vector2d(this.x1/this.norm(),this.x2/this.norm(),this.x3);
	}
	this.dotProd = function(vector) {
		return this.x1*vector.x1+this.x2*vector.x2+this.x3*vector.x3;
	}
	this.multi_scalar = function(t) {
		return new Vector2d(this.x1*t,this.x2*t,this.x3*t);
	}
	this.rotate = function(angle,origin){ //rotations are always counter-clockwise 
		var rotation_matrix = new rotationmatrix(angle);
		return (rotation_matrix.multi_vec(this.sub(origin))).add(origin);
	}
	this.inv_rotate = function(angle,origin){ //rotations are always counter-clockwise 
		var rotation_matrix = new inv_rotationmatrix(angle);
		return (rotation_matrix.multi_vec(this.sub(origin))).add(origin);
	}
	this.normal_vec = function(){ // generate orthogonal vector in right-handed orientation
		return new Vector2d(-this.x2,this.x1,this.x3);
	}
	this.compare_exact = function(vector){
		if(Math.abs(this.x1- vector.x1)<compare_tol && Math.abs(this.x2- vector.x2)<compare_tol && Math.abs(this.x3- vector.x3)<compare_tol){
			return true;
		}else{
			return false;
		}
	}
	this.compare_direction = function(vector){
		var normalised = this.normalise();
		var vector_norm = vector.normalise();
		if(Math.abs(normalised.x1- vector_norm.x1)<compare_tol && Math.abs(normalised.x2- vector_norm.x2)<compare_tol){
			return true;
		}else{
			return false;
		}
	}
}


var Matrix2x2 =function(x1,y1,x2,y2){ 
	this.x1 = x1;
	this.x2 = x2;
	this.y1 = y1;
	this.y2 = y2;
	this.det = function() { //determinant of a 2x2 matrix
		return x1*y2-x2*y1;
	}
	this.multi_scalar = function(t) {
		return new Matrix2x2(this.x1*t, this.y1*t,this.x2*t,this.y2*t);
	}
	this.multi_vec = function(vector) {
		return new Vector2d(this.x1*vector.x1+this.y1*vector.x2, this.x2*vector.x1+this.y2*vector.x2,vector.x3);
	}
	this.multi_matrix = function(matrix) {
		return new Matrix2x2(this.x1*matrix.x1+this.y1*matrix.x2, this.x1*matrix.y1+this.y1*matrix.y2,this.x2*matrix.x1+this.y2*matrix.x2,this.x2*matrix.y1+this.y2*matrix.y2);
	}
	this.inv = function() {
		var matrixinv = new Matrix2x2 (this.y2,-this.y1,-this.x2,this.x1);
		return matrixinv.multi_scalar(1/this.det());
	}
	this.compare = function(matrix){
		if(Math.abs(this.x1- matrix.x1)<compare_tol && Math.abs(this.x2- matrix.x2)<compare_tol && Math.abs(this.y1- matrix.y1)<compare_tol && Math.abs(this.y2- matrix.y2)<compare_tol){
			return true;
		}else{
			return false;
		}
	}
}


var Line2d = function(normal_v,pos_vec){
	this.normal_v = normal_v;
	this.pos_vec = pos_vec;
	this.distance_point = function(pt){ //distance between line and point with hesse normal form
		return (normal_v.normalise()).dotProd(pt.sub(pos_vec));
	}
}

