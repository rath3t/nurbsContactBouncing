
//General
//Matrix function arguments are ordered row-wise
//arguments are always
//t      = Scalar
//vector = vector
//vector2d(x1,x2) ->
//  (x1)
//  (x2)
//matrix = matrix
//matrix2x2(x1,y1,x2,y2) ->
//  (x1 y1)
//  (x2 y2)
//angle  = angle

var vector2d = function(x1,x2){
	return {
		x1: x1,
		x2: x2,
		add: function(vector){
			return new vector2d(this.x1+vector.x1,this.x2+vector.x2)
		},
		sub: function(vector){
			return new vector2d(this.x1-vector.x1,this.x2-vector.x2)
		},
		scalarProd: function(vector) {
			return this.x1*vector.x1+this.x2*vector.x2;
		},
		scalarmulti: function(t) {
			return new vector2d(this.x1*t,this.x2*t);
		},

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
			return new vector2d(this.x1*vector.x1+this.y1*vector.x2, this.x2*vector.x1+this.y2*vector.x2);

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

var rotationmatrix =function(angle){ 
		return new matrix2x2(Math.cos(angle), Math.sin(angle), -Math.sin(angle),Math.cos(angle));
}

var rotate_vec = function(angle,vector){
	var rotationmatrix = new rotationmatrix(angle);
	return new vector2d(rotation_matrix.get().multi_vec(vector));
}

//var rotate_vec_inv = function(angle,vector){
//	var rotationmatrix = new rotationmatrix(angle).inv();
//
//	return new vector2d(rotationmatrix.multi_vec(vector));
//}