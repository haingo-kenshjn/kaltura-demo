interface EnvProfile {
  NODE_ENV?: string;
  PORT?: number;
  KALTURA_SECRET: string,
  KALTURA_USER_ID: string,
  KALTURA_PARTNER_ID: number,
  KALTURA_EXPIRY: number,
  CALLBACK_URL?: string,
  USER?: string,
  PASSWORD?: string,
  NOTIFICATION_ROUTE : string,
  MONGO_URL : string
}
const localProfile = {
  NODE_ENV: 'local',
  PORT: 5000,
  KALTURA_SECRET: "bedbcf0e53c1762bb34c91b7b18c08b2",
  KALTURA_USER_ID: "ngohai.kenshjn@gmail.com",
  KALTURA_PARTNER_ID: 2829381,
  KALTURA_EXPIRY: 3600,
  USER: "user",
  PASSWORD: "password",
  NOTIFICATION_ROUTE : "/notification",
  MONGO_URL : "mongodb://localhost:27017/sqwift"
} as EnvProfile;

const allProfiles = [localProfile] as EnvProfile[];

const getProfile = (): EnvProfile => {
  const nodeEnv = process.env.NODE_ENV || 'local';
  const pickedProfile = allProfiles.find((profile) => {
    return profile.NODE_ENV === nodeEnv;
  });
  if (pickedProfile) {
    return pickedProfile;
  } else {
    return localProfile;
  }
};

export default {
  getProfile,
};
