import User from "../models/user";
import {Request, Response} from "express";

const getCurrentUser =async (req: Request, res: Response) => {
    try{

        const currentUser = await User.findOne({ _id: req.userId });
        if(!currentUser){
            return res.status(404).json({ message:"User not found" });
        }
        res.json(currentUser);
    } catch(error){
        console.log(error);
        return res.status(500).json({ message: "Something went wrong"});
    }
};

const createCurrentUser = async (req: Request, res: Response) => {
    //1. check if the user exists
    //2. create the user if it doesn't exist
    //3. return the user object to the calling client
    console.log("Request received for user creation");
    console.log("Authorization Header:", req.headers.authorization);
    console.log("Audience:", process.env.AUTH0_AUDIENCE);

    try{

        const{auth0Id} = req.body;

        // Check if the user exists
        const existingUser = await User.findOne({auth0Id});

        if(existingUser){
            console.log("User already exists:", existingUser);
            return res.status(200).send();
        }

         // Create the user if it doesn't exist
        const newUser = new User(req.body);
        await newUser.save();
        console.log("New User created:", newUser);

        res.status(201).json(newUser.toObject());

    }catch(error){
        console.log(error);
        console.error("Error creating user:", error);
        res.status(500).json({message: "Error creating user"});
    }
};

const updateCurrentUser = async (req: Request, res:Response) => {
    try{
        const{name, addressLine1, country, city} = req.body;
        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        user.name = name;
        user.addressLine1 = addressLine1;
        user.city = city;
        user.country = country;

        await user.save();

        res.send(user);

    } catch (error) {
        console.log(error)
res.status(500).json({message: "Error updating user"});
    }
}

export default{
    getCurrentUser,
    createCurrentUser,
    updateCurrentUser,
};