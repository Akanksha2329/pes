# Thunder Test Flow (Primary)

## What This Flow Tests
This is an end-to-end backend integration flow that validates:
- role-based authentication
- admin setup (course and batch)
- teacher exam lifecycle entry point
- student submission path
- peer-evaluation assignment and completion
- result and dashboard outputs

## Preconditions
- Backend is running on `http://localhost:5000`
- MongoDB connection is healthy
- `backend/sample-upload.pdf` exists for upload testing
- Thunder Client is installed
- Postman is available for Step 9 file upload (multipart form-data)

## Token Rule
For protected endpoints, add header:
`Authorization: Bearer <token>`

## Detailed Flow

1. Health Check
- Method: `GET`
- Endpoint: `/health`
- Auth: none
- Expect: `200`, body contains `status: ok`

2. Register Users
- Method: `POST`
- Endpoint: `/api/auth/register`
- Auth: none
- Body: JSON (use `SAMPLE_DATA.md` users)
- Expect: success or `User already exists`

3. Login Users and Save Tokens
- Method: `POST`
- Endpoint: `/api/auth/login`
- Auth: none
- Body: JSON (`email`, `password`)
- Save: `adminToken`, `teacherToken`, `student1Token`, `student2Token`
- Expect: `200` and `token`

4. Create Course (Admin)
- Method: `POST`
- Endpoint: `/api/admin/courses`
- Auth: admin token
- Body: JSON (see `SAMPLE_DATA.md`)
- Save: `courseId`
- Expect: `201`

5. Fetch Users (Admin)
- Method: `GET`
- Endpoint: `/api/admin/users`
- Auth: admin token
- Save: `teacherUserId`, `student1UserId`, `student2UserId`
- Expect: `200`

6. Create Batch (Admin)
- Method: `POST`
- Endpoint: `/api/admin/create-batch-with-names`
- Auth: admin token
- Body: includes `batchName`, `courseId`, `instructorId`, `students`
- Save: `batchId`
- Expect: `201`

7. Verify Teacher Course Mapping
- Method: `GET`
- Endpoint: `/api/teacher/courses`
- Auth: teacher token
- Expect: `200` and matching course/batch

8. Create Exam (Teacher)
- Method: `POST`
- Endpoint: `/api/teacher/exams`
- Auth: teacher token
- Body: JSON (see `SAMPLE_DATA.md`)
- Save: `examId`
- Expect: `201` with `examId`

9. Submit Answer (Student 1)
- Tool: Postman (only this step)
- Method: `POST`
- Endpoint: `/api/student/submit-answer`
- Auth: student1 token
- Body type: `form-data`
- Fields:
  - `examId` (Text)
  - `pdf` (File)
- File: `backend/sample-upload.pdf`
- Expect: success message

10. Submit Answer (Student 2)
- Repeat Step 9 with `student2Token`

11. Initiate Peer Evaluation (Teacher)
- Method: `POST`
- Endpoint: `/api/teacher/initiate-evaluation`
- Auth: teacher token
- Body: `{ "examId": "<examId>" }`
- Expect: `200` and assignment receipt

12. Fetch Pending Evaluations (Student 1)
- Method: `GET`
- Endpoint: `/api/student/pending-evaluations`
- Auth: student1 token
- Save: `evaluationId`
- Expect: `200` and at least one evaluation

13. Submit Peer Evaluation (Student 1)
- Method: `POST`
- Endpoint: `/api/student/submit-peer-evaluation`
- Auth: student1 token
- Body: `evaluationId`, `marks`, `feedback`
- Expect: `200`

14. Verify Outputs
- Method: `GET`
- Endpoints:
  - `/api/student/results` (student2 token)
  - `/api/teacher/dashboard-stats` (teacher token)
- Expect: `200`

## Common Failures and Meaning
- `401`: token missing/invalid or wrong role
- `403`: exam submission/evaluation window or permission constraints
- `404`: invalid ID (`courseId`, `batchId`, `examId`, `evaluationId`)
- `409`: duplicate submission or duplicate resource
- `500`: server-side error (check backend terminal stack trace)
