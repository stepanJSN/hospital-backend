# 🏥Hospital backend
![Static Badge](https://img.shields.io/badge/typescript-a?&logo=typescript&color=%23D4FAFF)
![NEST__BADGE](https://img.shields.io/badge/nest-7026b9?&logo=nestjs&color=%23E0234E)
![Static Badge](https://img.shields.io/badge/mysql-a?style=flat&logo=mysql&color=white)
![Static Badge](https://img.shields.io/badge/prisma-a?style=flat&logo=prisma&color=%232D3748)
![Static Badge](https://img.shields.io/badge/docker-a?style=flat&logo=docker&color=black)
![Static Badge](https://img.shields.io/badge/google%20cloud-a?style=flat&logo=googlecloud&color=red)

“Hospital” is an application to make doctor's appointments more comfortable. It offers a user-friendly interface for all users: administrators, patients and doctors. 

🌐Frontend(*This is a new version of the API, so the frontend will temporarily not work with it*): https://github.com/Stepan22-prog/hospital-frontend

## 🎯 Functionality
**👥 Patients(customers)**

 - 🔐 Registration and authorization
 - 🔍 Search for doctors (filters can be used)
 - 📅 Make an appointment for a available time
 - 📄 View appointments
 - ✏️ Edit and delete personal profile
 - 🔔 Receiving notifications of cancellation of an appointment

**🩺 Doctors**

 - 🔐 Authorization
 - 📋 Viewing and filtering enrolled patients
 - 📤 Export recorded patients to Excel
 - 🕒 Change work schedule
 - ✏️ Edit and delete a profile
 - 🔔 Receiving notifications of appointments or cancellations

**🛡️ Admin**

 - 🔐 Authorization
 - 👥 Staff management: creating, changing, deleting profile and schedule,
 - 📤 Export list of users to excel
 - ❌ View and delete patients
 - ⚕️ Management of specializations. Creating, modifying and deleting
 - 🔔 Receiving notifications about changes in doctors' work schedules

## 🛠️ TechStack

 - 🌐 TypeScript
 - 🗄️ MySQL
 - ⚙️ Nest
 - 📊 Prisma
 - 🐳 Docker
 - ☁️Cloud Storage

## 🚀 Getting started
1.  Clone project's repo:  `git clone https://github.com/Stepan22-prog/hospital-backend.git`
2.  Create MySQL database
3.  Create an **.env** file and fill it in according to the example in **.env.example**
5.  Run:  `npm install`
5.  To start the server in the command line (terminal) in the folder, run:  `npm run start:dev`

## 🌐 Visit website
The application was uploaded to GSP: (temporarily unavailable)

## 👨‍💻 Author
- **Stepan Stadniuk**
- **GitHub**: [Stepan22-prog](https://github.com/Stepan22-prog)
- **LinkedIn**: [Stepan Stadniuk](https://github.com/Stepan22-prog/hospital-frontend)