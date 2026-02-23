import { connect } from "@/dbConfig/dbConfig";
import  User from "@/models/userModel"
import { NextResponse } from 'next/server'
import bcryptjs from 'bcryptjs'
import { sendEmail } from "@/helpers/mailer";


connect()

export async function POST(request) {

    try{
    
        const reqBody = await request.json()
        const {username, email, password} = reqBody

        const isAdminEmail = process.env.ADMIN_EMAIL;

        const role = email === isAdminEmail ? "admin" : "user"
        
        if(!username || !email || !password){
            return NextResponse.json(
                {error: "All feilds are required"},
                {status: 400}
            )
        }

        console.log("USERNAME: ", username)

        const user = await User.findOne({email})

        if(user){
            return NextResponse.json({error: "user already exists"}, {status:400})
        }

        const salt = await bcryptjs.genSaltSync(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new User({
            userName : username,
            email,
            password: hashedPassword,
            role
        })

        const savedUser = await newUser.save()
        console.log(savedUser)

        await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

        return NextResponse.json({
            message : "User Registered Successfully",
            success: true,
            savedUser
        })
    }
    catch(error){
        console.log("FULL ERROR: ", error)
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}