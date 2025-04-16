// This is the code that will run on Vercel's server
export default async (req, res) => {
    // We only want to process messages that are sent using the POST method
    if (req.method === 'POST') {
      // The secret message the user typed will be in the 'body' of the request
      const { secret } = req.body;
  
      // This is where we'll get the real secret from Vercel's secure storage
      // We'll set this up in the Vercel dashboard later
      const correctSecret = process.env.SECRET_CODE;
  
      // Now, let's check if the user's secret matches the real secret
      // We'll also make sure the user actually typed something (.trim())
      // and we'll ignore whether they used uppercase or lowercase (.toLowerCase())
      if (secret && secret.toLowerCase().trim() === correctSecret) {
        // If the secret is correct, we'll send back a success message
        // and also tell the browser where to go next ('/index.html')
        res.status(200).json({ success: true, redirectUrl: '/index.html' });
      } else {
        // If the secret is wrong, we'll send back an error message
        res.status(401).json({ success: false, message: 'Incorrect secret.' });
      }
    } else {
      // If the browser sends a message using a different method (not POST),
      // we'll tell it that's not allowed
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  };