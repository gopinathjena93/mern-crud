const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const cors = require('cors')
const multer  = require('multer');
require('dotenv').config();
const fs = require('fs');


 


const storage = multer.diskStorage({
	destination: function (req,file,cb) {
		cb(null,'public/uploads/');
	},
	filename:function (req,file,cb) {
		console.log('Gopinath Jena');
		console.log(file);
		const file_extenstion = file.originalname.split('.').pop();
		console.log(file_extenstion);
		//const file_extenstion = req.file.originalname.split('.').pop();
		//cb(null,`${Date.now()}-${Math.round(Math.random() * 1E9)}.${file_extenstion}`)
		cb(null,`${Date.now()}-${Math.round(Math.random() * 1E9)}.${file_extenstion}`)
	}
});

let upload = multer({
    storage,
    limits: { fileSize: 100000 * 100 }
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

const  corsOptions = {
	origin: '*',
}
app.use(cors(corsOptions));

///app.set(express.static('uploads'));
app.use(express.static('public'))


const connectDB = require('./config/db');
connectDB();
const mongoCrud = require('./model/mongo-crud');
const PORT  = process.env.PORT || 3100;

app.get('/api/student/manage', async (req,res) => {
	console.log(req.query.page);
	const limit = parseInt(req.query.limit);
	const skip = limit * (req.query.page-1);
	allStudent = await mongoCrud.find().skip(skip).limit(limit);
	totalStudent = await mongoCrud.countDocuments();
	console.log(totalStudent);
	
	

	//allStudent.totalStudent = totalStudent;
	//allStudent = await mongoCrud.findOneAndDelete({name:"Gopinath Jena"}); // find and delete the record 
	//Student = await mongoCrud.fin({name:"Gopinath Jena"});
	//Student = await mongoCrud.fin();
	//Student = await mongoCrud.findOne({name:"Gopinath Jena"}); // find single record 
	//allStudent.map((Student,index) => {
		//console.log(Student._id)
	//});
	res.json({allStudent:allStudent,totalStudent:totalStudent});
})

app.post('/api/student/single', async (req,res) => {
	console.log(req.body.id);
	Student = await mongoCrud.findOne({_id:req.body.id});	
	console.log(process.env.APP_BASE_URL,Student.student_image);
	if(Student.student_image) Student.student_image = `${process.env.APP_BASE_URL}uploads/${Student.student_image}`;
	//console.log(Student);
	res.json(Student);
})


app.post('/api/student/add', upload.single('studentImage'), async (req,res) => {
	console.log(req.body)
	const adObj = {
		name: req.body.fullName,
		address: req.body.address,		
		roll_no: req.body.rollNo,		
		date_of_birth: req.body.dateOfBirth		
	};

	if(req.file) {
		const student_image_path = req.file.filename;
		adObj.student_image = student_image_path;			
	} 

	const mongo = new mongoCrud(adObj);	
	const response = await mongo.save();	
	console.log(req.file);	
	res.json({message:"New Record Add Successfully"})		
})

app.post('/api/student/update', upload.single('studentImage'), async (req,res) => {
	const Student = await mongoCrud.findOne({_id:req.body.id}); 
	console.log(Student)
	

	const filter = {_id : req.body.id};
	const update = {
		name: req.body.fullName,
		address: req.body.address,		
		roll_no: req.body.rollNo		
	};

	if(req.file) {
		if(Student.student_image) {
			const student_image_delete = `public/uploads/${Student.student_image}`;
			fs.unlink(student_image_delete, (err) => {
			    if (err) throw err;	  
			    console.log('File deleted!');
			});
		}	

		const student_image_path = req.file.filename;
		update.student_image = student_image_path;			
	}

	const response = await mongoCrud.findOneAndUpdate(filter, update); // update single record
	//const response = await mongoCrud.updateMany(filter, update);	// update all matching filed at a single query 
	res.json({message:"Record Update Successfully"})
})

app.get('/api/student/delete/:id', async (req,res) => {
	const Student = await mongoCrud.findOne({_id:req.params.id}); 
	console.log(Student)
	const student_image_path = `public/uploads/${Student.student_image}`;
	if(Student.student_image) {
		fs.unlink(student_image_path, (err) => {
		    if (err) throw err;		
		    console.log('File deleted!');
		});
	}
	const response = await mongoCrud.findOneAndDelete({_id:req.params.id}); // update single record
	res.json({message:"Record Deleted Successfully"})
})


app.listen(PORT, () => {
	//console.log(PORT)
	//server.close();
	console.log(`Server Start at ${PORT}`);
})





