import mongoose from 'mongoose';
import dotenv from 'dotenv';
import chalk from 'chalk';

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI as string, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log(
    chalk.bold.underline.blue(`Mongo DB connected ${conn.connection.host}`),
  );
};

export default connectDB;
