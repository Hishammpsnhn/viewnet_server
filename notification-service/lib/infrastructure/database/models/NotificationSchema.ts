import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
   
    },
    type: {
      type: String,
      enum: ['info', 'success', 'warning', 'error', 'system'],
      default: 'info',
    },
    message: {
      type: String,
      required: true,
    },
    link: {
      type: String, 
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, 
  }
);

const NotificationModel =  mongoose.model('Notification', notificationSchema);
export default NotificationModel
