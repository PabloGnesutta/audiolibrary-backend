const AWS = require('aws-sdk');

// esta instanciacion podria estar encapsulada en un StorageFactory para abstraernos del provedor
const s3Endpoint = new AWS.Endpoint(
  `${process.env.S3_REGION}.digitaloceanspaces.com`
);
const audioLibraryBucket = process.env.S3_SPACE_NAME;
const s3 = new AWS.S3({
  endpoint: s3Endpoint,
  accessKeyId: process.env.S3_KEY,
  secretAccessKey: process.env.S3_SECRET,
  region: process.env.S3_REGION,
  signatureVersion: 'v4',
});

class AmazonS3Helper {
  static uploadDataToBucket(params) {
    params.Bucket = audioLibraryBucket;
    return new Promise((resolve, reject) => {
      s3.upload(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  static deleteFile(params) {
    params.Bucket = audioLibraryBucket;
    return new Promise((resolve, reject) => {
      s3.deleteObject(params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  static getSignedUrl(type, params) {
    params.Bucket = audioLibraryBucket;
    return new Promise((resolve, reject) => {
      s3.getSignedUrl(type, params, (error, data) => {
        if (error) {
          reject(error);
        } else {
          console.log('signedurl data', data);
          resolve(data);
        }
      });
    });
  }
}

module.exports = AmazonS3Helper;
