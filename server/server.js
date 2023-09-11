import express from 'express';
import { Schema, model, connect } from 'mongoose';
import cors from 'cors';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cors()) 
// Define a Mongoose schema for user accounts
const userSchema = new Schema({
  email: String,
  password: String,
});
const adminSchema = new Schema({
  email: String,
  password: String,
});
const modelsSchema = new Schema({
  mmy:{
    make:String,
    model:String,
    year:String,
  },
  vin:{
    type:String,
    unique:true
  }
})
const enrollmentsSchema = new Schema({
  uid:String,
  status:String,
  mmy:{
    make:String,
    model:String,
    year:String,
  },
  vin:{
    prefix:String,
    suffix:String
  },
  vidictedAt:Date
}, {timestamps: {
  createdAt: 'enrollmentAt', // Use `created_at` to store the created date
}})


const User = model('users', userSchema);
const Admin = model('admins',adminSchema);
const Enrollments = model('enrollments',enrollmentsSchema)
const Models = model('models',modelsSchema)


// API Endpoints
app.get('/api/models',async(req,res)=>{
  try{
    const models=await Models.find({});
    res.json(models);
  }
  catch{
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.get('/api/pieData',async(req,res)=>{
  try{
    await Enrollments.aggregate([
      {
        $group: {
          _id: '$status', // Group by the distinct values in the 'fieldName' field
          value: { $sum: 1 }, // Count occurrences of each distinct value
        },
      },
    ])
      .exec()
      .then((result) => {
        // 'result' will contain an array of objects with distinct values and their counts
        res.json(result)
      })
      .catch((err) => {
        console.error(err);
      });
    
  }catch{
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.post('/api/addModel',async(req,res)=>{
  try{
    const {body}=req;
    const models=await Models.find({
      mmy:{
        make:body.make,
        model:body.model,
        year:body.year,
      },
      vin:body.vin
    });
    if(models.length==0){
      Models.create({
        mmy:{
          make:body.make,
          model:body.model,
          year:body.year,
        },
        vin:body.vin
      })
      return res.json({message:"Addition Successful"})
    }
    else{
      return res.status(409).json({message:"Similar Data Found"})
    }
  }
  catch{
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.post('/api/enrollment_verdict',async(req,res)=>{
  try{
    const {body}=req
    const enrollment=await Enrollments.findById(body._id);
    if(body.verdict=='accept'){
      enrollment.status="Accepted"
    }
    else{
      enrollment.status="Rejected"
    }
    enrollment.vidictedAt=new Date()
    enrollment.save()
    res.json(enrollment);
  }
  catch{
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.post('/api/enrollments',async(req,res)=>{
  try{
    const {body}=req
    const enrollments=await Enrollments.find(body);
    res.json(enrollments);
  }
  catch{
    res.status(500).json({ error: 'Internal server error' });
  }
})
app.post('/api/enroll',async(req,res)=>{
  try{
    const {body} = req;
    await Enrollments.create(
      body
    )
    res.status(200).json({})
  }
  catch{
    res.status(500).json({ error: 'Internal server error' });
  }
})

// Create a POST route to search for a user by email, username, and password
app.post('/api/search_user', async (req, res) => {
  const { body } = req;
  try {
    let user
    if(body.admin){
      user = await Admin.findOne({
        email: body.email,
        password: body.pass
      });
    }
    else{
      user = await User.findOne({
      email: body.email,
      password: body.pass
    });
  }
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If the user is found, you can send the user data in the response
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
// Connect to your MongoDB database (make sure to replace 'mongodb://localhost/your-database' with your actual database URL)
connect('mongodb+srv://Aarav-Nigam:XtwpTt4aolWGmkzn@cluster0.kd8i4tz.mongodb.net/MotorQIntern?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(()=>{
  console.log("Error!! Connecting to database")
})


