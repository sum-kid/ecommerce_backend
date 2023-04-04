const mongoose=require('mongoose');

mongoose.set('strictQuery',true);

const addressSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    //minLength validator isn't working
    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      minLength:10,
      maxLength:10
    },
    pinCode: {
      type: String,
      required: true,
      trim: true,
      validate:[function(){
        return this.pinCode.length==6;
      },"Valid PinCode is required"]
    },
    locality: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    cityDistrictTown: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      required: true,
    },
    landmark: {
      type: String
    },
    alternatePhone: {
      type: String,
    },
    addressType: {
      type: String,
      enum: ["home", "work"],
    },
  });

const userAddressSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    address:[addressSchema]
});  

const addressModel=mongoose.model('addressModel',userAddressSchema);

module.exports=addressModel;