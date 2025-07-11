import { config as start } from 'dotenv'

start()

export const config = {
  BASE_URL: process.env.BASE_URL,
  AUTH_BASE_URL: process.env.AUTH_BASE_URL,

  USERNAME: process.env.MD_USERNAME,
  PASSWORD: process.env.MD_PASSWORD,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  GRANT_TYPE: process.env.GRANT_TYPE,
  UPLOAD_BASE_URL: process.env.UPLOAD_BASE_URL 
}
