import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_R2_ACCESS_KEY_ID = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const CLOUDFLARE_R2_SECRET_ACCESS_KEY = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const CLOUDFLARE_R2_BUCKET = "ourbnb";

// Endpoint para la API S3 de Cloudflare R2 (solo account_id, sin bucket)
const CLOUDFLARE_R2_ENDPOINT = `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// Endpoint público para acceso a objetos, debe configurarse en .env
const CLOUDFLARE_R2_PUBLIC_ENDPOINT = process.env.CLOUDFLARE_R2_PUBLIC_ENDPOINT;

if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_R2_ACCESS_KEY_ID || !CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
  throw new Error('Faltan las variables de entorno necesarias para Cloudflare R2');
}

if (!CLOUDFLARE_R2_PUBLIC_ENDPOINT) {
  throw new Error('Falta la variable de entorno CLOUDFLARE_R2_PUBLIC_ENDPOINT');
}

const s3Client = new S3Client({
  region: "auto",
  endpoint: CLOUDFLARE_R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const uploadImageToR2 = async (fileBuffer: Buffer, filename: string, mimeType: string): Promise<string> => {
  const command = new PutObjectCommand({
    Bucket: CLOUDFLARE_R2_BUCKET,
    Key: filename,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "public-read",
  });

  try {
    await s3Client.send(command);
    // Construir la URL pública usando el endpoint público configurado
    const publicUrl = `${CLOUDFLARE_R2_PUBLIC_ENDPOINT}/${filename}`;
    return publicUrl;
  } catch (error: any) {
    throw new Error(`Error subiendo imagen a Cloudflare R2: ${error.message}`);
  }
};

export { uploadImageToR2 };
