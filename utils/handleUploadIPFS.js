const pinataUrl = "https://api.pinata.cloud/pinning/pinFileToIPFS";

const uploadToPinata = async (fileBuffer, fileName) => {
  let data = new FormData();
  const blob = new Blob([fileBuffer]);

  const metadata = JSON.stringify({
    name: fileName,
  });

  const options = JSON.stringify({
    cidVersion: 0,
  });

  data.append("file", blob, fileName);
  data.append("pinataMetadata", metadata);
  data.append("pinataOptions", options);

  try {
    const pinataApiKey = process.env.PINATA_KEY;
    const pinataSecretApiKey = process.env.PINATA_SECRET;

    const response = await fetch(pinataUrl, {
      method: "POST",
      body: data,
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    });
    if (!response.ok) {
      throw new Error("Error uploading file to Pinata: " + response.statusText);
    }
    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Error al subir al archivo a Pinata: ", err);
    throw err;
  }
};

module.exports = uploadToPinata;
