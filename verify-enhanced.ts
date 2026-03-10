import axios from 'axios';

async function verifyEnhancedSignup() {
  const email = `enhanced_${Date.now()}@example.com`;
  const password = "password123";
  
  console.log(`Attempting enhanced signup for ${email}...`);
  try {
    const res = await axios.post('http://localhost:3000/api/auth/signup', {
      email,
      password
    });
    console.log("Signup success!");
    const user = res.data.user;
    
    // Verify presence of new fields
    const expectedFields = ['name', 'profilePicture', 'dietType', 'skillLevel', 'cuisinePreferences'];
    let allPresent = true;
    expectedFields.forEach(field => {
      if (user[field] === undefined) {
        console.error(`❌ Field missing: ${field}`);
        allPresent = false;
      } else {
        console.log(`✅ Field present: ${field} = ${JSON.stringify(user[field])}`);
      }
    });

    if (allPresent) {
      console.log("🚀 Enhanced signup verification PASSED!");
    } else {
      console.error("❌ Enhanced signup verification FAILED!");
    }
  } catch (err: any) {
    console.error("Signup failed:", err.response?.data?.message || err.message);
  }
}

verifyEnhancedSignup();
