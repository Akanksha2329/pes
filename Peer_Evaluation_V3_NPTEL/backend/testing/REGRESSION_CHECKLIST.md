# Quick Regression Checklist

## Objective
Fast go/no-go check before demo or PR. Confirms backend is healthy and critical paths are not broken.

## Estimated Time
5-10 minutes

## Checks
1. Start server
- Command: `npm run dev`
- Pass: server starts, DB connects, no crash

2. Health endpoint
- Request: `GET /health`
- Pass: `200`

3. Login
- Request: `POST /api/auth/login` with known credentials
- Pass: `200` with token

4. Protected route
- Request: `GET /api/student/profile` with Bearer token
- Pass: `200`

5. File upload path
- Request: `POST /api/student/submit-answer` (multipart form-data in Postman)
- Pass: success message

6. Teacher dashboard
- Request: `GET /api/teacher/dashboard-stats` with teacher token
- Pass: `200`

## Pass Criteria
- All checks pass
- No unhandled error stack in backend terminal

## If Any Check Fails
Capture and attach:
- endpoint + method
- request payload (if applicable)
- status code
- response body
- backend terminal error
