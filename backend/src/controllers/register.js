const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const RegisterModel = require('../models/model');
const DataModel = require('../models/energy_data');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = "jwt_secret_key";

module.exports.signup =  async (req, res) => {
    const { name, email, password } = req.body;

    try {
       
        const existingUser = await RegisterModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

       
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await RegisterModel.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "Account created successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.auth_check = (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Not authenticated" });
    }

    try {
        jwt.verify(token, JWT_SECRET);
        res.status(200).json({ isAuthenticated: true });
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie("token", { path: '/' }); // Ensure the path matches the one used when setting the cookie
    res.status(200).json({ message: 'Logged out successfully' });
};

module.exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await RegisterModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
         if (!user.isVerified) {
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        
        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "1h" });

       
         // Set the cookie and send the response
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Use false for localhost
            sameSite: 'lax', // Lax provides better usability while still being reasonably secure
            maxAge: 1 * 60 * 60 * 1000, // 1 hr
        });
        
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.SendOtp = async(req,res)=>{
    const{email} = req.body;
    try{
    const user = await RegisterModel.findOne({email})
    if (!user) {
        // User not found
        return res.status(404).json({ message: 'User not found' });
    }
    function generateOtp() {
        return Math.floor(1000 + Math.random() * 9000);
      }
      
      const verifyotp = generateOtp();   

      const otpExpire = Date.now() + 5 * 60 * 1000;  // we are using it for 5min
      
      const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'apikey', // Replace with your Gmail
            pass: process.env.SENDGRID_API_KEY,
             // Replace with your email password or app-specific password
        }
        
    });

    // Email options
    const mailOptions = {
        from: 'v44975757@gmail.com',
        to: user.email,
        subject: 'StudyBuddies - veify with otp',
        html: `<h3>Your One Time Password (OTP): ${verifyotp} </h3>
               <p>OTP is valid only for 05:00 mins. Do not share this OTP with anyone.</p>`
      
   };
    await transporter.sendMail(mailOptions);
    user.otp = verifyotp;
    user.otpExpires = otpExpire; // Set expiration time
    await user.save();
   return res.status(200).json({ message: "OTP sent successfully!" });
    } 
catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: "Failed to send OTP." });
}

};

module.exports.verifyotp = async(req,res)=>{

    const{ email, otp} = req.body;
    try {
        const user = await RegisterModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
  
        if (user.otp === otp && user.otpExpires > Date.now()) {
            user.isVerified = true;
            user.otp = undefined; //we are Clearing otp after successful verification
            user.otpExpires = undefined; // Clearing expiration time
            await user.save();
    
        return res.status(200).json({ message: "User verified successfully!" });
       }
   else {
   return res.status(400).json({ message: "Invalid OTP." });
  }}catch (error) {
    console.error('Error verifying OTP:', error);
   return res.status(500).json({ message: "Verification failed." });
}

};

module.exports.forgotpassword = async (req, res) => {
    const { email } = req.body;

    try {
        
        const user = await RegisterModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Email not found' });
        }

        
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "15min" });

       
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'saitejathota877@gmail.com', // Replace with your Gmail
                pass: 'khhtzzbxdlzuxfuz'
                 // Replace with your email password or app-specific password
            }
        });

        // Email options
        const mailOptions = {
            from: 'saitejathota877@gmail.com',
            to: user.email,
            subject: 'StudyBuddies - reset password',
           // text: `Click on the link to reset your password: http://localhost:5173/reset-password/${user._id}/${token}`
           html: `
           <h3>Reset Your Password</h3>
           <p>Click the link below to reset your password:</p>
           <a href="http://localhost:5173/reset-password/${user._id}/${token}">Reset Password</a>
           <p>Reset Link is valid for only 15:00 min.</p>`
       };
       // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Error sending email" });
            } else {
                return res.status(200).json({ message: "Password reset link sent successfully" });
            }
        });

    } 
    catch (err) {
        console.error("Error in /forgot-password:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



module.exports.passwordReset = async (req, res) => {
    const { id, token } = req.params;


    const { password } = req.body;
    
     jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            return res.json({ status: "error with token" });
        }

        try {
            
            const hashedPassword = await bcrypt.hash(password, 10);
            //console.log("Hashed Password:", hashedPassword);
            const user = await RegisterModel.findById(id);
            if (!user) {
                return res.status(404).json({ status: "User not found" });
            }
            
            await RegisterModel.findByIdAndUpdate(id, { password: hashedPassword },{ new: true });
           

            res.json({ status: "Password successfully updated" });
        } 
        catch (error) {
            res.json({ status: error.message || "An error occurred" });
        }
    });
};

// single latest data
module.exports.latest_data = async (req, res) => {
    try {
        const latestEntry = await DataModel.findOne().sort({ date: -1 }); // Sort by date descending and get the latest
        if (!latestEntry) return res.status(404).json({ message: 'No entries found' });
        res.json(latestEntry);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//data of 30 entries only
module.exports.data = async (req, res) => {
    try {
      const data = await DataModel.find().sort({ date: -1 }).limit(30); // Fetch last 30 records
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
};

//all data
module.exports.all_data = async (req, res) => {
    try {
      const data = await DataModel.find({});
      res.json(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  // Get all alerts
module.exports.alerts = async (req, res) => {
    try {
        const alerts = await DataModel.find({ efficiencyScore: { $gt: 1 } }); // Fetch alerts above threshold
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update alert resolution
module.exports.alert_id = async (req, res) => {
    try {
        const alert = await DataModel.findById(req.params.id);
        if (!alert) return res.status(404).json({ message: 'Alert not found' });

        alert.resolution = req.body.resolution;
        alert.actionRequired = req.body.actionRequired; // If you want to track actions taken
        await alert.save();
        console.log('Alert updated:', alert);
        res.json(alert);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};