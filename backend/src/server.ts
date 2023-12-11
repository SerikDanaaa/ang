
import { sample_foods, sample_tags, sample_users } from "./data";
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler';

const express = require('express')
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));

app.post("/api/users/login", (req: { body: { email: any; password: any; }; }, res: { send: (arg0: any) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
    const {email, password} = req.body;
    const user = sample_users.find(user => user.email === email 
      && user.password === password);
  
     if(user) {
      res.send(generateTokenReponse(user));
     }
     else{
       const BAD_REQUEST = 400;
       res.status(BAD_REQUEST).send("Username or password is invalid!");
     }
  
  })
  
  const generateTokenReponse = (user : any) => {
    const token = jwt.sign({
      email:user.email, isAdmin: user.isAdmin
    },"SomeRandomText",{
      expiresIn:"30d"
    });
  
    user.token = token;
    return user;
  }
  

app.get("/api/foods", (req: any, res: { send: (arg0: any[]) => void; }) => {
    res.send(sample_foods);
})

app.get("/api/foods/search/:searchTerm", (req: { params: { searchTerm: any; }; }, res: { send: (arg0: any[]) => void; }) => {
  const searchTerm  = req.params.searchTerm;
  const foods = sample_foods
  .filter(food => food.name.toLowerCase()
  .includes(searchTerm.toLowerCase()));
  res.send(foods);
})

app.get("/api/foods/tags", (req: any, res: { send: (arg0: any[]) => void; }) => {
  res.send(sample_tags);
})

app.get("/api/foods/tag/:tagName", (req: { params: { tagName: any; }; }, res: { send: (arg0: any[]) => void; }) => {
  const tagName = req.params.tagName;
  const foods = sample_foods
  .filter(food => food.tags?.includes(tagName));
  res.send(foods);
})

app.get("/api/foods/:foodId", (req: { params: { foodId: any; }; }, res: { send: (arg0: any) => void; }) => {
  const foodId = req.params.foodId;
  const food = sample_foods.find(food => food.id == foodId);
  res.send(food);
})


const port = 3000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);
})