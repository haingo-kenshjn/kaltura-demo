import { NextFunction, Request, Response } from 'express';
import GenericResponseValue from '../models/response/genericResponseValue';
import mediaService from '../services/mediaService';

const RE_MIME = /^(?:multipart\/.+)|(?:application\/x-www-form-urlencoded)$/i;

const fs = require('fs');
const path = require('path')
const _tempDir = __dirname + '/tmp';

const hasBody= (req) => {
  var encoding = 'transfer-encoding' in req.headers,
      length = 'content-length' in req.headers
          && req.headers['content-length'] !== '0';
  return encoding || length;
}

const mime= (req) => {
  var str = req.headers['content-type'] || '';
  return str.split(';')[0];
}

export const getVideos= async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mediaMetadatas = await mediaService.getMedias();

        const mediaResponse = new GenericResponseValue(mediaMetadatas);
        res.json(mediaResponse.makeResponse());
      } catch (error) {
        console.log(error)
        next(error);
      }
  };

  export const getVideoById = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    try {
        const mediaMetadata = await mediaService.getMediabyExternalId(id);

        const mediaResponse = new GenericResponseValue(mediaMetadata);
        res.json(mediaResponse.makeResponse());
      } catch (error) {
        console.log(error)
        next(error);
      }
  };

  export const upload = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.method === 'GET' || req.method === 'HEAD' || !hasBody(req)|| !RE_MIME.test(mime(req))) {
            return next();    
        }

        req.pipe(req.busboy);

        var result = [];
        var number_of_files = 1;
        var counter = 0; 
        
        req.busboy.on('field', function(fieldname, val) {
          let field_obj = {}
          field_obj[fieldname] = val;
          result.push(field_obj);
          console.log(field_obj)
        });


        req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
          counter++;

          if (result.length > 0) {
            var file_type = filename.substr(filename.length - 4);
            filename = result[0].name + '_' + number_of_files + file_type;
            number_of_files++;
          }
          
          const filePath = _tempDir + '/files/' + filename;
          console.log("filePath", filePath)
          let fsStream = fs.createWriteStream(filePath);
          file.pipe(fsStream);
          
          fsStream.on('close', function () {
            counter--;
            console.log("Complete Uploading to tmp: " + filename);
            result.push({
                type: mimetype,
                encoding: encoding,
                name: filename,
                path: filePath
            });

            mediaService.uploadMedia(filePath, filename, "description")
              .then(result => {
                if(counter == 0){
                  console.log("writing finished");
                  const mediaResponse = new GenericResponseValue(result)
                  res.json(mediaResponse.makeResponse());
                }
              });

          });
        });

      } catch (error) {
        next(error);
      }
  };
  