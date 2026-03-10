import axios from 'axios';

async function testSignupSpecific() {
  const email = "sudam456@gmail.com";
  const password = "password123";
  
  console.log(`Attempting signup for ${email}...`);
  try {
    const res = await axios.post('http://localhost:3000/api/auth/signup', {
      email,
      password
    });
    console.log("Signup success!", res.data);
  } catch (err: any) {
    if (err.response) {
      console.error("Signup failed with status:", err.response.status);
      console.error("Response data:", err.response.data);
    } else {
      console.error("Signup failed (No response):", err.message);
    }
  }
}

testSignupSpecific();
