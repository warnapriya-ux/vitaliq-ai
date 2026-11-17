import { base44 } from "@/api/base44Client";

// Private files are only reachable through a short-lived signed URL.
export async function signUri(uri) {
  if (!uri) return "";
  try {
    const { signed_url } = await base44.integrations.Core.CreateFileSignedUrl({ file_uri: uri, expires_in: 900 });
    return signed_url;
  } catch (error) {
    console.error(error);
    return "";
  }
}

export async function uploadPrivate(file) {
  const { file_uri } = await base44.integrations.Core.UploadPrivateFile({ file });
  return file_uri;
}

// Profile photos and public profile media are meant to be visible to customers.
export async function uploadPublic(file) {
  const { file_url } = await base44.integrations.Core.UploadPublicFile({ file });
  return file_url;
}