


export const getTokenRequest = async (req, res) => {
    try {
        // Base64 encode the key and secret
        const credentials = Buffer.from(`${process.env.BUNI_USERNAME}:${process.env.BUNI_PASSWORD}`).toString('base64');
        const tokenurl = process.env.BUNI_TOKEN_REQUEST_URL;
        const token = await fetch(tokenurl,{
            method: "POST",
            headers: {
                "Authorization": `Basic ${credentials} `,
            }
        })
        const tokenData = await token.json();
        console.log(tokenData.access_token);
        localStorage.setItem("AuthToken",tokenData.access_token);
      console.log(token)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
getTokenRequest()



export const STKpush = async(req, res) => {
    try {
        const token = localStorage.getItem("AuthToken");
        const response = await fetch(process.env.STK_PUSH_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token} `,
            }
        });
        const responseData = await response.json();
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
};