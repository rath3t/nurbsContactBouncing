
//General
var rotationmatrix =function(angle){ 
	return new matrix2x2(Math.cos(angle), -Math.sin(angle), Math.sin(angle),Math.cos(angle));
}

var inv_rotationmatrix =function(angle){ 
	return new matrix2x2(Math.cos(angle), Math.sin(angle), -Math.sin(angle),Math.cos(angle));
}
//Matrix function arguments are ordered row-wise
//arguments are always
//t      = Scalar
//vector2d(x1,x2) ->
//  (x1)
//  (x2)
//matrix = matrix
//matrix2x2(x1,y1,x2,y2) ->
//  (x1 y1)
//  (x2 y2)

var vector2d = function(x1,x2,x3){
	return {
		x1: x1,
		x2: x2,
		x3: x3,
		add: function(vector){
			return new vector2d(this.x1+vector.x1,this.x2+vector.x2,this.x3);
		},
		sub: function(vector){
			return new vector2d(this.x1-vector.x1,this.x2-vector.x2,this.x3);
		},
		norm: function(){
			return Math.sqrt(Math.pow(this.x1,2)+Math.pow(this.x2,2));
		},
		normalise: function(){
			return new vector2d(this.x1/this.norm(),this.x2/this.norm(),this.x3);
		},
		scalarProd: function(vector) {
			return this.x1*vector.x1+this.x2*vector.x2;
		},
		multi_scalar: function(t) {
			return new vector2d(this.x1*t,this.x2*t,this.x3);
		},
		rotate: function(angle,origin){ //rotations are always counter-clockwise 
			var rotation_matrix = new rotationmatrix(angle);
			return (rotation_matrix.multi_vec(this.sub(origin))).add(origin);
		},
		inv_rotate: function(angle,origin){ //rotations are always counter-clockwise 
			var rotation_matrix = new inv_rotationmatrix(angle);
			return (rotation_matrix.multi_vec(this.sub(origin))).add(origin);
		},
		normal_vec: function(){ // generate orthogonal vector in right-handed orientation
			return new vector2d(-this.x2,this.x1,this.x3);
		}
	}
}

var matrix2x2 =function(x1,y1,x2,y2){ 
	return {
		x1: x1,
		x2: x2,
		y1: y1,
		y2: y2,
		get_det: function( ) { //determinant of a 2x2 matrix
			return x1*y2-x2*y1;

		},
		multi_scalar: function(t) {
			return new matrix2x2(this.x1*t, this.y1*t,this.x2*t,this.y2*t);
		},
		multi_vec: function(vector) {
			return new vector2d(this.x1*vector.x1+this.y1*vector.x2, this.x2*vector.x1+this.y2*vector.x2,vector.x3);

		},
		multi_matrix: function(matrix) {
			return new matrix2x2(this.x1*matrix.x1+this.y1*matrix.x2, this.x1*matrix.y1+this.y1*matrix.y2,this.x2*matrix.x1+this.y2*matrix.x2,this.x2*matrix.y1+this.y2*matrix.y2);

		},
		inv: function() {
			var matrixinv = new matrix2x2 (this.y2,-this.y1,-this.x2,this.x1);
			return matrixinv.multi_scalar(1/this.get_det());
		}
	}
}

var line2d = function(normal_v,pos_vec){
	return{
		distance_point: function(pt){ //distance between line and point with hesse normal form
			return normal_v.normalise().scalarProd(pt.sub(pos_vec));
		}
	}
}


