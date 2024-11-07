import axios from 'axios';
import Pond from '../models/pondModel.js'; 
import dotenv from 'dotenv';
import twilio from 'twilio';
dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const createPond = async (req, res) => {
  try {
    const { _id: userId } = req.user; 
    const { name, pondArea, pondDepth, cultureSystem, speciesCulture, stockingDensity, feedType, lastTestDate } = req.body;
    
    if (!name || !pondArea || !pondDepth || !cultureSystem || !speciesCulture || !stockingDensity || !feedType) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const pondData = {
      name,
      pondArea,
      pondDepth,
      cultureSystem,
      speciesCulture,
      stockingDensity,
      feedType,
      userId,
      lastTestDate: lastTestDate ? new Date(lastTestDate) : null
    };

    const newPond = await Pond.create(pondData);
    res.status(201).json(newPond);
  } catch (error) {
    console.error('Error creating pond:', error.message); 
    res.status(400).json({ message: error.message });
  }
};

export const getAllPonds = async (req, res) => {
  try {
    const userId = req.user._id; 
    const ponds = await Pond.find({ userId });
    res.status(200).json(ponds);
  } catch (error) {
    console.error('Error fetching ponds:', error.message); 
    res.status(500).json({ message: 'Failed to fetch ponds.' });
  }
};

export const deletePond = async (req, res) => {
  try {
    const { _id: userId } = req.user; 
    const { pondId } = req.params;

    const pond = await Pond.findById(pondId);

    if (!pond) {
      return res.status(404).json({ message: "Pond not found" });
    }

    if (!pond.userId.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to delete this pond" });
    }

    await Pond.findByIdAndDelete(pondId);
    res.status(200).json({ message: "Pond deleted successfully" });
  } catch (error) {
    console.error('Error deleting pond:', error.message);
    res.status(400).json({ message: error.message });
  }
};

export const updatePond = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { pondId } = req.params;
    const updatedData = req.body;

    const pond = await Pond.findById(pondId);

    if (!pond) {
      return res.status(404).json({ message: "Pond not found" });
    }

    if (!pond.userId.equals(userId)) {
      return res.status(403).json({ message: "Not authorized to update this pond" });
    }

    const updatedPond = await Pond.findByIdAndUpdate(pondId, updatedData, { new: true });
    res.status(200).json(updatedPond);
  } catch (error) {
    console.error('Error updating pond:', error.message); 
    res.status(400).json({ message: error.message });
  }
};

export const updatePondTestDate = async (req, res) => {
  try {
    const { pondId } = req.params;
    console.log("Triggered.............");
    const startTime = Date.now(); 

    const updatedPond = await Pond.findByIdAndUpdate(
      pondId,
      { lastTestDate: new Date() },
      { new: true } 
    ).populate('userId');


    const dbOperationTime = Date.now() - startTime; 
    console.log(`Time taken for DB operation: ${dbOperationTime}ms`);

    if (!updatedPond) {
      return res.status(404).json({ message: 'Pond not found' });
    }

    const phoneNumber = updatedPond.userId.phone;
    const pondName = updatedPond.name;

    scheduleTestReminderSMS(phoneNumber, pondName)
    .then(() => {
      console.log('SMS sent successfully');
    })
    .catch((error) => {
      console.error('Failed to send SMS:', error);
    });

  console.log(`Time taken for DB operation: ${Date.now() - startTime}ms`);

    res.status(200).json({ message: 'Pond test date updated and SMS sent successfully', pond: updatedPond });
  } catch (error) {
    console.error('Error updating pond test date:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkPondTimers = async (req, res) => {
  try {
    const ponds = await Pond.find().populate('userId');
    const now = Date.now();

    const overduePonds = ponds.filter(pond => {
      const lastTestDate = new Date(pond.lastTestDate);
      return (now - lastTestDate.getTime()) >= 864000000; 
    });

    for (const pond of overduePonds) {
      if (pond.userId && pond.userId.phone) {
        await finalSendTestReminderSMS(pond.userId.phone, pond.name);
      }
    }

    res.status(200).json({ message: 'Checked all pond timers and sent SMS for overdue tests' });
  } catch (error) {
    console.error('Error checking pond timers:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const finalSendTestReminderSMS = async (phoneNumber, pondName) => {
  try {
    const username = process.env.SMS_API_USERNAME;
    const password = process.env.SMS_API_PASSWORD;
    const apiUrl = `http://web.smsgw.in/smsapi/httpapi.jsp?username=${username}&password=${password}&from=CENUNI&to=${phoneNumber}&text=Dear Candidate, Reminder... It's time to test the pond '${pondName}' Centurion University&coding=0&pe_id=1001349507132979670&template_id=1007969925263833257`;

    const response = await axios.get(apiUrl);
    console.log('SMS sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('SMS sending failed');
  }
};

export const sendTestReminderSMS = async (phoneNumber, pondName) => {
  try {
    const message = await client.messages.create({
      body: `Reminder: It's time to test the pond '${pondName}'!`,
      from: TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log('SMS sent:', message.sid);
    return message.sid;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('SMS sending failed');
  }
};

export const scheduleTestReminderSMS = async (phoneNumber, pondName) => {
  try {
  const username = process.env.SMS_API_USERNAME; 
  const password = process.env.SMS_API_PASSWORD;
  const apiUrl = `http://web.smsgw.in/smsapi/httpapi.jsp?username=${username}&password=${password}&from=CENUNI&to=${phoneNumber}&text=Dear Candidate, Your test is scheduled for pond '${pondName}' Centurion University&coding=0&pe_id=1001349507132979670&template_id=1007222102798000923`;
  const response = await axios.get(apiUrl);
  console.log('SMS sent successfully:', response.data); 
  return response.data;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    throw new Error('SMS sending failed');
  }
};


export const getPondsByUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const ponds = await Pond.find({ userId: userId }); 
    res.status(200).json(ponds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ponds for user' });
  }
};