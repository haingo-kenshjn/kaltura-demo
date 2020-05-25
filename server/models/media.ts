import { EntryStatus } from '../commons/const'

let mongoose = require ('mongoose');
let ObjectId = mongoose.Schema.ObjectId;

const mediaSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId , auto: true },
    externalId: { type : String , unique : true, required : true },
    name: String,
    cdnUrl: String,
    thumbnailUrl: String,
    status: {type: String, enum: Object.values(EntryStatus) }
  },
  { timestamps: true },
);


mediaSchema.statics.findAll = async function () {
  let medias = await this.find({
  });
 
  return medias;
};

mediaSchema.statics.findById = async function (id) {
  let media = await this.findOne({
    _id: id,
  });
 
  return media;
};

mediaSchema.statics.findByExternalAndUpdate = async function (externalId, newData) {
  let media = await this.findOneAndUpdate({
    externalId: externalId,
  }, 
  newData, {upsert: false});
 
  return media;
};

mediaSchema.statics.findByExternalId = async function (externalId) {
  let media = await this.findOne({
    externalId: externalId,
  });
 
  return media;
};

const Media = mongoose.model('media', mediaSchema);

export default Media
