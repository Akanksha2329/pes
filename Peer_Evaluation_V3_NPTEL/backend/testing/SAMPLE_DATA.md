# Sample Test Data

## Purpose
Use these stable credentials and payload templates to keep testing repeatable across teammates and sessions.

## Base URL
`http://localhost:5000`

## Test Users
- Admin: `admin1@mail.com` / `Pass1234`
- Teacher: `teacher1@mail.com` / `Pass1234`
- Student 1: `student1@mail.com` / `Pass1234`
- Student 2: `student2@mail.com` / `Pass1234`

## Register Request Body Template
```json
{
  "name": "<Name>",
  "email": "<email>",
  "password": "Pass1234",
  "role": "admin|teacher|student"
}
```

## Login Request Body Template
```json
{
  "email": "<email>",
  "password": "Pass1234"
}
```

## Create Course Request Body
```json
{
  "name": "Software Engineering",
  "code": "SE101",
  "startDate": "2026-03-01",
  "endDate": "2026-12-01"
}
```

## Create Batch Request Body
```json
{
  "batchName": "SE101-A",
  "courseId": "<courseId>",
  "instructorId": "<teacherUserId>",
  "students": ["<student1UserId>", "<student2UserId>"]
}
```

## Create Exam Request Body
```json
{
  "title": "Midterm 1",
  "course": "<courseId>",
  "batch": "<batchId>",
  "startTime": "2026-03-20T00:00:00.000Z",
  "endTime": "2026-12-31T23:59:59.000Z",
  "numQuestions": 3,
  "maxMarks": [10, 10, 10],
  "k": 1
}
```

## Submit Peer Evaluation Body
```json
{
  "evaluationId": "<evaluationId>",
  "marks": [8, 9, 7],
  "feedback": "Good work overall"
}
```

## IDs/Variables To Track During Test
- `adminToken`
- `teacherToken`
- `student1Token`
- `student2Token`
- `courseId`
- `batchId`
- `examId`
- `evaluationId`

## Notes
- If users already exist, skip register and continue with login.
- For upload step, use `backend/sample-upload.pdf`.
- Mask tokens/passwords in screenshots before sharing.
