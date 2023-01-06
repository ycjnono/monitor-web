const Minio = require('minio')
const stream = require('stream')
const bucket = 'iot-monitor'

const mime = require('mime')
const minioClient = new Minio.Client({
    endPoint: '127.0.0.1',
    port: 9000,
    useSSL: true,
    accessKey: 'yGA9UqpdOuaRWpFt',
    secretKey: 'jtXWsQeDfZYXmjAQS5RSrfxQnaVsqIKr'
});



export async function putObject(fileName, filePath) {
    let fileReader = new FileReader()
    fileReader.readAsDataURL()
    let contentType = mime.getType(filePath)
    const metadata = {
        contentType: contentType
    }
    minioClient.fPutObject(bucket, fileName, filePath, metadata, function (err, etag){
        if (err != null){
            console.log(err)
            return
        }
        console.log(fileName + ":" + etag)
    })
}




