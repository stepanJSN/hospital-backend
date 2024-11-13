export const messageTemplate = {
  customerCreateAppointment:
    '{customerName} {customerSurname} make an appointment with you on {date}',
  customerCancelAppointment:
    '{name} {surname} cancelled the appointment with you that was supposed to be on {date}',
  doctorCancelAppointment:
    'Doctor {name} {surname} cancelled the appointment with you that was supposed to be on {date}',
  doctorChangeSchedule: '{name} {surname} has changed his(her) work schedule',
  confirmEmail:
    '<h1>Confirm your email</h1><a href="http:localhost:8080/email-confirmation/{token}">Confirm</a>',
};
