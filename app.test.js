const request = require('supertest');
const app = require('./server');

// Test case for successful user registration
test('POST /api/signup should register a new user successfully', async () => {
  const userData = {
    first_name: 'Robert',
    last_name: 'Parker',
    password: 'SpideyIron2024',
    email: 'robert.parker'+Math.floor(Math.random()*90000) + 10000 +'@spidey.com',
    phone_number: '1234567890'
  };

  // Send a POST request to the '/api/signup' endpoint with the user data
  const response = await request(app)
    .post('/api/signup')
    .send(userData)
    .expect(200); // Expect a 200 OK response
  // Verify the response contains the expected data
  expect(response.body).toEqual({
    status : 200,
    success: true,
    response: expect.any(Object) // Specify the expected structure of the response
  });
});

// Test case for failed user registration
test('POST /api/signup should handle a failed user registration', async () => {
  const invalidUserData = {
    // Missing required fields or invalid data to simulate a failed user registration
  };

  const response = await request(app)
    .post('/api/signup')
    .send(invalidUserData)
    .expect(500); 
    
  // Verify the response contains the expected data for a failed user registration
  expect(response.body).toEqual({
    success: false,
    error: expect.any(String) // Specify the expected structure of the error response
  });
});
