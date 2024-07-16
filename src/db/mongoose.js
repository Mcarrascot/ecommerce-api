import mongoose from 'mongoose';

const connectDB = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }, () => {
      console.log("Base de datos conectada")
    })
  } catch (error) {
    console.log('Error connecting to database', error);
    process.exit(1) 
  }

}

export default connectDB;