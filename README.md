# Hospital backend

“Hospital” is an application to make doctor's appointments more comfortable. It offers a user-friendly interface for all users: administrators, patients and doctors. 
This is the backend part. Frontend: https://github.com/Stepan22-prog/hospital-frontend
The service responsible for saving notifications is located in a separate repository: https://github.com/Stepan22-prog/hospital-notification

## Functionality
**Patients(customers)**

 - Registration and authorization
 - Search for doctors (filters can be used)
 - Make an appointment for a available time
 - View appointments
 - Edit adn delete personal profile
 - Receiving notifications of cancellation of an appointment

**Doctors(staff)**

 - Authorization
 - Viewing and filtering enrolled patients
 - Export recorded patients to Excel
 - Change work schedule
 - Edit and delete a profile
 - Receiving notifications of appointments or cancellations

**Admin**

 - Authorization
 - Staff management( doctors). Creating, changing profile and schedule,
   deleting
 - Export of staff list to excel
 - View and delete patients
 - Management of specializations. Creating, modifying and deleting
 - Receiving notifications about changes in doctors' work schedules

## TechStack

 - TypeScript
 - MySQL
 - Nest
 - Prisma
 - Docker
 - Cloud Storage
 - Google Cloud Pub/Sub

## Run
1.  Clone project's repo:  `git clone https://github.com/Stepan22-prog/hospital-backend.git`
2.  In the folder replace in file  **.env**  key values to real
3.  Run:  `npm install`
4.  To start the server in the command line (terminal) in the folder, run:  `npm run start:dev`
## Visit website
The application was uploaded to GSP: https://hospital-front-632qvqq2oq-od.a.run.app