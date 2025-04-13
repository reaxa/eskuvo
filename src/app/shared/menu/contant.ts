export interface Profile {
    name: string;
    email: string;
    password: string;
  }
  
  export const ProfileObject: Profile[] = [
    {
      name: 'Teszt Elek',
      email: 'teszt@elek.hu',
      password: 'titkos123'
    },
    {
      name: 'Kovács Anna',
      email: 'anna.kovacs@example.com',
      password: 'jelszo456'
    },
    {
      name: 'Nagy Péter',
      email: 'peter.nagy@example.com',
      password: 'valami789'
    }
  ];
  